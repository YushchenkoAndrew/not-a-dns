package dns

import (
	"net"

	"golang.org/x/net/dns/dnsmessage"
)

type record interface {
	res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode)
}

type ARecord struct {
	Record
}

func (s *ARecord) res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode) {
	var ip = net.ParseIP(s.Value)
	if ip == nil {
		return nil, 0, dnsmessage.RCodeServerFailure
	}
	return &dnsmessage.AResource{A: [4]byte{ip[12], ip[13], ip[14], ip[15]}}, s.TTL, dnsmessage.RCodeSuccess
}

type NSRecord struct {
	Record
}

func (s *NSRecord) res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode) {
	NS, err := dnsmessage.NewName(s.Value)
	if err != nil {
		return nil, 0, dnsmessage.RCodeServerFailure
	}
	return &dnsmessage.NSResource{NS: NS}, s.TTL, dnsmessage.RCodeSuccess
}

type CNAMERecord struct {
	Record
}

func (s *CNAMERecord) res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode) {
	CNAME, err := dnsmessage.NewName(s.Value)
	if err != nil {
		return nil, 0, dnsmessage.RCodeServerFailure
	}
	return &dnsmessage.CNAMEResource{CNAME: CNAME}, s.TTL, dnsmessage.RCodeSuccess
}

type PTRRecord struct {
	Record
}

func (s *PTRRecord) res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode) {
	PTR, err := dnsmessage.NewName(s.Value)
	if err != nil {
		return nil, 0, dnsmessage.RCodeServerFailure
	}
	return &dnsmessage.PTRResource{PTR: PTR}, s.TTL, dnsmessage.RCodeSuccess
}

type MXRecord struct {
	Record
}

func (s *MXRecord) res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode) {
	// TODO: !!!!!!
	return &dnsmessage.MXResource{}, 0, dnsmessage.RCodeSuccess
}

type AAAARecord struct {
	Record
}

func (s *AAAARecord) res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode) {
	var ip = net.ParseIP(s.Value)
	if ip == nil {
		return nil, 0, dnsmessage.RCodeServerFailure
	}
	var IPv6 = [16]byte{}
	copy(IPv6[:], ip)
	return &dnsmessage.AAAAResource{AAAA: IPv6}, s.TTL, dnsmessage.RCodeSuccess
}

type TXTRecord struct {
	Record
}

func (s *TXTRecord) res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode) {
	// TODO: !!!!!!!!!
	return &dnsmessage.TXTResource{}, 0, dnsmessage.RCodeSuccess
}

type EmptyResource struct {
}

func (s *EmptyResource) res() (dnsmessage.ResourceBody, uint32, dnsmessage.RCode) {
	return nil, 0, dnsmessage.RCodeNotImplemented
}
