package record

import (
	"context"
	"fmt"
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

func (s *storage) Create(ctx context.Context, req *dnspb.RecordRequest) error {
	r := record.NewRecordRequest().ToModel(req).ToConfig()

	if conv, ok := config.ConfigRecordToString[config.RRTypeToInt[r.Type]]; !ok || conv(r) == "" {
		return fmt.Errorf("Unsupported type: %s '%s'", r.Type, r.Name)
	}

	keys, err := cache.Client().Keys(context.Background(), &pb.Request{Key: fmt.Sprintf("%s:%s:%d", config.ZONE_KEY, r.Name, config.RRTypeToInt[r.Type])})
	if err != nil || keys.Status != pb.Status_OK {
		return fmt.Errorf("Cache error: %s %v", keys.Message, err)
	}

	res, err := cache.Client().Set(
		ctx,
		&pb.SetRequest{
			Key:   fmt.Sprintf("%s:%s:%d:%d", config.ZONE_KEY, r.Name, config.RRTypeToInt[r.Type], len(keys.Result)),
			Value: config.ConfigRecordToString[config.RRTypeToInt[r.Type]](r),
		})

	if err != nil || res.Status != pb.Status_OK {
		return fmt.Errorf("Cache error: %s %v", res.Message, err)
	}

	return nil
}

func (s *storage) Update(ctx context.Context, req *dnspb.UpdateRequest) error {
	key, err := s.findKey(ctx, req.Old)
	if err != nil {
		return err
	}

	r := record.NewRecordRequest().ToModel(req.New).ToConfig()
	if conv, ok := config.ConfigRecordToString[config.RRTypeToInt[r.Type]]; !ok || conv(r) == "" {
		return fmt.Errorf("Unsupported type: %s '%s'", r.Type, r.Name)
	}

	res, err := cache.Client().Set(ctx, &pb.SetRequest{Key: key, Value: config.ConfigRecordToString[config.RRTypeToInt[r.Type]](r)})
	if err != nil || res.Status != pb.Status_OK {
		return fmt.Errorf("Cache error: %s %v", res.Message, err)
	}

	return nil
}

func (s *storage) Delete(ctx context.Context, req *dnspb.RecordRequest) error {
	key, err := s.findKey(ctx, req)
	if err != nil {
		return err
	}

	if res, err := cache.Client().Del(ctx, &pb.Request{Key: key}); err != nil || res.Status != pb.Status_OK {
		return fmt.Errorf("Cache error: %s %v", res.Message, err)
	}

	return nil
}

func (s *storage) findKey(ctx context.Context, req *dnspb.RecordRequest) (string, error) {
	r := record.NewRecordRequest().ToModel(req).ToConfig()

	if conv, ok := config.ConfigRecordToString[config.RRTypeToInt[r.Type]]; !ok || conv(r) == "" {
		return "", fmt.Errorf("Unsupported type: %s '%s'", r.Type, r.Name)
	}

	keys, err := cache.Client().Keys(ctx, &pb.Request{Key: fmt.Sprintf("%s:%s:%d", config.ZONE_KEY, r.Name, config.RRTypeToInt[r.Type])})
	if err != nil || keys.Status != pb.Status_OK {
		return "", fmt.Errorf("Cache error: %s %v", keys.Message, err)
	}

	record := config.ConfigRecordToString[config.RRTypeToInt[r.Type]](r)

	for _, key := range keys.Result {
		res, err := cache.Client().Get(ctx, &pb.GetRequest{Key: key})
		if err != nil || res.Status != pb.Status_OK {
			return "", fmt.Errorf("Cache error: %s %v", res.Message, err)
		}

		if record == res.Result {
			return key, nil
		}
	}

	return "", fmt.Errorf("Key for the record: '%s' was not found", record)
}
