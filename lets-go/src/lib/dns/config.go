package dns

import (
	"fmt"

	"github.com/spf13/viper"
)

const (
	PREFIX = "Type"
	TYPE   = "yaml"
)

type Zone struct {
	Name    string
	TTL     uint16
	Records map[string]record
}

type Record struct {
	Name  string `mapstructure:"name"`
	Type  string `mapstructure:"type"`
	TTL   uint16 `mapstructure:"ttl"`
	Value string `mapstructure:"value"`
}

type FileStruct struct {
	DNS   []string `mapstructure:"dns"`
	Zones []struct {
		Name    string   `mapstructure:"name"`
		TTL     uint16   `mapstructure:"ttl"`
		Records []Record `mapstructure:"records"`
	} `mapstructure:"zones"`
}

type dnsConfig struct {
	path, name string

	DNS   []string
	Zones map[string]Zone
}

func NewConfig(path, name string) dnsConfig {
	return dnsConfig{path: path, name: name, DNS: []string{}, Zones: make(map[string]Zone)}
}

func (s *dnsConfig) Load() error {
	viper.AddConfigPath(s.path)
	viper.SetConfigName(s.name)
	viper.SetConfigType(TYPE)

	viper.AutomaticEnv()
	if err := viper.ReadInConfig(); err != nil {
		return fmt.Errorf("Failed on reading operations file")
	}

	// TODO: Save DNS && ZOne in Cache !!
	var config FileStruct
	if err := viper.Unmarshal(&config); err != nil {
		return fmt.Errorf("Failed on reading operation file")
	}

	// Form map
	s.DNS = config.DNS
	for _, cfg := range config.Zones {
		var records = make(map[string]record)
		for _, record := range cfg.Records {
			var name = PREFIX + record.Name
			switch record.Type {
			case "A":
				records[name] = &ARecord{record}

			case "NS":
				records[name] = &NSRecord{record}

			case "CNAME":
				records[name] = &CNAMERecord{record}

			case "PTR":
				records[name] = &PTRRecord{record}

			case "MX":
				records[name] = &MXRecord{record}

			case "AAAA":
				records[name] = &AAAARecord{record}

			case "TXT":
				records[name] = &TXTRecord{record}

				// TODO:
			default:
				records[name] = &EmptyResource{}
			}
		}

		s.Zones[cfg.Name] = Zone{Name: cfg.Name, TTL: cfg.TTL, Records: records}
	}

	return nil
}
