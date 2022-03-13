package cache

import (
	"lets-go/src/pb/cache"
	"os"

	"google.golang.org/grpc"
)

var conn *grpc.ClientConn
var client cache.CacheServiceClient

func Conn() *grpc.ClientConn {
	return conn
}

func Client() cache.CacheServiceClient {
	return client
}

const (
	ADDR_KEY     = "CACHE_ADDR"
	DEFAULT_ADDR = "[::1]:50051"
)

func init() {
	var err error

	if value, ok := os.LookupEnv(ADDR_KEY); ok {
		conn, err = grpc.Dial(value, grpc.WithInsecure())
	} else {
		conn, err = grpc.Dial(DEFAULT_ADDR, grpc.WithInsecure())
	}

	if err != nil {
		panic(err)
	}

	client = cache.NewCacheServiceClient(conn)
}
