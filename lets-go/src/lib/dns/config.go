package dns

import (
	"context"
	"fmt"
	"lets-go/src/lib/cache"
	"lets-go/src/lib/log"
	"strconv"
	"strings"

	pb "lets-go/src/pb/cache"

	"github.com/spf13/viper"
)

const (
	PREFIX = "Type"
)

type Record struct {
	Name  string `mapstructure:"name"`
	Type  string `mapstructure:"type"`
	TTL   uint32 `mapstructure:"ttl"`
	Value string `mapstructure:"value"`
}

type FileStruct struct {
	DNS   []string `mapstructure:"dns"`
	Zones []struct {
		Name    string   `mapstructure:"name"`
		TTL     uint32   `mapstructure:"ttl"`
		Records []Record `mapstructure:"records"`
	} `mapstructure:"zones"`
}

type dnsConfig struct {
	path, name, ext string
	handler         map[string]func([]record, Record) []record

	logger log.Logger

	// DNS   []string
	// Zones map[string]Zone
}

func NewConfig(path, name, ext string) dnsConfig {
	return dnsConfig{
		path:   path,
		name:   name,
		ext:    ext,
		logger: log.GetLogger(),
		handler: map[string]func([]record, Record) []record{
			"TypeA":     func(records []record, r Record) []record { return append(records, &ARecord{r}) },
			"TypeNS":    func(records []record, r Record) []record { return append(records, &NSRecord{r}) },
			"TypeCNAME": func(records []record, r Record) []record { return append(records, &CNAMERecord{r}) },
			"TypePTR":   func(records []record, r Record) []record { return append(records, &PTRRecord{r}) },
			"TypeMX":    func(records []record, r Record) []record { return append(records, &MXRecord{r}) },
			"TypeAAAA":  func(records []record, r Record) []record { return append(records, &AAAARecord{r}) },
			"TypeTXT":   func(records []record, r Record) []record { return append(records, &TXTRecord{r}) },
		},
	}
}

func (s *dnsConfig) Load() error {
	viper.AddConfigPath(s.path)
	viper.SetConfigName(s.name)
	viper.SetConfigType(s.ext)

	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		s.logger.Errorf("Failed on reading dns config file: %v", err)
		return err
	}

	// TODO: Save DNS && ZOne in Cache !!
	var config FileStruct
	if err := viper.Unmarshal(&config); err != nil {
		s.logger.Errorf("Failed on reading dns config file: %v", err)
		return err
	}

	// Form map
	res, err := cache.Client().Set(
		context.Background(),
		&pb.SetRequest{
			Key:   "DNS",
			Value: strings.Join(config.DNS, "|"),
		})

	if err != nil {
		s.logger.Errorf("Failed with 'set' request: %v", err)
	}

	if res.Status != pb.Status_OK {
		s.logger.Errorf("Cached side error: %s", res.Message)
	}

	var ttl uint32
	for _, cfg := range config.Zones {
		for i, record := range cfg.Records {
			if ttl = record.TTL; ttl == 0 {
				ttl = cfg.TTL
			}

			res, err = cache.Client().Set(
				context.Background(),
				&pb.SetRequest{
					Key:   fmt.Sprintf("ZONE:%s.:Type%s:%d", cfg.Name, record.Type, i),
					Value: fmt.Sprintf("%s|%d|%s", record.Name, ttl, record.Value),
				})

			if err != nil {
				s.logger.Errorf("Failed with 'set' request: %v", err)
			}

			if res.Status != pb.Status_OK {
				s.logger.Errorf("Cached side error: %s", res.Message)
			}
		}
	}

	return nil
}

func (s *dnsConfig) DNS() []string {
	res, err := cache.Client().Get(
		context.Background(),
		&pb.GetRequest{Key: "DNS"})

	if err != nil {
		s.logger.Errorf("Failed with 'set' request: %v", err)
		return []string{}
	}

	if res.Status != pb.Status_OK {
		s.logger.Errorf("Cached side error: %s", res.Message)
		return []string{}
	}

	return strings.Split(res.Result, "|")
}

func (s *dnsConfig) Get(domain, rType string) []record {
	var ctx = context.Background()
	res, _ := cache.Client().Keys(ctx, &pb.Request{Key: fmt.Sprintf("ZONE:%s:%s", domain, rType)})

	if res.Status != pb.Status_OK {
		s.logger.Errorf("Cached side error: %s", res.Message)
		return []record{}
	}

	var ok bool
	var records []record
	var handler func([]record, Record) []record

	if handler, ok = s.handler[rType]; !ok {
		handler = func(records []record, _ Record) []record { return append(records, &EmptyResource{}) }
	}

	for _, key := range res.Result {
		res, _ := cache.Client().Get(ctx, &pb.GetRequest{Key: key})
		if res.Status != pb.Status_OK {
			s.logger.Errorf("Cached side error: %s", res.Message)
			return []record{}
		}

		var data = strings.Split(res.Result, "|")
		ttl, _ := strconv.Atoi(data[1])
		records = handler(records, Record{
			Name:  data[0],
			Type:  rType,
			TTL:   uint32(ttl),
			Value: data[2],
		})
	}

	return records
}
