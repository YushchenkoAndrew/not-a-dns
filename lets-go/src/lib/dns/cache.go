package dns

import (
	"context"
	"fmt"
	"lets-go/src/lib/cache"
	pb "lets-go/src/pb/cache"
	"strings"

	"github.com/miekg/dns"
)

const (
	NAMESERVERS_KEY = "NAMESERVERS"
	NAMESERVERS_SEP = "|"

	ZONE_KEY = "ZONE"
)

func getNameservers() []string {
	res, err := cache.Client().Get(
		context.Background(),
		&pb.GetRequest{Key: NAMESERVERS_KEY})

	logger.Debugf("Cache nameservers %+v\n", res)
	if err != nil || res.Status != pb.Status_OK {
		logger.Errorf("Cache error: %s %v", res.Message, err)
		return []string{}
	}

	return strings.Split(res.Result, NAMESERVERS_SEP)
}

func getRecord(domain string, qType uint16) (result []dns.RR) {
	res, err := cache.Client().Keys(context.Background(), &pb.Request{Key: fmt.Sprintf("%s:%s:%d", ZONE_KEY, domain, qType)})
	if err != nil || res.Status != pb.Status_OK {
		logger.Errorf("Cache error: %s %v", res.Message, err)
		return
	}

	for _, key := range res.Result {
		res, err := cache.Client().Get(context.Background(), &pb.GetRequest{Key: key})
		logger.Debugf("Cache record %+v\n", res)

		if err != nil || res.Status != pb.Status_OK {
			logger.Errorf("Cache error: %s %v", res.Message, err)
			continue
		}

		r, err := dns.NewRR(res.Result)
		if err != nil {
			logger.Errorf("RR error: %v", err)
			continue
		}

		result = append(result, r)
	}

	return
}
