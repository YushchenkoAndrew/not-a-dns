package record

import (
	"lets-go/src/adapters/dns/models"
	config "lets-go/src/lib/dns"

	"github.com/miekg/dns"
)

var (
	RecordToRequest = map[uint16]func(dns.RR) *models.DnsRecordRequest{
		dns.TypeA:     func(r dns.RR) *models.DnsRecordRequest { return aRecord(r.(*dns.A)) },
		dns.TypeAAAA:  func(r dns.RR) *models.DnsRecordRequest { return aaaaRecord(r.(*dns.AAAA)) },
		dns.TypeCAA:   func(r dns.RR) *models.DnsRecordRequest { return caaRecord(r.(*dns.CAA)) },
		dns.TypeCNAME: func(r dns.RR) *models.DnsRecordRequest { return cnameRecord(r.(*dns.CNAME)) },
		dns.TypeMX:    func(r dns.RR) *models.DnsRecordRequest { return mxRecord(r.(*dns.MX)) },
		// dns.TypeNAPTR:    func(records []record, r Record) []record { return append(records, &MXRecord{r}) },
		dns.TypeNS:  func(r dns.RR) *models.DnsRecordRequest { return nsRecord(r.(*dns.NS)) },
		dns.TypePTR: func(r dns.RR) *models.DnsRecordRequest { return ptrRecord(r.(*dns.PTR)) },
		// dns.TypeSOA:   func(records []record, r Record) []record { return append(records, &PTRRecord{r}) },
		dns.TypeSRV: func(r dns.RR) *models.DnsRecordRequest { return srvRecord(r.(*dns.SRV)) },
		dns.TypeTXT: func(r dns.RR) *models.DnsRecordRequest { return txtRecord(r.(*dns.TXT)) },
	}
)

type RecordRequest struct {
	Name     string `json:"name,omitempty"`
	Type     string `json:"type,omitempty"`
	Ttl      uint32 `json:"ttl,omitempty"`
	Value    string `json:"value,omitempty"`
	Priority uint32 `json:"priority,omitempty"`
	Weight   uint32 `json:"weight,omitempty"`
	Port     uint32 `json:"port,omitempty"`
	Target   string `json:"target,omitempty"`
	Flag     uint32 `json:"flag,omitempty"`
	Tag      string `json:"tag,omitempty"`
}

func NewRecordRequest() *RecordRequest {
	return &RecordRequest{}
}

func (m *RecordRequest) ToModel(p *models.DnsRecordRequest) *RecordRequest {
	return &RecordRequest{
		Name:     p.Name,
		Type:     p.Type,
		Ttl:      p.Ttl,
		Value:    p.Value,
		Priority: p.Priority,
		Weight:   p.Weight,
		Port:     p.Port,
		Target:   p.Target,
		Flag:     p.Flag,
		Tag:      p.Tag,
	}
}

func (m *RecordRequest) ToConfig() *config.ConfigRecord {
	return &config.ConfigRecord{
		Name:     m.Name,
		Type:     m.Type,
		TTL:      m.Ttl,
		Value:    m.Value,
		Priority: uint16(m.Priority),
		Weight:   uint16(m.Weight),
		Port:     uint16(m.Port),
		Target:   m.Target,
		Flag:     uint8(m.Flag),
		Tag:      m.Tag,
	}
}
