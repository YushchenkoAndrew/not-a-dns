mod lib;

use std::env;
use std::string::String;
use std::sync::{Arc, Mutex};

use lib::map::map::HashMap;
use pb::cache_service_server::{CacheService, CacheServiceServer};

use tonic::transport::Server;

pub mod pb {
  include!("./pb/proto.rs");
}

pub struct CacheServiceImpl {
  cache: Arc<Mutex<HashMap<String, String>>>,
}

impl CacheServiceImpl {
  pub fn new() -> Self {
    CacheServiceImpl {
      cache: Arc::new(Mutex::new(HashMap::new())),
    }
  }
}

#[tonic::async_trait]
impl CacheService for CacheServiceImpl {
  async fn set(
    &self,
    request: tonic::Request<pb::CacheSetRequest>,
  ) -> Result<tonic::Response<pb::CacheStatResponse>, tonic::Status> {
    println!(
      "Set: {} => {}",
      request.get_ref().key,
      request.get_ref().value
    );

    let req = request.get_ref().clone();
    match self.cache.lock() {
      Ok(ref mut cache) => {
        cache.set(req.key, req.value);
        Ok(tonic::Response::new(pb::CacheStatResponse {
          status: pb::Status::Ok as i32,
          message: String::from("Success !!"),
        }))
      }
      _ => Ok(tonic::Response::new(pb::CacheStatResponse {
        status: pb::Status::Err as i32,
        message: String::from("Mutex lock error"),
      })),
    }
  }

  async fn get(
    &self,
    request: tonic::Request<pb::CacheGetRequest>,
  ) -> Result<tonic::Response<pb::CacheValueResponse>, tonic::Status> {
    print!("Get: {} => ", request.get_ref().key);

    match self.cache.lock() {
      Ok(ref mut cache) => match cache.get(&request.get_ref().key) {
        Some(value) => {
          println!("'{}'", value);
          Ok(tonic::Response::new(pb::CacheValueResponse {
            status: pb::Status::Ok as i32,
            message: String::from("Success !!"),
            result: value,
          }))
        }

        None => Ok(tonic::Response::new(pb::CacheValueResponse {
          status: pb::Status::Err as i32,
          message: String::from("Value not found"),
          result: request.get_ref().default.clone(),
        })),
      },

      _ => Ok(tonic::Response::new(pb::CacheValueResponse {
        status: pb::Status::Err as i32,
        message: String::from("Mutex lock error"),
        result: String::new(),
      })),
    }
  }

  async fn del(
    &self,
    request: tonic::Request<pb::CacheRequest>,
  ) -> Result<tonic::Response<pb::CacheStatResponse>, tonic::Status> {
    println!("Del: {}", request.get_ref().key);

    match self.cache.lock() {
      Ok(ref mut cache) => {
        cache.del(&request.get_ref().key);
        Ok(tonic::Response::new(pb::CacheStatResponse {
          status: pb::Status::Ok as i32,
          message: String::from("Success !!"),
        }))
      }

      _ => Ok(tonic::Response::new(pb::CacheStatResponse {
        status: pb::Status::Err as i32,
        message: String::from("Mutex lock error"),
      })),
    }
  }

  async fn keys(
    &self,
    request: tonic::Request<pb::CacheRequest>,
  ) -> Result<tonic::Response<pb::CacheListResponse>, tonic::Status> {
    print!("Key: {} => ", request.get_ref().key);

    match self.cache.lock() {
      Ok(ref cache) => {
        let mut keys = vec![];

        for key in cache.keys() {
          if key.starts_with(&request.get_ref().key) {
            keys.push(key);
          }
        }

        println!("{:?}", keys);
        Ok(tonic::Response::new(pb::CacheListResponse {
          status: pb::Status::Ok as i32,
          message: String::from("Success !!"),
          result: keys,
        }))
      }

      _ => Ok(tonic::Response::new(pb::CacheListResponse {
        status: pb::Status::Err as i32,
        message: String::from("Mutex lock error"),
        result: vec![],
      })),
    }
  }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  println!("Cache system is started !!");

  let args: Vec<String> = env::args().collect();

  Server::builder()
    .add_service(CacheServiceServer::new(CacheServiceImpl::new()))
    .serve(args[1].parse().expect("Incorrect server address style"))
    .await?;

  Ok(())
}
