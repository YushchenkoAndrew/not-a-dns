/**
 * DOMAIN NAMES - IMPLEMENTATION AND SPECIFICATION
 * https://www.ietf.org/rfc/rfc1035.txt
 *
 *
 * Format
 *
 * All communications inside of the domain protocol are carried in a single
 * format called a message.  The top level format of message is divided
 * into 5 sections (some of which are empty in certain cases) shown below:
 *
 *     +---------------------+
 *     |        Header       |
 *     +---------------------+
 *     |       Question      | the question for the name server
 *     +---------------------+
 *     |        Answer       | RRs answering the question
 *     +---------------------+
 *     |      Authority      | RRs pointing toward an authority
 *     +---------------------+
 *     |      Additional     | RRs holding additional information
 *     +---------------------+
 *
 * The header section is always present.  The header includes fields that
 * specify which of the remaining sections are present, and also specify
 * whether the message is a query or a response, a standard query or some
 * other opcode, etc.
 *
 * The names of the sections after the header are derived from their use in
 * standard queries.  The question section contains fields that describe a
 * question to a name server.  These fields are a query type (QTYPE), a
 * query class (QCLASS), and a query domain name (QNAME).  The last three
 * sections have the same format: a possibly empty list of concatenated
 * resource records (RRs).  The answer section contains RRs that answer the
 * question; the authority section contains RRs that point toward an
 * authoritative name server; the additional records section contains RRs
 * which relate to the query, but are not strictly answers for the
 * question.
 */
package dns

import (
	"fmt"
	"strings"
)

var qType = map[uint16]string{
	1:  "A",     // a host address
	2:  "NS",    // an authoritative name server
	3:  "MD",    // a mail destination (Obsolete - use MX)
	4:  "MF",    // a mail forwarder (Obsolete - use MX)
	5:  "CNAME", // the canonical name for an alias
	6:  "SOA",   // marks the start of a zone of authority
	7:  "MB",    // a mailbox domain name (EXPERIMENTAL)
	8:  "MG",    // a mail group member (EXPERIMENTAL)
	9:  "MR",    // a mail rename domain name (EXPERIMENTAL)
	10: "NULL",  // a null RR (EXPERIMENTAL)
	11: "WKS",   // a well known service description
	12: "PTR",   // a domain name pointer
	13: "HINFO", // host information
	14: "MINFO", // mailbox or mail list information
	15: "MX",    // mail exchange
	16: "TXT",   // text strings
}

var qClass = map[uint16]string{
	1: "IN", // the Internet
	2: "CS", // the CSNET class
	3: "CH", // the CHAOS class
	4: "HS", // Hesiod [Dyer 87]
}

type FormatRFC1035 struct{}

func NewFormat() *FormatRFC1035 {
	return &FormatRFC1035{}
}

// Header section format
// The header contains the following fields:
//                                 1  1  1  1  1  1
//   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                      ID                       |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE   |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                    QDCOUNT                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                    ANCOUNT                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                    NSCOUNT                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                    ARCOUNT                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
func (*FormatRFC1035) ResHeader(buf []uint8, ancount uint16) []uint8 {
	return []uint8{
		// ID          A 16 bit identifier assigned by the program that
		//             generates any kind of query.  This identifier is copied
		//             the corresponding reply and can be used by the requester
		//             to match up replies to outstanding queries.
		buf[0],
		buf[1],
		//
		//
		// QR(1)       A one bit field that specifies whether this message is a
		//             query (0), or a response (1).
		// Opcode      A four bit field that specifies kind of query in this
		//             message.  This value is set by the originator of a query
		//             and copied into the response.
		// AA(1)       Authoritative Answer - this bit is valid in responses,
		//             and specifies that the responding name server is an
		//             authority for the domain name in question section.
		// TC(0)       TrunCation - specifies that this message was truncated
		//             due to length greater than that permitted on the
		//             transmission channel.
		// RD(0)        Recursion Desired - this bit may be set in a query and
		//             is copied into the response.  If RD is set, it directs
		//             the name server to pursue the query recursively.
		//             Recursive query support is optional.
		// RA(0)       Recursion Available - this be is set or cleared in a
		//             response, and denotes whether recursive query support is
		//             available in the name server.
		// Z(0000)     Reserved for future use.  Must be zero in all queries
		//             and responses.
		// RCODE       Response code - this 4 bit field is set as part of
		//             responses.The values have the following
		//             interpretation:
		//             0               No error condition
		//
		//             1               Format error - The name server was
		//                             unable to interpret the query.
		//
		//             2               Server failure - The name server was
		//                             unable to process this query due to a
		//                             problem with the name server.
		//
		//             3               Name Error - Meaningful only for
		//                             responses from an authoritative name
		//                             server, this code signifies that the
		//                             domain name referenced in the query does
		//                             not exist.
		//
		//             4               Not Implemented - The name server does
		//                             not support the requested kind of query.
		//
		//             5               Refused - The name server refuses to
		//                             perform the specified operation for
		//                             policy reasons.  For example, a name
		//                             server may not wish to provide the
		//                             information to the particular requester,
		//                             or a name server may not wish to perform
		//                             a particular operation (e.g., zone
		(bit(7) | buf[2]&0xF8) | bit(2),
		//
		//
		// QDCOUNT     an unsigned 16 bit integer specifying the number of
		//             entries in the question section.
		buf[4],
		buf[5],
		//
		//
		// ANCOUNT     an unsigned 16 bit integer specifying the number of
		//             resource records in the answer section.
		uint8(ancount >> 8),
		uint8(ancount),
		//
		//
		// NSCOUNT     an unsigned 16 bit integer specifying the number of name
		//             server resource records in the authority records
		//             section.
		0x00,
		0x00,
		//
		//
		// ARCOUNT     an unsigned 16 bit integer specifying the number of
		//             resource records in the additional records section.
		0x00,
		0x00,
	}
}

// Question section format
// The question section is used to carry the "question" in most queries,
// i.e., the parameters that define what is being asked.
//                                 1  1  1  1  1  1
//   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                                               |
// /                     QNAME                     /
// /                                               /
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                     QTYPE                     |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                     QCLASS                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//
func (*FormatRFC1035) ParseQuestion(buf []uint8) (string, uint16, uint16) {
	var domain = []string{}

	var offset = uint8(1)
	var len = buf[offset-1]

	for buf[offset-1] != 0 {
		// var str = ""
		domain = append(domain, string(buf[offset:offset+len]))
		// for &c in &buf[offset..offset + len] {
		//   str.push(c as char);
		// }

		offset += len + 1
		len = buf[offset-1]
		// domain.push(format!("{}", &str));
	}

	// QNAME    a domain name represented as a sequence of labels, where
	//          each label consists of a length octet followed by that
	//          number of octets.  The domain name terminates with the
	//          zero length octet for the null label of the root.  Note
	//          that this field may be an odd number of octets; no
	//          padding is used.
	return strings.Join(domain, "."),
		//
		//
		// QTYPE    a two octet code which specifies the type of the query.
		//          The values for this field include all codes valid for a
		//          TYPE field, together with some more general codes which
		//          can match more than one type of RR.
		//          A               1 a host address
		//          NS              2 an authoritative name server
		//          MD              3 a mail destination (Obsolete - use MX)
		//          MF              4 a mail forwarder (Obsolete - use MX)
		//          CNAME           5 the canonical name for an alias
		//          SOA             6 marks the start of a zone of authority
		//          MB              7 a mailbox domain name (EXPERIMENTAL)
		//          MG              8 a mail group member (EXPERIMENTAL)
		//          MR              9 a mail rename domain name (EXPERIMENTAL)
		//          NULL            10 a null RR (EXPERIMENTAL)
		//          WKS             11 a well known service description
		//          PTR             12 a domain name pointer
		//          HINFO           13 host information
		//          MINFO           14 mailbox or mail list information
		//          MX              15 mail exchange
		//          TXT             16 text strings
		//
		//          AXFR            252 A request for a transfer of an entire zone
		//          MAILB           253 A request for mailbox-related records (MB, MG or MR)
		//          MAILA           254 A request for mail agent RRs (Obsolete - see MX)
		//          *               255 A request for all records
		u16(buf[offset], buf[offset+1]),
		//
		//
		// CLASS    fields appear in resource records.  The following CLASS mnemonics
		//          and values are defined:
		//          IN              1 the Internet
		//          CS              2 the CSNET class (Obsolete - used only for examples in
		//                          some obsolete RFCs)
		//          CH              3 the CHAOS class
		//          HS              4 Hesiod [Dyer 87]
		//
		//          *               255 any class
		u16(buf[offset+2], buf[offset+3])
}

// Question section format
// The question section is used to carry the "question" in most queries,
// i.e., the parameters that define what is being asked.
//                                 1  1  1  1  1  1
//   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                                               |
// /                     QNAME                     /
// /                                               /
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                     QTYPE                     |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                     QCLASS                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//
// func (*Format) ResQuestion(qname string, qtype uint16, qclass uint16) []uint8 {
//   let mut res = vec![];

//   for str in qname.split(".") {
//     if let Some(len) = u8::try_from(str.len()).ok() {
//       res.push(len);
//       for c in str.chars() {
//         res.push(c as u8);
//       }
//     }
//   }

//   res.push(0x00); // break point
//   res.append(&mut uint16!(*qtype));
//   res.append(&mut uint16!(*qclass));
//   return res;
// }

//   // Resource record format
//   //
//   // The answer, authority, and additional sections all share the same
//   // format: a variable number of resource records, where the number of
//   // records is specified in the corresponding count field in the header.
//   // Each resource record has the following format:
//   //                                 1  1  1  1  1  1
//   //   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
//   // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//   // |                                               |
//   // /                                               /
//   // /                      NAME                     /
//   // |                                               |
//   // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//   // |                      TYPE                     |
//   // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//   // |                     CLASS                     |
//   // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//   // |                      TTL                      |
//   // |                                               |
//   // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//   // |                   RDLENGTH                    |
//   // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--|
//   // /                     RDATA                     /
//   // /                                               /
//   // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//   pub fn res_answer(&self, qtype: &u16, qclass: &u16) -> Vec<u8> {
//     vec![
//       // In order to reduce the size of messages, the domain system utilizes a
//       // compression scheme which eliminates the repetition of domain names in a
//       // message.  In this scheme, an entire domain name or a list of labels at
//       // the end of a domain name is replaced with a pointer to a prior occurance
//       // of the same name.
//       //
//       // The pointer takes the form of a two octet sequence:
//       // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//       // | 1  1|                OFFSET                   |
//       // +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//       0xC0,
//       0x0C,
//       //
//       //
//       // TYPE      two octets containing one of the RR type codes. This
//       //           field specifies the meaning of the data in the RDATA
//       //           field.
//     ]
//   }

// Header section format
// The header contains the following fields:
//                                 1  1  1  1  1  1
//   0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                      ID                       |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |QR|   Opcode  |AA|TC|RD|RA|   Z    |   RCODE   |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                    QDCOUNT                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                    ANCOUNT                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                    NSCOUNT                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// |                    ARCOUNT                    |
// +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
func (*FormatRFC1035) ShowHeader(buf []uint8) string {
	return fmt.Sprintf(`
 +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 |                          HEADER                              |
 +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 | Transfer ID: 0x%04x                                          |
 | Flags: 0x%04x Standard query response                        |
 \   %s = Query/Response                       \
 \   %s = Opcode                               \
 \   %s = Authoritative Answer                 \
 \   %s = Truncated                            \
 \   %s = Recursion desired                    \
 \   %s = Recursion available                  \
 \   %s = Reserved for future use              \
 \   %s = Answer authenticated                 \
 \   %s = Non-authenticated data               \
 \   %s = Reply code                           \
 | Questions: %d                                                 |
 | Answer RRs: %d                                                |
 | Authority RRs: %d                                             |
 | Additional RRs: %d                                            |
 +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+`,
		u16(buf[0], buf[1]),
		u16(buf[2], buf[3]),
		flags(fmt.Sprintf("%b", mask(buf[2], 1, 7)), 0),
		flags(fmt.Sprintf("%04b", mask(buf[2], 0x0F, 3)), 1),
		flags(fmt.Sprintf("%b", mask(buf[2], 1, 2)), 5),
		flags(fmt.Sprintf("%b", mask(buf[2], 1, 1)), 6),
		flags(fmt.Sprintf("%b", mask(buf[2], 1, 0)), 7),
		flags(fmt.Sprintf("%b", mask(buf[3], 1, 7)), 8),
		flags(fmt.Sprintf("%b", mask(buf[3], 1, 6)), 9),
		flags(fmt.Sprintf("%b", mask(buf[3], 1, 5)), 10),
		flags(fmt.Sprintf("%b", mask(buf[3], 1, 4)), 11),
		flags(fmt.Sprintf("%04b", buf[3]&0x0F), 12),
		u16(buf[4], buf[5]),
		u16(buf[6], buf[7]),
		u16(buf[8], buf[9]),
		u16(buf[10], buf[11]),
	)
}

// Queries
//   api.twitter.com: type AAAA, class IN
//       Name: api.twitter.com
//       [Name Length: 15]
//       [Label Count: 3]
//       Type: AAAA (IPv6 Address) (28)
//       Class: IN (0x0001)
func (this *FormatRFC1035) ShowQuestion(buf []uint8) string {
	var qname, qtype, qclass = this.ParseQuestion(buf[12:])
	var qtype_name = qType[qtype]
	var qclass_name = qClass[qclass]

	return fmt.Sprintf(
		` |                         QUESTION                             |
 +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
 | %s: type %s, class %s %s |
 \   Name: %s %s \
 \   [Name Length: %3d]                                         \
 \   [Label Count: %3d]                                         \
 \   Type: %s (%2d) %s \
 \   Class: %s (0x%04x) %s \
 +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
`,
		qname, qtype_name, qclass_name, strings.Repeat(" ", 44-len(qname)-len(qtype_name)-len(qclass_name)),
		qname, strings.Repeat(" ", 53-len(qname)-len(qtype_name)-len(qclass_name)),
		len(qname),
		strings.Count(qname, "."),
		qtype_name, qtype, strings.Repeat(" ", 46-len(qtype_name)),
		qclass_name, qclass, strings.Repeat(" ", 41-len(qclass_name)),
	)
}

//   // Answers
//   //   api.twitter.com: type CNAME, class IN, cname tpop-api.twitter.com
//   //       Name: api.twitter.com
//   //       Type: CNAME (Canonical NAME for an alias) (5)
//   //       Class: IN (0x0001)
//   //       Time to live: 50 (50 seconds)
//   //       Data length: 11
//   //       CNAME: tpop-api.twitter.com
//   //
//   #[allow(dead_code)]
//   pub fn show_answer(&self, buf: &Vec<u8>) {
//     let (ref qname, ref qtype, ref qclass) = self.parse_question(&buf[12..]);
//     let qtype_name = self.type_convert(qtype);
//     let qclass_name = self.class_convert(qclass);

//     println!(
//       r#" |                         QUESTION                             |
//  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
//  | {:<60} |
//  \   Name: {:<52} \
//  \   [Name Length: {:>3}]                                         \
//  \   [Label Count: {:>3}]                                         \
//  \   {:<58} \
//  \   {:<58} \
//  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+
// "#,
//       format!("{}: type {}, class {}", qname, qtype_name, qclass_name,),
//       qname,
//       qname.len(),
//       qname.matches('.').count() + 1,
//       format!("Type: {} ({})", qtype_name, qtype),
//       format!("Class: {} (0x{:04x})", qclass_name, qclass)
//     );
//   }
