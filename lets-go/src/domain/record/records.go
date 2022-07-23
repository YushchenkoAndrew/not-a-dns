package record

import (
	"lets-go/src/pb/dnspb"

	"github.com/miekg/dns"
)

func aRecord(r *dns.A) *dnspb.RecordRequest {
	return &dnspb.RecordRequest{
		// // info: https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/
		// Desc:   "A records only hold IPv4 addresses. The '@' symbol in this example indicates that this is a record for the root domain, and the TTL is (time to live), listed in seconds. The default TTL for A records is 14,400 seconds",
		// Fields: []string{"name", "type", "ttl", "value"},
		// FIXME:
		// Model:  &dnspb.RecordRequest{Name: r.Hdr.Name, Type: "A", Ttl: r.Hdr.Ttl, Value: string(r.A)},
		Name: r.Hdr.Name, Type: "A", Ttl: r.Hdr.Ttl, Value: string(r.A),
	}
}
