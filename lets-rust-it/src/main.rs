mod lib;

// #[path = "./pb/cache.rs"]
// mod pb;

use tonic::{transport::Server, Request, Response, Status};

// use pb::cache_service_server::CacheServiceServer;

use lib::map::map::HashMap;
use std::env;
use std::string::String;

#[tokio::main]
async fn main() {
    println!("Hello {}!", "world");

    let args: Vec<String> = env::args().collect();

    // Server::builder()
    //     .add_service(CacheServiceServer::new())
    //     .serve(args[1].parse().expect("Incorrect server address style"))
    //     .await;
}
