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

	RecordHandler = map[uint16]func([]record, ConfigRecord) []record{
		dns.TypeA:  func(records []record, r ConfigRecord) []record { return append(records, &ARecord{r}) },
		dns.TypeNS: func(records []record, r ConfigRecord) []record { return append(records, &NSRecord{r}) },
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

type ConfigDNS struct {
	Nameservers []string `mapstructure:"nameservers"`
	Zones       []struct {
		Name    string         `mapstructure:"name"`
		TTL     uint32         `mapstructure:"ttl"`
		Records []ConfigRecord `mapstructure:"records"`
	} `mapstructure:"zones"`

	dns.Type
}
