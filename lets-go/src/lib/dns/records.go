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

	a := dns.A{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		A:   ip[12:16],
	}

	return a.String()
}

func NSRecordConv(c *ConfigRecord) string {
	ns := dns.NS{
		Hdr: dns.RR_Header{Name: c.Name, Rrtype: RRTypeToInt[c.Type], Class: dns.ClassINET, Ttl: c.TTL},
		Ns:  c.Value,
	}

	return ns.String()
}

type CNAMERecord struct {
	ConfigRecord
}

func (s *CNAMERecord) res() (dnsmessage.ResourceBody, uint32, int) {
	CNAME, err := dnsmessage.NewName(s.Value)
	if err != nil {
		return nil, 0, dns.RcodeServerFailure
	}
	return &dnsmessage.CNAMEResource{CNAME: CNAME}, s.TTL, dns.RcodeSuccess
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

type MXRecord struct {
	ConfigRecord
}

func (s *MXRecord) res() (dnsmessage.ResourceBody, uint32, int) {
	// TODO: !!!!!!
	return &dnsmessage.MXResource{}, 0, dns.RcodeSuccess
}

type AAAARecord struct {
	ConfigRecord
}

func (s *AAAARecord) res() (dnsmessage.ResourceBody, uint32, int) {
	var ip = net.ParseIP(s.Value)
	if ip == nil {
		return nil, 0, dns.RcodeServerFailure
	}
	var IPv6 = [16]byte{}
	copy(IPv6[:], ip)
	return &dnsmessage.AAAAResource{AAAA: IPv6}, s.TTL, dns.RcodeSuccess
}

type TXTRecord struct {
	ConfigRecord
}

func (s *TXTRecord) res() (dnsmessage.ResourceBody, uint32, int) {
	// TODO: !!!!!!!!!
	return &dnsmessage.TXTResource{}, 0, dns.RcodeSuccess
}

type EmptyResource struct {
}

func (s *EmptyResource) res() (dns.RR, int) {
	return nil, dns.RcodeNotImplemented
}
