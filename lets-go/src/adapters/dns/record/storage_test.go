package record_test

import (
	"context"
	"lets-go/src/adapters/dns/record"
	"lets-go/src/pb"
	"testing"

	"github.com/stretchr/testify/require"
)

var (
	store = record.NewStorage()
)

func TestBasic(t *testing.T) {
	ctx := context.Background()

	records := []pb.DnsRecordRequest{
		{Name: "test_basic_a.net", Ttl: 3600, Type: "A", Value: "192.168.1.1"},
		{Name: "test_basic_srv.net", Ttl: 400, Type: "SRV", Target: "test.net"},
		{Name: "test_basic_cname.net", Ttl: 410, Type: "CNAME", Target: "test.net"},
		{Name: "test_basic_txt.net", Ttl: 3600, Type: "TXT", Value: "HELLO WORLD"},
		{Name: "test_basic_mx.net", Ttl: 3600, Type: "MX", Target: "brr.com"},
	}

	for _, r := range records {
		require.NoError(t, store.Create(ctx, &r))
	}

	checkIfRecordsExists(t, records)

	newRecord := []pb.DnsRecordRequest{
		{Name: "test_basic_a.net", Ttl: 5, Type: "A", Value: "192.168.1.1"},
		{Name: "test_basic_srv.net", Ttl: 400, Type: "SRV", Target: "test2.net"},
		{Name: "test_basic_cname.net.com", Ttl: 410, Type: "CNAME", Target: "test.net"},
		{Name: "test_basic_txt.net", Ttl: 3600, Type: "TXT", Value: "hello world"},
		{Name: "test_basic_mx.net", Ttl: 3600, Type: "MX", Target: "brr.com"},
	}

	for i, r := range records {
		require.NoError(t, store.Update(ctx, &pb.DnsUpdateRequest{Old: &r, New: &newRecord[i]}))
	}

	checkIfRecordsExists(t, newRecord)

	for _, r := range newRecord {
		require.NoError(t, store.Delete(ctx, &r))
	}

	list, err := store.List(ctx, &pb.DnsRequest{})
	require.NoError(t, err)
	require.NotEmpty(t, list)

	for _, r := range records {
		var found = false

		for _, res := range list {
			if res.Name == r.Name {
				found = true
				break
			}
		}

		require.False(t, found)
	}
}

func checkIfRecordsExists(t *testing.T, records []pb.DnsRecordRequest) {
	ctx := context.Background()

	list, err := store.List(ctx, &pb.DnsRequest{})
	require.NoError(t, err)
	require.NotEmpty(t, list)

	for _, r := range records {
		var item *pb.DnsRecordRequest = nil

		for _, res := range list {
			if res.Name == r.Name {
				item = res
				break
			}
		}

		require.NotNil(t, item)
		require.Equal(t, r.Name, item.Name)
		require.Equal(t, r.Ttl, item.Ttl)
		require.Equal(t, r.Type, item.Type)
		require.Equal(t, r.Value, item.Value)
		require.Equal(t, r.Target, item.Target)
	}
}
