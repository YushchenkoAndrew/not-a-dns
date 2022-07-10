macro_rules! parse_T {
  ($e:expr, $t:ty) => {
    match $e.parse::<$t>() {
      Ok(v) => v,
      Err(_) => panic!("Ain't be able to parse string"),
    }
  };
}

macro_rules! val_PR {
  ($e:expr) => {
    if ($e == HASH_MAP_MAX_RECENT) {
      -1
    } else {
      $e
    }
  };
}

macro_rules! key_I {
  ($e:expr, $t:ty) => {
    (<$t>::hash($e) as usize) % HASH_MAP_SIZE
  };
}

use rand::Rng;
use std::{fmt::Display, fs::metadata};

pub(crate) use key_I;
pub(crate) use parse_T;
pub(crate) use val_PR;

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
