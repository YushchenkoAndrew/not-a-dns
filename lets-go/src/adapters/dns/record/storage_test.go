package record_test

import (
	"context"
	"lets-go/src/adapters/dns/models"
	"lets-go/src/adapters/dns/record"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

var (
	store = record.NewStorage()
)

func TestBasic(t *testing.T) {
	ctx := context.Background()

	records := []models.DnsRecordRequest{
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

	newRecord := []models.DnsRecordRequest{
		{Name: "test_basic_a.net.2", Ttl: 5, Type: "A", Value: "192.168.1.1"},
		{Name: "test_basic_srv.net", Ttl: 400, Type: "SRV", Target: "test2.net"},
		{Name: "test_basic_cname.net.com", Ttl: 410, Type: "CNAME", Target: "test.net"},
		{Name: "test_basic_txt.net", Ttl: 3600, Type: "TXT", Value: "hello world"},
		{Name: "test_basic_mx.net", Ttl: 3600, Type: "MX", Target: "brr.com"},
	}

	for i, r := range records {
		require.NoError(t, store.Update(ctx, &models.DnsUpdateRequest{Old: &r, New: &newRecord[i]}))
	}

	checkIfRecordsExists(t, newRecord)

	finalRecord := []models.DnsRecordRequest{
		{Name: "test_basic_a.net.", Ttl: 5, Type: "A", Value: "192.168.1.1"},
		{Name: "test_basic_srv.net2", Ttl: 400, Type: "SRV", Target: "test2.net"},
		{Name: "test_basic_cname.net2.com", Ttl: 410, Type: "CNAME", Target: "test.net"},
		{Name: "test_basic_txt.net2", Ttl: 3600, Type: "TXT", Value: "hello world"},
		{Name: "test_basic_mx.net2", Ttl: 3600, Type: "MX", Target: "brr.com"},
	}

	for i, r := range newRecord {
		require.NoError(t, store.Update(ctx, &models.DnsUpdateRequest{Old: &r, New: &finalRecord[i]}))
	}

	checkIfRecordsExists(t, finalRecord)

	for _, r := range finalRecord {
		require.NoError(t, store.Delete(ctx, &r))
	}

	list, err := store.List(ctx)
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

func checkIfRecordsExists(t *testing.T, records []models.DnsRecordRequest) {
	ctx := context.Background()

	list, err := store.List(ctx)
	require.NoError(t, err)
	require.NotEmpty(t, list)

	for _, r := range records {
		var item *models.DnsRecordRequest = nil

		for _, res := range list {
			if strings.TrimRight(res.Name, ".") == strings.TrimRight(r.Name, ".") {
				item = res
				break
			}
		}

		require.NotNil(t, item)
		require.Equal(t, strings.Trim(r.Name, ".")+".", item.Name)
		require.Equal(t, r.Ttl, item.Ttl)
		require.Equal(t, r.Type, item.Type)
		require.Equal(t, r.Value, item.Value)

		if r.Target == "" {
			require.Empty(t, item.Target)
		} else {
			require.Equal(t, strings.Trim(r.Target, ".")+".", item.Target)
		}
	}
}
