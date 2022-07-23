package record

import (
	"context"
	"lets-go/src/pb/dnspb"
)

type Storage interface {
	List(context.Context, *dnspb.Request) (*dnspb.ListResponse, error)
	Create(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error)
	Update(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error)
	Delete(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error)
}
