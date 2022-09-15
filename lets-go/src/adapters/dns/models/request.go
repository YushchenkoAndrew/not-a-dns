package models

type DnsRecordRequest struct {
	Name     string `json:"name,omitempty"`
	Type     string `json:"type,omitempty"`
	Ttl      uint32 `json:"ttl,omitempty"`
	Value    string `json:"value,omitempty"`
	Priority uint32 `json:"priority,omitempty"`
	Weight   uint32 `json:"weight,omitempty"`
	Port     uint32 `json:"port,omitempty"`
	Target   string `json:"target,omitempty"`
	Flag     uint32 `json:"flag,omitempty"`
	Tag      string `json:"tag,omitempty"`
}

type DnsUpdateRequest struct {
	Old *DnsRecordRequest `json:"old,omitempty"`
	New *DnsRecordRequest `json:"new,omitempty"`
}
