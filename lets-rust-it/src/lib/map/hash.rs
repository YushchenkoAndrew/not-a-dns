// Resources:
//  https://cp-algorithms.com/string/string-hashing.html

use std::string::String;

pub trait Hash<T> {
  fn hash(_val: &T) -> u32;
  fn eq(a: &T, b: &T) -> bool;
}

impl Hash<i32> for i32 {
  fn hash(val: &i32) -> u32 {
    let mut res = (*val) as i32;
    res = (((res >> 16) ^ res) as i64 * 0x45d9f3b) as i32;
    res = (((res >> 16) ^ res) as i64 * 0x45d9f3b) as i32;
    return ((res >> 16) ^ res) as u32;
  }

  fn eq(a: &i32, b: &i32) -> bool {
    a == b
  }
}

impl Hash<u32> for u32 {
  fn hash(val: &u32) -> u32 {
    let mut res = (*val) as u32;
    res = (((res >> 16) ^ res) as u64 * 0x45d9f3b) as u32;
    res = (((res >> 16) ^ res) as u64 * 0x45d9f3b) as u32;
    return (res >> 16) ^ res;
  }

  fn eq(a: &u32, b: &u32) -> bool {
    a == b
  }
}

impl Hash<String> for String {
  fn hash(val: &String) -> u32 {
    const P: i32 = 53;
    const M: i32 = 1000000009;

    let mut res: i64 = 0;
    let mut p_pow: i64 = 1;

    for ch in val.chars() {
      res = (res + (ch as i64 - 'a' as i64 + 1) * p_pow) % M as i64;
      p_pow = (p_pow * P as i64) % M as i64;
    }

    return res as u32;
  }

  fn eq(a: &String, b: &String) -> bool {
    a == b
  }
}

impl Hash<&str> for &str {
  fn hash(val: &&str) -> u32 {
    const P: i32 = 53;
    const M: i32 = 1000000009;

    let mut res: i64 = 0;
    let mut p_pow: i64 = 1;

    for ch in val.chars() {
      res = (res + (ch as i64 - 'a' as i64 + 1) * p_pow) % M as i64;
      p_pow = (p_pow * P as i64) % M as i64;
    }

    return res as u32;
  }

  fn eq(a: &&str, b: &&str) -> bool {
    a == b
  }
}

macro_rules! impl_T {
    (for $($t:ty),+) => {
        $(impl Hash<$t> for $t {
            fn hash(_val: &$t)-> u32 { 0 }
            fn eq(a: &$t, b: &$t) -> bool { false }
        })*
    }
}

impl_T!(for i8, i16, i64, i128, u8, u16, u64, u128, bool, f32, f64);

#[cfg(test)]
mod test {
  use super::Hash;

  #[test]
  fn test_hash_u32() {
    assert_eq!(u32::hash(&1), 824515495);
    assert_eq!(u32::hash(&2), 1722258072);
    assert_eq!(u32::hash(&3), 3753300549);
  }

  #[test]
  fn test_hash_string() {
    assert_eq!(String::hash(&String::from("a")), 1);
    assert_eq!(String::hash(&String::from("b")), 2);
    assert_eq!(String::hash(&String::from("c")), 3);

    assert_eq!(String::hash(&String::from("ab")), 107);
    assert_eq!(String::hash(&String::from("abc")), 8534);
  }

  #[test]
  fn test_hash_other() {
    assert_eq!(bool::hash(&false), 0);

    assert_eq!(i8::hash(&53), 0);
    assert_eq!(u8::hash(&53), 0);

    assert_eq!(i16::hash(&53), 0);
    assert_eq!(u16::hash(&53), 0);

    assert_eq!(i64::hash(&53), 0);
    assert_eq!(u64::hash(&53), 0);

    assert_eq!(i128::hash(&53), 0);
    assert_eq!(u128::hash(&53), 0);
  }
}
