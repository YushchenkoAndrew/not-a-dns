package main

import (
	"lets-go/src/lib/cache"
	"lets-go/src/lib/dns"
	"lets-go/src/lib/log"
	"os"
)

const (
	ADDR   = 1
	CONFIG = 2
)

func main() {
	var logger = log.GetLogger()

	if len(os.Args) < 3 {
		logger.Panicf("Expected 2 command line args but %d was given", len(os.Args)-1)
	}

	defer func() {
		if err := cache.Conn().Close(); err != nil {
			logger.Errorf("Failed on closing gRPC connection: %v", err)
		}
	}()

	dns, err := dns.NewDNS("udp", os.Args[ADDR], os.Args[CONFIG])
	if err != nil {
		logger.Panicf("Failed on starting up DNS Server: %v", err)
	}

	logger.Infof("DNS Server has been started: '%s'", os.Args[ADDR])
	defer dns.Close()
}
