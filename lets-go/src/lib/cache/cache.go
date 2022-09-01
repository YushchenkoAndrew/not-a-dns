package cache

import (
	"lets-go/src/lib/log"
	"lets-go/src/pb"
	"os"

	"google.golang.org/grpc"
)

var conn *grpc.ClientConn
var client pb.CacheServiceClient

func Conn() *grpc.ClientConn {
	return conn
}

func Client() pb.CacheServiceClient {
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
		log.GetLogger().Panicf("Failed to connect to gRPC Server: %v", err)
	}

	client = pb.NewCacheServiceClient(conn)
}
