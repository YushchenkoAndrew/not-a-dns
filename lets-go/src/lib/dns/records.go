package dns

import (
	"net"

	"github.com/miekg/dns"
	"golang.org/x/net/dns/dnsmessage"
)

type record interface {
	res() string
}

func ARecordConv(c *ConfigRecord) string {
	var ip = net.ParseIP(c.Value)
	if ip == nil {
		return ""
	}

	res := dns.A{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		A:   ip[12:16],
	}

	return res.String()
}

func NSRecordConv(c *ConfigRecord) string {
	res := dns.NS{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Ns:  c.Value,
	}

	return res.String()
}

func SRVRecordConv(c *ConfigRecord) string {
	res := dns.SRV{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},

		Priority: c.Priority,
		Weight:   c.Weight,
		Port:     c.Port,
		Target:   c.Target,
	}

	return res.String()
}

func CNAMERecordConv(c *ConfigRecord) string {
	res := dns.CNAME{
		Hdr:    dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Target: c.Target,
	}

	return res.String()
}

type PTRRecord struct {
	ConfigRecord
}

func (s *PTRRecord) res() (dnsmessage.ResourceBody, uint32, int) {
	PTR, err := dnsmessage.NewName(s.Value)
	if err != nil {
		return nil, 0, dns.RcodeServerFailure
	}
	return &dnsmessage.PTRResource{PTR: PTR}, s.TTL, dns.RcodeSuccess
}

func MXRecordConv(c *ConfigRecord) string {
	res := dns.MX{
		Hdr:        dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Preference: c.Priority,
		Mx:         c.Target,
	}

	return res.String()
}

func AAAARecordConv(c *ConfigRecord) string {
	var ip = net.ParseIP(c.Value)
	if ip == nil {
		return ""
	}

	res := dns.AAAA{
		Hdr:  dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		AAAA: ip,
	}

	return res.String()
}

func TXTRecordConv(c *ConfigRecord) string {
	res := dns.TXT{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Txt: []string{c.Value},
	}

	return res.String()
}
