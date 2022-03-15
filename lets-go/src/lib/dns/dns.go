package dns

import (
	"lets-go/src/lib/log"
	"net"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"golang.org/x/net/dns/dnsmessage"
)

const (
	BUF_SIZE       = 1024
	TIMEOUT        = 100 * time.Millisecond
	RECORD_TIMEOUT = time.Second
)

type addrRecord struct {
	created_at time.Time
	addr       net.Addr
}

type DNS struct {
	config dnsConfig
	socket net.PacketConn
	logger log.Logger

	mu       sync.Mutex
	redirect map[uint16]addrRecord
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

	return &DNS{
		config:   config,
		socket:   socket,
		logger:   log.GetLogger(),
		redirect: make(map[uint16]addrRecord),
	}, nil
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
			s.logger.Errorf("Failed on receiving a message from addr '%s': %v\n", addr, err)
			continue
		}

		if err = req.Unpack(buf[:amount]); err != nil {
			s.logger.Errorf("Failed to unpack a message: %v\n", err)
			continue
		}

		go func() {
			s.mu.Lock()
			defer s.mu.Unlock()
			for key, record := range s.redirect {
				if record.created_at.Sub(time.Now()) >= RECORD_TIMEOUT {
					delete(s.redirect, key)
				}
			}
		}()

		go func() {
			if req.Response {
				s.logger.Debugf("DNS RESPONSE '%s' QUESTION: '%s' \n", addr, req.Questions[0].Name)

				s.mu.Lock()
				defer s.mu.Unlock()

				if record, ok := s.redirect[req.ID]; ok {
					// TODO: Save request in cache !!
					// cache.Client().Set(context.Background(), &pb.SetRequest{ Key: req.Questions[0].Name.String(), Value: req.Answers[0].Body })

					go s.Response(record.addr, &req, time.Time{})
					delete(s.redirect, req.ID)
				}

				return
			}

			s.logger.Debugf("DNS REQUEST  '%s' QUESTION: '%s' \n", addr, req.Questions[0].Name)
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
		records := s.config.Get(question.Name.String(), question.Type.String())
		if len(records) == 0 {
			return dnsmessage.RCodeNameError, []dnsmessage.Resource{}
		}

		for _, record := range records {
			body, ttl, rCode := record.res()
			if rCode != dnsmessage.RCodeSuccess {
				s.logger.Warnf("Return an error RCODE: %d\n", rCode)
				return rCode, []dnsmessage.Resource{}
			}

			answers = append(answers, dnsmessage.Resource{
				Header: dnsmessage.ResourceHeader{Name: question.Name, Type: question.Type, Class: question.Class, TTL: ttl},
				Body:   body,
			})

		}
	}

	return dnsmessage.RCodeSuccess, answers
}

func (s *DNS) ReqRedirect(addr net.Addr, req *dnsmessage.Message) {
	go func() {
		s.mu.Lock()
		defer s.mu.Unlock()

		s.redirect[req.ID] = addrRecord{addr: addr, created_at: time.Now()}
	}()

	for _, dns := range s.config.DNS() {
		// If we got a time out error then just try another DNS
		if ok := s.Response(&net.UDPAddr{IP: net.ParseIP(dns), Port: 53}, req, time.Now().Add(TIMEOUT)); !ok {
			break
		}
	}
}

func (s *DNS) Response(addr net.Addr, message *dnsmessage.Message, timeout time.Time) bool {
	var err error
	var buf []byte

	if buf, err = message.Pack(); err != nil {
		s.logger.Errorf("Failed on packing a message: %v\n", err)
		return false
	}

	if err = s.socket.SetWriteDeadline(timeout); err != nil {
		s.logger.Errorf("Failed to set transmit timeout: %v\n", err)
		return false
	}

	if _, err = s.socket.WriteTo(buf, addr); err != nil {
		s.logger.Errorf("Failed to send message to addr '%s': %v\n", addr, err)
		return !timeout.IsZero()
	}

	return false
}
