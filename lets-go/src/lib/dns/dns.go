package dns

import (
	"lets-go/src/lib/log"

	"github.com/miekg/dns"
)

var logger = log.GetLogger()

type letsDnsIt struct {
	server *dns.Server
}

func NewDNS(network string, addr string) *letsDnsIt {
	return &letsDnsIt{server: &dns.Server{Addr: addr, Net: network}}
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

	if !req.Response {
		logger.Debugf("DNS QUESTION: '%s' \n", req.Question[0].Name)
		rCode, answers := s.getAnswers(req.Question)
		res.MsgHdr.Rcode = rCode
		res.Answer = append(req.Answer, answers...)
	}

	w.WriteMsg(&res)
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

		answers = append(answers, records...)
	}

	return dns.RcodeSuccess, answers
}
