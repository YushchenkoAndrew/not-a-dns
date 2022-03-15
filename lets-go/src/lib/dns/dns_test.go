package dns_test

import (
	"lets-go/src/lib/dns"
	"testing"

	"github.com/stretchr/testify/require"
	"golang.org/x/net/dns/dnsmessage"
)

const (
	ADDR   = ":0"
	CONFIG = "../../../config/config_test.yaml"

	DNS_REQ_EXISTED_NAME     = "test.net."
	DNS_REQ_NOT_EXISTED_NAME = "google.com."
)

var DNS *dns.DNS

func TestExistedDNSRecord(t *testing.T) {
	name, err := dnsmessage.NewName(DNS_REQ_EXISTED_NAME)
	require.NoError(t, err)

	RCode, answers := DNS.ReqHandler([]dnsmessage.Question{
		{
			Name:  name,
			Type:  dnsmessage.TypeA,
			Class: dnsmessage.ClassANY,
		},
	})

	require.Equal(t, RCode, dnsmessage.RCodeSuccess)

	require.NotEmpty(t, answers)
	require.Equal(t, len(answers), 2)
	require.Equal(t, answers[0].Body.(*dnsmessage.AResource).A, [4]byte{127, 0, 0, 1})
	require.Equal(t, answers[1].Body.(*dnsmessage.AResource).A, [4]byte{255, 255, 255, 255})
}

func TestNotExistedDNSRecord(t *testing.T) {
	name, err := dnsmessage.NewName(DNS_REQ_NOT_EXISTED_NAME)
	require.NoError(t, err)

	RCode, answers := DNS.ReqHandler([]dnsmessage.Question{
		{
			Name:  name,
			Type:  dnsmessage.TypeA,
			Class: dnsmessage.ClassANY,
		},
	})

	require.Equal(t, RCode, dnsmessage.RCodeNameError)
	require.Empty(t, answers)
}

func init() {
	var err error
	if DNS, err = dns.NewDNS("udp", ADDR, CONFIG); err != nil {
		panic(err)
	}
}
