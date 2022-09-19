package record

import (
	"context"
	"fmt"
	"lets-go/src/adapters/dns/models"
	"lets-go/src/domain/record"
	"lets-go/src/lib/cache"
	config "lets-go/src/lib/dns"
	"lets-go/src/pb"

	"github.com/miekg/dns"
)

type storage struct {
	cache pb.CacheServiceClient
}

func NewStorage() record.Storage {
	return &storage{cache: cache.Client()}
}

func (s *storage) List(ctx context.Context) ([]*models.DnsRecordRequest, error) {
	res, err := s.cache.Keys(ctx, &pb.CacheRequest{})
	if err != nil || res.Status != pb.Status_OK {
		return nil, err
	}

	var result = []*models.DnsRecordRequest{}
	for _, key := range res.Result {
		res, err := cache.Client().Get(ctx, &pb.CacheGetRequest{Key: key})

		if err != nil || res.Status != pb.Status_OK {
			continue
		}

		r, err := dns.NewRR(res.Result)
		if err != nil {
			continue
		}

		rtype := r.Header().Rrtype
		if _, ok := record.RecordToRequest[rtype]; !ok || err != nil {
			continue
		}

		result = append(result, record.RecordToRequest[rtype](r))
	}

	return result, nil
}

func (s *storage) Create(ctx context.Context, req *models.DnsRecordRequest) error {
	r := record.NewRecordRequest().ToModel(req).ToConfig().Parse(nil)

	if conv, ok := config.ConfigRecordToString[config.RRTypeToInt[r.Type]]; !ok || conv(r) == "" {
		return fmt.Errorf("Unsupported type: %s '%s'", r.Type, r.Name)
	}

	keys, err := cache.Client().Keys(context.Background(), &pb.CacheRequest{Key: fmt.Sprintf("%s:%s:%d", config.ZONE_KEY, r.Name, config.RRTypeToInt[r.Type])})
	if err != nil || keys.Status != pb.Status_OK {
		return fmt.Errorf("Cache error: %s %v", keys.Message, err)
	}

	res, err := cache.Client().Set(
		ctx,
		&pb.CacheSetRequest{
			Key:   fmt.Sprintf("%s:%s:%d:%d", config.ZONE_KEY, r.Name, config.RRTypeToInt[r.Type], len(keys.Result)),
			Value: config.ConfigRecordToString[config.RRTypeToInt[r.Type]](r),
		})

	if err != nil || res.Status != pb.Status_OK {
		return fmt.Errorf("Cache error: %s %v", res.Message, err)
	}

	return nil
}

func (s *storage) Update(ctx context.Context, req *models.DnsUpdateRequest) error {
	if err := s.Delete(ctx, req.Old); err != nil {
		return err
	}

	return s.Create(ctx, req.New)
}

func (s *storage) Delete(ctx context.Context, req *models.DnsRecordRequest) error {
	key, err := s.findKey(ctx, req)
	if err != nil {
		return err
	}

	if res, err := cache.Client().Del(ctx, &pb.CacheRequest{Key: key}); err != nil || res.Status != pb.Status_OK {
		return fmt.Errorf("Cache error: %s %v", res.Message, err)
	}

	return nil
}

func (s *storage) findKey(ctx context.Context, req *models.DnsRecordRequest) (string, error) {
	r := record.NewRecordRequest().ToModel(req).ToConfig().Parse(nil)

	if conv, ok := config.ConfigRecordToString[config.RRTypeToInt[r.Type]]; !ok || conv(r) == "" {
		return "", fmt.Errorf("Unsupported type: %s '%s'", r.Type, r.Name)
	}

	keys, err := cache.Client().Keys(ctx, &pb.CacheRequest{Key: fmt.Sprintf("%s:%s:%d", config.ZONE_KEY, r.Name, config.RRTypeToInt[r.Type])})
	if err != nil || keys.Status != pb.Status_OK {
		return "", fmt.Errorf("Cache error: %s %v", keys.Message, err)
	}

	record := config.ConfigRecordToString[config.RRTypeToInt[r.Type]](r)

	for _, key := range keys.Result {
		res, err := cache.Client().Get(ctx, &pb.CacheGetRequest{Key: key})
		if err != nil || res.Status != pb.Status_OK {
			return "", fmt.Errorf("Cache error: %s %v", res.Message, err)
		}

		if record == res.Result {
			return key, nil
		}
	}

	return "", fmt.Errorf("Key for the record: '%s' was not found", record)
}
