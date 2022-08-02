package record

import (
	"context"
	"lets-go/src/domain/record"
	"lets-go/src/lib/cache"
	config "lets-go/src/lib/dns"
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

func (s *storage) List(ctx context.Context, req *dnspb.Request) ([]*dnspb.RecordRequest, error) {
	res, err := s.cache.Keys(ctx, &pb.Request{})
	if err != nil || res.Status != pb.Status_OK {
		return nil, err
	}

	var result = []*dnspb.RecordRequest{}
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

		result = append(result, record.RecordToRequest[rtype](r))
	}

	return result, nil
}

func (s *storage) Create(ctx context.Context, req *dnspb.RecordRequest) (*dnspb.StatResponse, error) {

	// TODO:
	config.ConfigRecordToString[1](record.NewRecordRequest().ToModel(req).ToConfig())
	return nil, nil
}

func (s *storage) Update(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error) {

	return nil, nil
}

func (s *storage) Delete(context.Context, *dnspb.RecordRequest) (*dnspb.StatResponse, error) {

	return nil, nil
}
