package record

import (
	"lets-go/src/pb/dnspb"

	"github.com/miekg/dns"
)

var (
	RecordToRequest = map[uint16]func(dns.RR) *dnspb.RecordRequest{
		dns.TypeA: func(r dns.RR) *dnspb.RecordRequest { return aRecord(r.(*dns.A)) },
		// dns.TypeAAAA:  func(r *ConfigRecord) string { return AAAARecordConv(r) },
		// dns.TypeCAA:   func(r *ConfigRecord) string { return CAARecordConv(r) },
		// dns.TypeCNAME: func(r *ConfigRecord) string { return CNAMERecordConv(r) },
		// dns.TypeMX:    func(r *ConfigRecord) string { return MXRecordConv(r) },
		// // dns.TypeNAPTR:    func(records []record, r Record) []record { return append(records, &MXRecord{r}) },
		// dns.TypeNS:  func(r *ConfigRecord) string { return NSRecordConv(r) },
		// dns.TypePTR: func(r *ConfigRecord) string { return PTRRecordConv(r) },
		// // dns.TypeSOA:   func(records []record, r Record) []record { return append(records, &PTRRecord{r}) },
		// dns.TypeSRV: func(r *ConfigRecord) string { return SRVRecordConv(r) },
		// dns.TypeTXT: func(r *ConfigRecord) string { return TXTRecordConv(r) },
	}
)
