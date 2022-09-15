package record

import (
	"context"
	"lets-go/src/adapters/dns/models"
)

type Storage interface {
	List(context.Context) ([]*models.DnsRecordRequest, error)
	Create(context.Context, *models.DnsRecordRequest) error
	Update(context.Context, *models.DnsUpdateRequest) error
	Delete(context.Context, *models.DnsRecordRequest) error
}
