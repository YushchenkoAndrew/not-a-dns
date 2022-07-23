package record

import (
	"context"
	"lets-go/src/domain/record"
	"lets-go/src/lib/cache"
	pb "lets-go/src/pb/cachepb"
	"lets-go/src/pb/dnspb"

	"github.com/miekg/dns"
)

type storage struct {
	cache pb.CacheServiceClient
}

func NewStorage() record.Storage {
	return &storage{cache: cache.Client()}
}

func (s *storage) List(ctx context.Context, req *dnspb.Request) (*dnspb.ListResponse, error) {
	res, err := s.cache.Keys(ctx, &pb.Request{})
	if err != nil || res.Status != pb.Status_OK {
		return nil, err
	}

	var values = make(map[uint16][]*dnspb.RecordRequest)

	for _, key := range res.Result {
		res, err := cache.Client().Get(ctx, &pb.GetRequest{Key: key})

		if err != nil || res.Status != pb.Status_OK {
			continue
		}

		r, err := dns.NewRR(res.Result)
		rtype := r.Header().Rrtype

		if _, ok := record.RecordToRequest[rtype]; !ok || err != nil {
			continue
		}

		// if _, ok := values[rtype]; !ok {
		// 	values[rtype] = []*dnspb.RecordRequest{}
		// }

		values[rtype] = append(values[rtype], record.RecordToRequest[rtype](r))
	}

	return nil, nil
}

func (s *storage) Create(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error) {
	return nil, nil
}

func (s *storage) Update(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error) {

	return nil, nil
}

func (s *storage) Delete(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error) {

	return nil, nil
}
