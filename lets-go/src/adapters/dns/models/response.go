package models

type Status string

const (
	Status_OK  Status = "OK"
	Status_ERR Status = "ERR"
)

type DnsListResponse struct {
	Status  Status              `json:"status,omitempty"`
	Message string              `json:"message,omitempty"`
	Result  []*DnsRecordRequest `json:"result,omitempty"`
}

type DnsStatResponse struct {
	Status  Status `json:"status,omitempty"`
	Message string `json:"message,omitempty"`
}
