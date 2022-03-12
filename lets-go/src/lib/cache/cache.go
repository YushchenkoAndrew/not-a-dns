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

func init() {
	var err error
	if conn, err = grpc.Dial(os.Getenv("CACHE_ADDR"), []grpc.DialOption{}); err != nil {
		panic(err)
	}

	client = cache.NewCacheServiceClient(conn)
}
