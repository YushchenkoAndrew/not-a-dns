package main

import (
	"fmt"
	"lets-go/src/lib/cache"
	"lets-go/src/lib/dns"
	"os"
)

const (
	ADDR   = 0
	CONFIG = 1
)

func main() {
	args := os.Args[1:]
	if len(args) < 2 {
		panic(fmt.Errorf("Expected 2 command line args but %d was given", len(args)))
	}

	// TODO: Use logger instead !!!
	fmt.Println("HELLO WORLD")

	defer func() {
		if err := cache.Conn().Close(); err != nil {
			// TODO: Use logger instead !!!
			fmt.Printf("%v", err)
		}
	}()

	dns, err := dns.NewDNS("udp", args[ADDR], args[CONFIG])
	if err != nil {
		panic(err)
	}

	defer dns.Close()
	dns.Run()
}
