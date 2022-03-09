package dns

import (
	"fmt"
	"net"

	"golang.org/x/net/dns/dnsmessage"
)

const (
	BUF_SIZE = 1024
)

type DNS struct {
	config dnsConfig
	socket net.PacketConn
}

func NewDNS(network, addr, path, name string) (*DNS, error) {
	var err error
	var socket net.PacketConn

	if socket, err = net.ListenPacket("udp", addr); err != nil {
		return nil, err
	}

	config := NewConfig(path, name)
	if err = config.Load(); err != nil {
		return nil, err
	}

	return &DNS{config, socket}, nil
}

func (s *DNS) Close() {
	s.socket.Close()
}

func (s *DNS) Run() error {
	var err error
	var amount int
	var addr net.Addr

	buf := make([]uint8, BUF_SIZE)

	for {
		var message dnsmessage.Message
		if amount, addr, err = s.socket.ReadFrom(buf); err != nil {
			return err
		}

		if err = message.Unpack(buf[:amount]); err != nil {
			return err
		}

		go s.handler(addr, message)
	}
}

func (s *DNS) handler(addr net.Addr, message dnsmessage.Message) {
	if message.Header.Response {
		// TODO: Use cacheing to get IP addr !!!!
		// go s.res(&net.UDPAddr{IP: net.ParseIP("127.0.0.1")}, message)
		return
	}

	fmt.Printf("%#v\n\n", message)

	for _, question := range message.Questions {
		if zone, ok := s.config.Zones[question.Name.String()]; ok {
			if record, ok := zone.Records[question.Type.String()]; ok {

				for _, r := range record {
					body, ttl, rCode := r.res()
					if rCode != dnsmessage.RCodeSuccess {
						message.Header.RCode = rCode
						break
					}

					if ttl == 0 {
						ttl = zone.TTL
					}

					message.Answers = append(message.Answers, dnsmessage.Resource{
						Header: dnsmessage.ResourceHeader{Name: question.Name, Type: question.Type, Class: question.Class, TTL: ttl},
						Body:   body,
					})

				}
				continue
			}
		}

		// TODO: Go though all dns services in config
		s.res(&net.UDPAddr{IP: net.ParseIP("8.8.8.8"), Port: 53}, message)
	}

	go s.res(addr, message)
}

func (s *DNS) res(addr net.Addr, message dnsmessage.Message) {
	packed, err := message.Pack()
	if err != nil {
		panic(err)
	}

	if _, err := s.socket.WriteTo(packed, addr); err != nil {
		panic(err)
	}
}

// func (s *DNS) redirect(message dnsmessage.Message) []uint8 {
// 	// var err error
// 	// var socket net.Conn

// 	// res := make([]uint8, 1024)

// 	// // if socket, err = net.Dial("udp", "1.1.1.1:53"); err != nil {
// 	// // 	panic(err)
// 	// // }

// 	// defer socket.Close()

// 	// socket.Write(buf)
// 	// amount, _ := socket.Read(res)
// 	// // this.socket.WriteTo(buf, &net.UDPAddr{IP: net.ParseIP("8.8.8.8"), Port: 53})
// 	// // amount, _, _ := this.socket.ReadFrom(res)

// 	// // fmt.Println(this.format.ShowHeader(res))
// 	// // fmt.Println(this.format.ShowQuestion(res[12:]))
// 	// return res[:amount]
// }
