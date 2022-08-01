package record

import (
	"lets-go/src/pb/dnspb"

	"github.com/miekg/dns"
)

var (
	RecordToRequest = map[uint16]func(dns.RR) *dnspb.RecordRequest{
		dns.TypeA:     func(r dns.RR) *dnspb.RecordRequest { return aRecord(r.(*dns.A)) },
		dns.TypeAAAA:  func(r dns.RR) *dnspb.RecordRequest { return aaaaRecord(r.(*dns.AAAA)) },
		dns.TypeCAA:   func(r dns.RR) *dnspb.RecordRequest { return caaRecord(r.(*dns.CAA)) },
		dns.TypeCNAME: func(r dns.RR) *dnspb.RecordRequest { return cnameRecord(r.(*dns.CNAME)) },
		dns.TypeMX:    func(r dns.RR) *dnspb.RecordRequest { return mxRecord(r.(*dns.MX)) },
		// dns.TypeNAPTR:    func(records []record, r Record) []record { return append(records, &MXRecord{r}) },
		dns.TypeNS:  func(r dns.RR) *dnspb.RecordRequest { return nsRecord(r.(*dns.NS)) },
		dns.TypePTR: func(r dns.RR) *dnspb.RecordRequest { return ptrRecord(r.(*dns.PTR)) },
		// dns.TypeSOA:   func(records []record, r Record) []record { return append(records, &PTRRecord{r}) },
		dns.TypeSRV: func(r dns.RR) *dnspb.RecordRequest { return srvRecord(r.(*dns.SRV)) },
		dns.TypeTXT: func(r dns.RR) *dnspb.RecordRequest { return txtRecord(r.(*dns.TXT)) },
	}
)
