package models

type Status int32

const (
	Status_OK  Status = 0
	Status_ERR Status = 1
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
