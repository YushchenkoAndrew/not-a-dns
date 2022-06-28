package dns

import (
	"context"
	"fmt"
	"lets-go/src/lib/cache"
	"strings"

	pb "lets-go/src/pb/cache"

	"github.com/miekg/dns"
	"github.com/spf13/viper"
)

func LoadConfig(path, name, ext string) error {
	viper.AddConfigPath(path)
	viper.SetConfigName(name)
	viper.SetConfigType(ext)

	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		logger.Errorf("Failed on reading dns config file: %v", err)
		return err
	}

	var config ConfigDNS
	if err := viper.Unmarshal(&config); err != nil {
		logger.Errorf("Failed on reading dns config file: %v", err)
		return err
	}

	// Form map
	res, err := cache.Client().Set(
		context.Background(),
		&pb.SetRequest{
			Key:   NAMESERVERS_KEY,
			Value: strings.Join(config.Nameservers, "|"),
		})

	if err != nil || res.Status != pb.Status_OK {
		logger.Errorf("Cache error: %s %v", res.Message, err)
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

					// TODO: Use dns toString()
					Key:   fmt.Sprintf("ZONE:%s.:%d:%d", cfg.Name, RRTypeToInt[record.Type], i),
					Value: fmt.Sprintf("%s|%d|%s", record.Name, ttl, record.Value),
				})

			if err != nil {
				logger.Errorf("Failed with 'set' request: %v", err)
			}

			if res.Status != pb.Status_OK {
				logger.Errorf("Cached side error: %s", res.Message)
			}
		}
	}

	return nil
}

func init() {
	r := new(dns.MX)
	r.Hdr = dns.RR_Header{Name: "miek.nl.", Rrtype: dns.TypeMX, Class: dns.ClassINET, Ttl: 3600}
	r.Preference = 10
	r.Mx = "mx.miek.nl."

	fmt.Printf("TEST: %s", r.String())
}
