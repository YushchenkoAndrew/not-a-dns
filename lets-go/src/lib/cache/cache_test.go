package cache_test

import (
	"context"
	"lets-go/src/lib/cache"
	pb "lets-go/src/pb/cachepb"
	"sync"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestBasic(t *testing.T) {
	ctx := context.Background()

	defer func() {
		require.NoError(t, cache.Conn().Close())
	}()

	var values = []pb.SetRequest{
		{Key: "HELLO", Value: "111111"},
		{Key: "WORLD", Value: "222222"},
		{Key: "TEST1", Value: "333333"},
		{Key: "TEST2", Value: "444444"},
		{Key: "TEST3", Value: "555555"},
		{Key: "TEST4", Value: "666666"},
		{Key: "TEST5", Value: "777777"},
		{Key: "TEST6", Value: "888888"},
		{Key: "TEST7", Value: "999999"},
		{Key: "TEST8", Value: "aaaaaa"},
		{Key: "TEST9", Value: "bbbbbb"},
		{Key: "HELLO WORLD", Value: "cccccc"},
	}

	var wg sync.WaitGroup

	// Set values
	for i := 0; i < len(values); i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			res, err := cache.Client().Set(ctx, &values[i])
			require.NoError(t, err)
			require.Equal(t, pb.Status_OK, res.Status)
		}(i)
	}

	wg.Wait()

	// Check values
	for i := 0; i < len(values); i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			res, err := cache.Client().Get(ctx, &pb.GetRequest{Key: values[i].Key})
			require.NoError(t, err)
			require.Equal(t, pb.Status_OK, res.Status)
			require.Equal(t, values[i].Value, res.Result)
		}(i)
	}

	wg.Wait()

	res, err := cache.Client().Keys(ctx, &pb.Request{Key: "TEST"})
	require.NoError(t, err)
	require.Equal(t, pb.Status_OK, res.Status)
	require.NotEmpty(t, res.Result)
	require.Equal(t, 9, len(res.Result))
}
