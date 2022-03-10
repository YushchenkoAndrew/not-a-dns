package main_test

import (
	"net"
	"testing"

	"github.com/stretchr/testify/require"
	"golang.org/x/net/dns/dnsmessage"
)

const (
	ID       = 0x088F
	BUF_SIZE = 1024

	DNS_ADDR     = "127.0.0.1:53535"
	DNS_REQ_NAME = "test.net."
)

func TestClient(t *testing.T) {
	socket, err := net.Dial("udp", DNS_ADDR)
	require.NoError(t, err)
	require.NotNil(t, socket)

	defer socket.Close()

	name, err := dnsmessage.NewName(DNS_REQ_NAME)
	require.NoError(t, err)

	var reqMessage = dnsmessage.Message{
		Header: dnsmessage.Header{
			ID:                 ID,
			Response:           false,
			OpCode:             dnsmessage.OpCode(0),
			Authoritative:      false,
			Truncated:          false,
			RecursionDesired:   false,
			RecursionAvailable: false,
			RCode:              dnsmessage.RCodeSuccess,
		},
		Questions: []dnsmessage.Question{{
			Name:  name,
			Type:  dnsmessage.TypeA,
			Class: dnsmessage.ClassANY,
		},
		},
	}

	reqBuf, err := reqMessage.Pack()
	require.NoError(t, err)
	require.NotEmpty(t, reqBuf)

	_, err = socket.Write(reqBuf)
	require.NoError(t, err)

	resBuf := make([]byte, BUF_SIZE)
	_, err = socket.Read(resBuf)
	require.NoError(t, err)

	var resMessage dnsmessage.Message
	err = resMessage.Unpack(resBuf)
	require.NoError(t, err)

	require.NotEmpty(t, resMessage.Answers)
	require.Equal(t, len(resMessage.Answers), 2)
	require.Equal(t, resMessage.Answers[0].Body.(*dnsmessage.AResource).A, [4]byte{255, 255, 255, 255})
	require.Equal(t, resMessage.Answers[1].Body.(*dnsmessage.AResource).A, [4]byte{127, 0, 0, 1})
}
