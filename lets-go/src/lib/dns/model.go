package dns

import (
	"net"

	"golang.org/x/net/dns/dnsmessage"
)

type record interface {
	res() dnsmessage.ResourceBody
}

type ARecord struct {
	Record
}

func (s *ARecord) res() dnsmessage.ResourceBody {
	var ip = net.ParseIP(s.Value)
	return &dnsmessage.AResource{A: [4]byte{ip[12], ip[13], ip[14], ip[15]}}
}

type NSRecord struct {
	Record
}

func (s *NSRecord) res() dnsmessage.ResourceBody {
	return &dnsmessage.NSResource{}
}

type CNAMERecord struct {
	Record
}

func (s *CNAMERecord) res() dnsmessage.ResourceBody {
	return &dnsmessage.CNAMEResource{}
}

type PTRRecord struct {
	Record
}

func (s *PTRRecord) res() dnsmessage.ResourceBody {
	return &dnsmessage.PTRResource{}
}

type MXRecord struct {
	Record
}

func (s *MXRecord) res() dnsmessage.ResourceBody {
	return &dnsmessage.MXResource{}
}

type AAAARecord struct {
	Record
}

func (s *AAAARecord) res() dnsmessage.ResourceBody {
	return &dnsmessage.AAAAResource{}
}

type TXTRecord struct {
	Record
}

func (s *TXTRecord) res() dnsmessage.ResourceBody {
	return &dnsmessage.TXTResource{}
}

type EmptyResource struct {
}

func (s *EmptyResource) res() dnsmessage.ResourceBody {
	return &dnsmessage.Resource{}
}
