extern crate yaml_rust;

use std::fs;
use std::net::{SocketAddr, UdpSocket};
use std::vec::Vec;
use yaml_rust::yaml::{Yaml, YamlLoader};

use super::format::Format;

pub trait DNS {
  fn new(addr: SocketAddr, file: &str) -> Self;
  fn run(&self);
  fn res(&self, buf: &[u8]) -> Option<Vec<u8>>;
  fn redirect(&self, buf: &[u8]) -> Vec<u8>;
}

pub struct UDP {
  pub addr: SocketAddr,
  socket: UdpSocket,

  fmt: Format,
  docs: Vec<Yaml>,
}

impl DNS for UDP {
  fn new(addr: SocketAddr, file: &str) -> UDP {
    let socket = UdpSocket::bind(&addr).expect("Couldn't bind to address");

    let ctx = fs::read_to_string(file).expect("Something went wrong reading the file");
    // TODO: Create own yaml parser
    return UDP {
      addr,
      socket,
      fmt: Format::new(),
      docs: YamlLoader::load_from_str(&ctx).expect("Something went wrong with YAML parser"),
    };
  }

  fn run(&self) {
    let mut buf = [0; 512];
    loop {
      let (amount, src) = self
        .socket
        .recv_from(&mut buf)
        .expect("Didn't receive data");
      // println!("RECEIVED: {:x?}", &mut buf[..amt]);
      // self.socket.se

      // self.fmt.show_header(&buf.to_vec());
      // self.fmt.show_question(&buf.to_vec());

      // self.print(&data);
      // println!("\n{}", self.domain_parse(&buf[12..]));

      // let _res = self.res(&buf);

      let res = self.redirect(&buf[..amount]);
      // let res = match self.res(&buf) {
      //   // Some(ref t) => t,
      //   Some(t) => t,

      //   // TODO: Create request to others DNS ....
      //   None => self.redirect_dns(&buf),
      // };

      self.fmt.show_header(&res);
      self.fmt.show_question(&res);

      self.socket.send_to(&res, src).expect("Couldn't send data");
    }
  }

  fn res(&self, buf: &[u8]) -> Option<Vec<u8>> {
    let (ref qname, ref qtype, ref qclass) = self.fmt.parse_question(&buf[12..]);
    if let Yaml::Hash(ref zone) = self.docs[0]["zone"] {
      if let Yaml::Hash(ref records) = match zone.get(&Yaml::String(qname.clone())) {
        Some(v) => v,
        None => return None,
      } {
        if let Yaml::Array(ref records) =
          match records.get(&Yaml::from_str(self.fmt.type_convert(qtype))) {
            Some(v) => v,
            None => return None,
          }
        {
          let mut data = self.fmt.res_header(buf, records.len() as u16);
          data.append(&mut self.fmt.res_question(qname, qtype, qclass));

          // println!("{:?}", ));
          return Some(data);
        }
      }
    }

    None
  }

  fn redirect(&self, buf: &[u8]) -> Vec<u8> {
    if let Yaml::Array(ref dns) = self.docs[0]["dns"] {
      let mut res = [0; 512];
      for ip in dns {
        if let Yaml::String(ref ip) = ip {
          // TODO: Reconsider error handler
          self
            .socket
            .send_to(buf, format!("{}:53", ip))
            .expect("Couldn't send data");

          let (amount, _) = self
            .socket
            .recv_from(&mut res)
            .expect("Didn't receive data");

          return res[0..amount].to_vec();
        }
      }
    }

    vec![]
  }
}
