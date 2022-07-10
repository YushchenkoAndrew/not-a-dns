macro_rules! parse_T {
  ($e:expr, $t:ty) => {
    match $e.parse::<$t>() {
      Ok(v) => v,
      Err(_) => panic!("Ain't be able to parse string"),
    }
  };
}

use rand::Rng;
use std::{fmt::Display, fs::metadata};

pub(crate) use parse_T;

#[inline]
pub fn temp_name<T>(path: &T, suffix: &str) -> String
where
  T: Display,
{
  loop {
    let salt = rand::thread_rng().gen::<u32>();
    let gen = format!("{}_{}.{}", path, suffix, salt);
    if let Err(_) = metadata(&gen) {
      return gen;
    }
  }
}
