package record

import (
	"lets-go/src/pb/dnspb"

	"github.com/miekg/dns"
)

func aRecord(r *dns.A) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "A", Ttl: r.Hdr.Ttl, Value: r.A.String(),
	}
}

func aaaaRecord(r *dns.AAAA) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "AAAA", Ttl: r.Hdr.Ttl, Value: r.AAAA.String(),
	}
}

func caaRecord(r *dns.CAA) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "CAA", Ttl: r.Hdr.Ttl, Flag: uint32(r.Flag), Tag: r.Tag, Value: r.Value,
	}
}

func cnameRecord(r *dns.CNAME) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "CNAME", Ttl: r.Hdr.Ttl, Target: r.Target,
	}
}

func mxRecord(r *dns.MX) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "MX", Ttl: r.Hdr.Ttl, Priority: uint32(r.Preference), Target: r.Mx,
	}
}

func nsRecord(r *dns.NS) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "NS", Ttl: r.Hdr.Ttl, Value: r.Ns,
	}
}

func ptrRecord(r *dns.PTR) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "PTR", Ttl: r.Hdr.Ttl, Value: r.Ptr,
	}
}

func srvRecord(r *dns.SRV) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "SRV", Ttl: r.Hdr.Ttl, Priority: uint32(r.Priority), Weight: uint32(r.Weight), Port: uint32(r.Port), Target: r.Target,
	}
}

func txtRecord(r *dns.TXT) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		Name: r.Hdr.Name, Type: "TXT", Ttl: r.Hdr.Ttl, Value: r.Txt[0],
	}
}
