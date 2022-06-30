package dns

import (
	"github.com/miekg/dns"
)

var (
	RRTypeToInt = map[string]uint16{
		"A":     dns.TypeA,
		"NS":    dns.TypeNS,
		"CNAME": dns.TypeCNAME,
		"PTR":   dns.TypePTR,
		"MX":    dns.TypeMX,
		"AAAA":  dns.TypeAAAA,
		"TXT":   dns.TypeTXT,
	}

	ConfigRecordToString = map[uint16]func(*ConfigRecord) string{
		dns.TypeA:  func(r *ConfigRecord) string { return ARecordConv(r) },
		dns.TypeNS: func(r *ConfigRecord) string { return NSRecordConv(r) },
		// dns.TypeCNAME: func(records []record, r Record) []record { return append(records, &CNAMERecord{r}) },
		// dns.TypePTR:   func(records []record, r Record) []record { return append(records, &PTRRecord{r}) },
		// dns.TypeMX:    func(records []record, r Record) []record { return append(records, &MXRecord{r}) },
		// dns.TypeAAAA:  func(records []record, r Record) []record { return append(records, &AAAARecord{r}) },
		// dns.TypeTXT:   func(records []record, r Record) []record { return append(records, &TXTRecord{r}) },
	}
)

type ConfigRecord struct {
	Name     string `mapstructure:"name"`
	Type     string `mapstructure:"type"`
	TTL      uint32 `mapstructure:"ttl"`
	Value    string `mapstructure:"value"`
	Priority uint16 `mapstructure:"priority"`
}

func (c *ConfigRecord) copy() *ConfigRecord {
	return &ConfigRecord{
		Name:     c.Name,
		Type:     c.Type,
		TTL:      c.TTL,
		Value:    c.Value,
		Priority: c.Priority,
	}
}

type ConfigDNS struct {
	Nameservers []string `mapstructure:"nameservers"`
	Zones       []struct {
		Name    string         `mapstructure:"name"`
		TTL     uint32         `mapstructure:"ttl"`
		Records []ConfigRecord `mapstructure:"records"`
	} `mapstructure:"zones"`
}
