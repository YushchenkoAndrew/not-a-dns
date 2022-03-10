package dns

import (
	"net"
	"path/filepath"
	"strings"
	"time"

	"golang.org/x/net/dns/dnsmessage"
)

const (
	BUF_SIZE = 1024
	TIMEOUT  = 50 * time.Millisecond
)

type DNS struct {
	config dnsConfig
	socket net.PacketConn
}

func NewDNS(network, addr, path string) (*DNS, error) {
	var err error
	var socket net.PacketConn

	if socket, err = net.ListenPacket("udp", addr); err != nil {
		return nil, err
	}

	config := NewConfig(
		filepath.Dir(path),
		strings.TrimSuffix(filepath.Base(path),
			filepath.Ext(path)), strings.Trim(filepath.Ext(path), "."),
	)
	if err = config.Load(); err != nil {
		return nil, err
	}

	return &DNS{config, socket}, nil
}

func (s *DNS) Close() {
	s.socket.Close()
}

func (s *DNS) Run() {
	buf := make([]uint8, BUF_SIZE)

	for {
		var req dnsmessage.Message
		amount, addr, err := s.socket.ReadFrom(buf)
		if err != nil {
			// TODO: Log error !!!
			continue
		}

		if err = req.Unpack(buf[:amount]); err != nil {
			// TODO: Log error !!!
			continue
		}

		go func() {
			// if message.Header.Response {
			// 	// TODO: Use cacheing to get IP addr !!!!
			// 	// go s.res(&net.UDPAddr{IP: net.ParseIP("127.0.0.1")}, message)
			// 	return
			// }

			if RCode, answers := s.ReqHandler(req.Questions); RCode != dnsmessage.RCodeNameError {
				go s.Response(addr, &dnsmessage.Message{
					Header: dnsmessage.Header{
						ID:                 req.ID,
						Response:           true,
						OpCode:             req.OpCode,
						Authoritative:      req.Authoritative,
						Truncated:          req.Truncated,
						RecursionDesired:   req.RecursionDesired,
						RecursionAvailable: req.RecursionAvailable,
						RCode:              RCode,
					},
					Questions:   req.Questions,
					Answers:     answers,
					Authorities: req.Authorities,
					Additionals: req.Additionals,
				}, time.Time{})

				return
			}

			go s.ReqRedirect(&req)
		}()
	}
}

func (s *DNS) ReqHandler(questions []dnsmessage.Question) (dnsmessage.RCode, []dnsmessage.Resource) {
	var answers = []dnsmessage.Resource{}
	for _, question := range questions {
		if zone, ok := s.config.Zones[question.Name.String()]; ok {
			if record, ok := zone.Records[question.Type.String()]; ok {
				for _, r := range record {
					body, ttl, rCode := r.res()
					if rCode != dnsmessage.RCodeSuccess {
						return rCode, []dnsmessage.Resource{}
					}

					if ttl == 0 {
						ttl = zone.TTL
					}

					answers = append(answers, dnsmessage.Resource{
						Header: dnsmessage.ResourceHeader{Name: question.Name, Type: question.Type, Class: question.Class, TTL: ttl},
						Body:   body,
					})

				}
				continue
			}
		}

		return dnsmessage.RCodeNameError, []dnsmessage.Resource{}
	}

	return dnsmessage.RCodeSuccess, answers
}

func (s *DNS) ReqRedirect(req *dnsmessage.Message) {
	for _, dns := range s.config.DNS {
		// If we got a time out error then just try another DNS
		err := s.Response(&net.UDPAddr{IP: net.ParseIP(dns), Port: 53}, req, time.Now().Add(TIMEOUT))
		if err == nil {
			break
		}
	}
}

func (s *DNS) Response(addr net.Addr, message *dnsmessage.Message, timeout time.Time) error {
	var err error
	var buf []byte

	if buf, err = message.Pack(); err != nil {
		// TODO: Log !!!
		return nil
	}

	if err = s.socket.SetWriteDeadline(timeout); err != nil {
		// TODO: Log !!!
		return nil
	}

	if _, err = s.socket.WriteTo(buf, addr); err != nil && !timeout.IsZero() {
		return err
	}

	return nil
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
