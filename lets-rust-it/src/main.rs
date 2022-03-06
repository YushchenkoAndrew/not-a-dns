mod lib;

use lib::dns::dns;
use lib::dns::dns::DNS;

use std::env;
use std::net::SocketAddr;
use std::thread;

const PORT: u16 = 53;

fn main() {
    println!("Hello {}!", "world");

    // TODO: Maybe add some args checking ....
    let args: Vec<String> = env::args().collect();
    let dns: dns::UDP = DNS::new(SocketAddr::from(([0, 0, 0, 0], PORT)), &args[1]);
    // dns.run();
    thread::spawn(move || {
        dns.run();
    });

    // for i in 0..5 {
    // }

    // dns.connect2();
    // lib::DNS

    // let addr =
    // let socket = UdpSocket::bind(&addr).expect("couldn't bind to address");
    // let mut buf = [0; 512];

    // loop {
    //     let (amt, _) = socket.recv_from(&mut buf).expect("Didn't receive data");
    //     println!("RECEIVED: {:x?}", &mut buf[..amt]);
    // }
}
