package record

import (
	"lets-go/src/adapters/dns/models"

	"github.com/miekg/dns"
)

func aRecord(r *dns.A) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "A", Ttl: r.Hdr.Ttl, Value: r.A.String(),
	}
}

func aaaaRecord(r *dns.AAAA) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "AAAA", Ttl: r.Hdr.Ttl, Value: r.AAAA.String(),
	}
}

func caaRecord(r *dns.CAA) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "CAA", Ttl: r.Hdr.Ttl, Flag: uint32(r.Flag), Tag: r.Tag, Value: r.Value,
	}
}

func cnameRecord(r *dns.CNAME) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "CNAME", Ttl: r.Hdr.Ttl, Target: r.Target,
	}
}

func mxRecord(r *dns.MX) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "MX", Ttl: r.Hdr.Ttl, Priority: uint32(r.Preference), Target: r.Mx,
	}
}

func nsRecord(r *dns.NS) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "NS", Ttl: r.Hdr.Ttl, Value: r.Ns,
	}
}

func ptrRecord(r *dns.PTR) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "PTR", Ttl: r.Hdr.Ttl, Value: r.Ptr,
	}
}

func srvRecord(r *dns.SRV) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "SRV", Ttl: r.Hdr.Ttl, Priority: uint32(r.Priority), Weight: uint32(r.Weight), Port: uint32(r.Port), Target: r.Target,
	}
}

func txtRecord(r *dns.TXT) *models.DnsRecordRequest {
	return &models.DnsRecordRequest{
		Name: r.Hdr.Name, Type: "TXT", Ttl: r.Hdr.Ttl, Value: r.Txt[0],
	}
}
