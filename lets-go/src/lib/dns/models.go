package dns

import (
	"strings"

	"github.com/miekg/dns"
)

var (
	RRTypeToInt = map[string]uint16{
		"A":     dns.TypeA,
		"AAAA":  dns.TypeAAAA,
		"CAA":   dns.TypeCAA,
		"CNAME": dns.TypeCNAME,
		"MX":    dns.TypeMX,
		// "NAPTR": dns.TypeNAPTR,
		"NS":  dns.TypeNS,
		"PTR": dns.TypePTR,
		// "SOA":   dns.TypeSOA,
		"SRV": dns.TypeSRV,
		"TXT": dns.TypeTXT,
	}

	ConfigRecordToString = map[uint16]func(*ConfigRecord) string{
		dns.TypeA:     aRecord,
		dns.TypeAAAA:  aaaaRecord,
		dns.TypeCAA:   caaRecord,
		dns.TypeCNAME: cnameRecord,
		dns.TypeMX:    mxRecord,
		// dns.TypeNAPTR:    func(records []record, r Record) []record { return append(records, &MXRecord{r}) },
		dns.TypeNS:  nsRecord,
		dns.TypePTR: ptrRecord,
		// dns.TypeSOA:   func(records []record, r Record) []record { return append(records, &PTRRecord{r}) },
		dns.TypeSRV: srvRecord,
		dns.TypeTXT: txtRecord,
	}
)

type ConfigRecord struct {
	Name     string `mapstructure:"name"`
	Type     string `mapstructure:"type"`
	TTL      uint32 `mapstructure:"ttl"`
	Value    string `mapstructure:"value"`
	Priority uint16 `mapstructure:"priority"`
	Weight   uint16 `mapstructure:"weight"`
	Port     uint16 `mapstructure:"port"`
	Target   string `mapstructure:"target"`
	Flag     uint8  `mapstructure:"flag"`
	Tag      string `mapstructure:"tag"`
}

func (c *ConfigRecord) copy() *ConfigRecord {
	return &ConfigRecord{
		Name:     c.Name,
		Type:     c.Type,
		TTL:      c.TTL,
		Value:    c.Value,
		Priority: c.Priority,
		Weight:   c.Weight,
		Port:     c.Port,
		Target:   c.Target,
	}
}

func (c *ConfigRecord) parse(cfg *ConfigZone) *ConfigRecord {
	r := c.copy()
	r.Name = trimHost(strings.ReplaceAll(r.Name, "@", trimHost(cfg.Name)))
	r.Target = trimHost(r.Target)

	if r.TTL == 0 {
		r.TTL = cfg.TTL
	}

	if r.Priority == 0 {
		r.Priority = cfg.Priority
	}

	if r.Weight == 0 {
		r.Weight = cfg.Weight
	}

	return r
}

type ConfigDNS struct {
	Nameservers []string     `mapstructure:"nameservers"`
	Zones       []ConfigZone `mapstructure:"zones"`
}

type ConfigZone struct {
	Name     string         `mapstructure:"name"`
	TTL      uint32         `mapstructure:"ttl"`
	Priority uint16         `mapstructure:"priority"`
	Weight   uint16         `mapstructure:"weight"`
	Records  []ConfigRecord `mapstructure:"records"`
}
