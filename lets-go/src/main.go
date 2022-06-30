package main

import (
	"lets-go/src/lib/cache"
	"lets-go/src/lib/dns"
	"lets-go/src/lib/log"
	"os"
	"path/filepath"
	"strings"
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

	if err := dns.LoadConfig(filepath.Dir(os.Args[CONFIG]), strings.TrimSuffix(filepath.Base(os.Args[CONFIG]), filepath.Ext(os.Args[ADDR])), strings.Trim(filepath.Ext(os.Args[CONFIG]), ".")); err != nil {
		logger.Panicf("Failed on load DNS config: %v", err)
	}

	dns := dns.NewDNS("udp", os.Args[ADDR])
	defer dns.Close()

	logger.Infof("DNS Server has been started: '%s'", os.Args[ADDR])

	if err := dns.Run(); err != nil {
		logger.Panicf("Failed on starting up DNS Server: %v", err)
	}
}
