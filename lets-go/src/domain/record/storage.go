package record

import (
	"context"
	"lets-go/src/pb/dnspb"
)

type Storage interface {
	List(context.Context, *dnspb.Request) ([]*dnspb.RecordRequest, error)
	Create(context.Context, *dnspb.RecordRequest) error
	Update(context.Context, *dnspb.UpdateRequest) error
	Delete(context.Context, *dnspb.RecordRequest) error
}
