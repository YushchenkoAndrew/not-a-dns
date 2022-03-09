use super::list::List;

use std::string::String;

pub const HASH_MAP_SIZE: i64 = 32;

pub fn hash(s: &String) -> i64 {
  const P: i32 = 53;
  const M: i32 = i32::pow(1, 9) + 9;

  let mut res: i64 = 0;
  let mut p_pow: i64 = 1;

  for ch in s.chars() {
    res = (res + (ch as i64 - 'a' as i64 + 1) * p_pow) % M as i64;
    p_pow = (p_pow * P as i64) % M as i64;
  }

  return res;
}

#[inline]
fn index(s: &String) -> usize {
  (hash(s) as usize) % (HASH_MAP_SIZE as usize)
}

pub struct Pair<T, U> {
  key: T,
  value: U,
}

// TODO: Use generics !!!
pub struct HashMap<T> {
  pub keys: List<String>,
  values: [Option<Pair<String, T>>; HASH_MAP_SIZE as usize],
}

impl<T> HashMap<T> {
  pub fn new() -> Self {
    return HashMap {
      keys: List::new(),
      values: Default::default(),
    };
  }

  pub fn set(&mut self, ref key: String, value: T) {
    self.keys.push(key.clone());
    self.values[index(key)] = Some(Pair {
      key: key.clone(),
      value,
    });
  }

  pub fn get(&self, ref key: String) -> Option<&T> {
    self.values[index(key)].as_ref().map(|node| &node.value)
  }
}
