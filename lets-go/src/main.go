package main

import (
	"fmt"
	"lets-go/src/adapters/api"
	"lets-go/src/composites"
	"lets-go/src/lib/cache"
	"lets-go/src/lib/dns"
	"lets-go/src/lib/log"
	"lets-go/src/pb"
	"net"
	"os"
	"path/filepath"
	"strings"

	"google.golang.org/grpc"
)

const (
	ADDR   = 1
	PORT   = 2
	CONFIG = 3
)

func main() {
	var logger = log.GetLogger()

	if len(os.Args) < 4 {
		logger.Panicf("Expected 3 command line args but %d was given", len(os.Args)-1)
	}

	defer func() {
		if err := cache.Conn().Close(); err != nil {
			logger.Errorf("Failed on closing gRPC connection: %v", err)
		}
	}()

	var addr = fmt.Sprintf("%s:%s", os.Args[ADDR], os.Args[PORT])
	if err := dns.LoadConfig(filepath.Dir(os.Args[CONFIG]), strings.TrimSuffix(filepath.Base(os.Args[CONFIG]), filepath.Ext(os.Args[CONFIG])), strings.Trim(filepath.Ext(os.Args[CONFIG]), ".")); err != nil {
		logger.Panicf("Failed on load DNS config: %v", err)
	}

	go func() {
		logger.Info("Initialize Server")
		listen, err := net.Listen("tcp", addr)
		if err != nil {
			logger.Fatal(err)
		}

		logger.Infof("Server start on %s", addr)

		var opts []grpc.ServerOption
		grpcServer := grpc.NewServer(opts...)

		pb.RegisterDnsServiceServer(grpcServer, api.NewHandler(composites.NewStorageComposite()))
		if err = grpcServer.Serve(listen); err != nil {
			logger.Errorf("gRPC error: %v", err)
		}
	}()

	dns := dns.NewDNS("udp", addr)
	defer dns.Close()

	logger.Infof("DNS Server has been started: '%s'", addr)

	if err := dns.Run(); err != nil {
		logger.Panicf("Failed on starting up DNS Server: %v", err)
	}
}
