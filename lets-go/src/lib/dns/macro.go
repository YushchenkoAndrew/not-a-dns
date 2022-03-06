package dns

import (
	"fmt"
	"strings"
)

func bit(n uint8) uint8 {
	return 0x01 << n
}

func mask(a, b, n uint8) uint8 {
	return (a & (b << n)) >> n
}

func u16(a uint8, b uint8) uint16 {
	return (uint16(a) << 8) | uint16(b)
}

func flags(str string, offset int) string {
	var out = strings.Repeat(".", offset) + str + strings.Repeat(".", 16-len(str)-offset)
	return fmt.Sprintf("%s %s %s %s", out[:4], out[4:8], out[8:12], out[12:])
}
