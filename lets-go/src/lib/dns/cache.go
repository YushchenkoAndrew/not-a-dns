package dns

import (
	"context"
	"fmt"
	"lets-go/src/lib/cache"
	pb "lets-go/src/pb/cache"
	"strconv"
	"strings"
)

const (
	NAMESERVERS_KEY = "NAMESERVERS"
)

func Nameservers() []string {
	res, err := cache.Client().Get(
		context.Background(),
		&pb.GetRequest{Key: NAMESERVERS_KEY})

	if err != nil {
		logger.Errorf("Failed with 'set' request: %v", err)
		return []string{}
	}

	if res.Status != pb.Status_OK {
		logger.Errorf("Cached side error: %s", res.Message)
		return []string{}
	}

	return strings.Split(res.Result, "|")
}

func getRecord(domain string, qType uint16) []record {
	var ctx = context.Background()
	res, _ := cache.Client().Keys(ctx, &pb.Request{Key: fmt.Sprintf("ZONE:%s:%d", domain, qType)})

	if res.Status != pb.Status_OK {
		logger.Errorf("Cached side error: %s", res.Message)
		return []record{}
	}

	var ok bool
	var records []record
	var handler func([]record, ConfigRecord) []record

	if handler, ok = RecordHandler[qType]; !ok {
		handler = func(records []record, _ ConfigRecord) []record { return append(records, &EmptyResource{}) }
	}

	for _, key := range res.Result {
		res, _ := cache.Client().Get(ctx, &pb.GetRequest{Key: key})
		logger.Debugf("Cache %+v\n", res)

		if res.Status != pb.Status_OK {
			logger.Errorf("Cached side error: %s", res.Message)
			return []record{}
		}

		var data = strings.Split(res.Result, "|")
		ttl, _ := strconv.Atoi(data[1])
		records = handler(records, ConfigRecord{
			Name: data[0],
			// 	Type:  qType,
			TTL:   uint32(ttl),
			Value: data[2],
		})
	}

	return records
}
