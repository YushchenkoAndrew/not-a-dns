package main

import (
	"fmt"
	"lets-go/src/lib/dns"
)

func main() {
	fmt.Println("HELLO WORLD")
	var dns, err = dns.NewDNS("udp", "0.0.0.0:53", "./")
	if err != nil {
		panic(err)
	}

	if err = dns.Run(); err != nil {
		panic(err)
	}
}
