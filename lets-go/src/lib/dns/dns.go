package dns

import (
	"fmt"
	"net"
)

type DNS struct {
	format *FormatRFC1035
	socket net.PacketConn
}

func NewDNS(network, addr, file string) (*DNS, error) {
	socket, err := net.ListenPacket("udp", addr)
	if err != nil {
		return nil, err
	}

	return &DNS{format: NewFormat(), socket: socket}, nil
}

func (this *DNS) Run() error {
	var err error
	var amount int
	var addr net.Addr
	buf := make([]byte, 1024)

	for {
		if amount, addr, err = this.socket.ReadFrom(buf); err != nil {
			return err
		}

		fmt.Println(this.format.ShowHeader(buf))
		fmt.Println(this.format.ShowQuestion(buf))

		go func() {
			if res := this.res(buf[:amount]); res != nil {
				this.socket.WriteTo(res, addr)
				return
			}

			this.socket.WriteTo(this.redirect(buf[:amount]), addr)
		}()
	}
}

func (*DNS) res(buf []uint8) []uint8 {
	return buf
}

func (*DNS) redirect(buf []uint8) []uint8 {
	return buf
}
