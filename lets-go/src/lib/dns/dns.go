package dns

import (
	"lets-go/src/lib/log"
	"time"

	"github.com/miekg/dns"
)

var logger = log.GetLogger()

const (
	TIMEOUT        = 100 * time.Millisecond
	RECORD_TIMEOUT = time.Second
)

type letsDnsIt struct {
	server *dns.Server
}

func NewDNS(network, addr string) *letsDnsIt {
	return &letsDnsIt{server: &dns.Server{Addr: addr, Net: "udp"}}
}

func (s *letsDnsIt) Close() {
	s.server.Shutdown()
}

func (s *letsDnsIt) Run() error {
	dns.HandleFunc(".", s.handle)
	return s.server.ListenAndServe()
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
		logger.Debugf("DNS RESPONSE QUESTION: '%s' \n", req.Question[0].Name)

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
	rCode, answers := s.getAnswers(req.Question)
	res.MsgHdr.Rcode = rCode
	res.Answer = append(req.Answer, answers...)

	w.WriteMsg(&res)
	// 	return
	// }

	// s.checkAnotherNameservers(req)
	// }()

}

func (s *letsDnsIt) getAnswers(questions []dns.Question) (int, []dns.RR) {
	var answers = []dns.RR{}
	for _, question := range questions {
		records := getRecord(question.Name, question.Qtype)
		// if len(records) == 0 {
		// return dns.RcodeNameError, nil
		// fmt.Println(getNameservers())
		// return dns.RcodeSuccess, []dns.RR{
		// 	&dns.NS{
		// 		Hdr: dns.RR_Header{Name: question.Name, Rrtype: question.Qtype, Class: question.Qclass},
		// 		Ns:  getNameservers()[0],
		// 	},
		// }

		// NOTE: Maybe not to return anything
		// return dns.RcodeNameError, []dns.RR{}
		// }

		answers = append(answers, records...)
	}

	return dns.RcodeSuccess, answers
}
