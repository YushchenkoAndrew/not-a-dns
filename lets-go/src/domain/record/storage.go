package record

import (
	"context"
	"lets-go/src/pb"
)

type Storage interface {
	List(context.Context, *pb.DnsRequest) ([]*pb.DnsRecordRequest, error)
	Create(context.Context, *pb.DnsRecordRequest) error
	Update(context.Context, *pb.DnsUpdateRequest) error
	Delete(context.Context, *pb.DnsRecordRequest) error
}
