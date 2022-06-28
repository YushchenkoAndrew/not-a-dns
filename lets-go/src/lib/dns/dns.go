package dns

import (
	"lets-go/src/lib/log"
	"path/filepath"
	"strings"
	"time"

	"github.com/miekg/dns"
)

var logger log.Logger

const (
	TIMEOUT        = 100 * time.Millisecond
	RECORD_TIMEOUT = time.Second
)

type letsDnsIt struct {
	server *dns.Server
}

func NewDNS(network, addr, path string) (*letsDnsIt, error) {
	err := LoadConfig(
		filepath.Dir(path),
		strings.TrimSuffix(filepath.Base(path),
			filepath.Ext(path)), strings.Trim(filepath.Ext(path), "."),
	)

	if err != nil {
		return nil, err
	}

	result := &letsDnsIt{server: &dns.Server{Addr: addr, Net: "udp"}}

	dns.HandleFunc(".", result.handle)
	if err := result.server.ListenAndServe(); err != nil {
		return nil, err
	}

	return result, nil
}

func (s *letsDnsIt) Close() {
	s.server.Shutdown()
}

func (s *letsDnsIt) handle(w dns.ResponseWriter, req *dns.Msg) {
	var res = dns.Msg{}
	res.SetReply(req)

	res.Compress = false

	// if r.Opcode == dns.OpcodeQuery {
	// NOTE: Maybe ?!
	// }

	// go func() {
	if req.Response {

		// FIXME:
		// s.logger.Debugf("DNS RESPONSE '%s' QUESTION: '%s' \n", addr, req.Question[0].Name)

		// s.mu.Lock()
		// defer s.mu.Unlock()

		// if record, ok := s.redirect[req.MsgHdr.Id]; ok {
		// 	// TODO: Save request in cache !!
		// 	// cache.Client().Set(context.Background(), &pb.SetRequest{ Key: req.Questions[0].Name.String(), Value: req.Answers[0].Body })

		// 	go s.Response(record.addr, &req, time.Time{})
		// 	delete(s.redirect, req.MsgHdr.Id)
		// }

		return
	}

	logger.Debugf("DNS QUESTION: '%s' \n", req.Question[0].Name)
	if rCode, answers := s.getAnswers(req.Question); rCode != dns.RcodeNameError {

		res.MsgHdr.Rcode = rCode
		res.Answer = append(req.Answer, answers...)

		w.WriteMsg(&res)
		return
	}

	s.checkNameservers(req)
	// }()

}

func (s *letsDnsIt) getAnswers(questions []dns.Question) (int, []dns.RR) {
	var answers = []dns.RR{}
	for _, question := range questions {
		records := getRecord(question.Name, question.Qtype)
		if len(records) == 0 {
			return dns.RcodeNameError, nil
		}

		for _, record := range records {
			res, rCode := record.res()
			if rCode != dns.RcodeSuccess {
				logger.Warnf("Return an error RCODE: %d\n", rCode)
				return rCode, []dns.RR{}
			}

			answers = append(answers, res)
		}
	}

	return dns.RcodeSuccess, answers
}

func (s *letsDnsIt) checkNameservers(req *dns.Msg) {
	// for _, dns := range s.config.Nameservers() {
	// 	// If we got a time out error then just try another DNS
	// 	if ok := s.Response(&net.UDPAddr{IP: net.ParseIP(dns), Port: 53}, req, time.Now().Add(TIMEOUT)); !ok {
	// 		break
	// 	}
	// }
}

func init() {
	logger = log.GetLogger()
}
