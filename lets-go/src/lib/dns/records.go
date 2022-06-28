package dns

import (
	"net"

	"github.com/miekg/dns"
	"golang.org/x/net/dns/dnsmessage"
)

type record interface {
	res() (dns.RR, int)
}

type ARecord struct {
	ConfigRecord
}

func (s *ARecord) res() (dns.RR, int) {
	var ip = net.ParseIP(s.Value)
	if ip == nil {
		return nil, dns.RcodeServerFailure
	}

	return &dns.A{
		Hdr: dns.RR_Header{Name: s.Name, Rrtype: RRTypeToInt[s.Type], Class: dns.ClassINET, Ttl: s.TTL},
		A:   ip[12:16],
	}, dns.RcodeSuccess
}

type NSRecord struct {
	ConfigRecord
}

func (s *NSRecord) res() (dns.RR, int) {
	// FIXME:
	// NS, err := dnsmessage.NewName(s.Value)
	// if err != nil {
	// 	return nil, dns.RcodeServerFailure
	// }

	// return &dnsmessage.NSResource{NS: NS}, s.TTL, dns.RcodeSuccess

	return &dns.MX{
		Hdr: dns.RR_Header{Name: s.Name, Rrtype: RRTypeToInt[s.Type], Class: dns.ClassINET, Ttl: s.TTL},
	}, dns.RcodeSuccess
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
