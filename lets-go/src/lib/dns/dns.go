package dns

import (
	"fmt"
	"net"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"golang.org/x/net/dns/dnsmessage"
)

const (
	BUF_SIZE = 1024
	TIMEOUT  = 100 * time.Millisecond
)

type DNS struct {
	config dnsConfig
	socket net.PacketConn

	mu       sync.Mutex
	redirect map[uint16]net.Addr
}

// var reqStore = make(map[uint16]net.IP)

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

	return &DNS{config: config, socket: socket, redirect: make(map[uint16]net.Addr)}, nil
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
			fmt.Printf("%#v\n\n", req)

			if req.Response {
				// res, err := cache.Client().Get(context.Background(), &pb.GetRequest{Key: fmt.Sprintf("ID:%d", req.ID)})
				// if res.Status != pb.Status_OK || err != nil {
				// 	// TODO: Log error !!
				// 	return
				// }

				// addr, e := net.ResolveIPAddr("", res.Result)
				// fmt.Printf("%s => %v %v\n", res.Result, addr, e)
				// go s.Response(addr, &req, time.Time{})
				// addr := strings.Split(res.Result, " ")
				// port, _ := strconv.Atoi(addr[1])

				s.mu.Lock()
				defer s.mu.Unlock()

				if addr, ok := s.redirect[req.ID]; ok {
					// TODO: Save request in cache !!
					// cache.Client().Set(context.Background(), &pb.SetRequest{ Key: req.Questions[0].Name.String(), Value: req.Answers[0].Body })

					go s.Response(addr, &req, time.Time{})
					delete(s.redirect, req.ID)
				}

				return
			}

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

			go s.ReqRedirect(addr, &req)
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

func (s *DNS) ReqRedirect(addr net.Addr, req *dnsmessage.Message) {
	go func() {
		s.mu.Lock()
		defer s.mu.Unlock()

		s.redirect[req.ID] = addr

		// cache.Client().Set(
		// 	context.Background(),
		// 	&pb.SetRequest{
		// 		Key:   fmt.Sprintf("ID:%d", req.ID),
		// 		Value: fmt.Sprintf("%s %d", addr.(*net.UDPAddr).IP.String(), addr.(*net.UDPAddr).Port),
		// 	})
		// if  res.Status != pb.Status_OK || err != nil {
		// 	// TODO: Log !!!
		// 	return
		// }
	}()

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
