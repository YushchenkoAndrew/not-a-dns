use std::string::String;

pub trait Hash<T> {
  fn hash(_val: &T) -> u32 {
    0
  }
}

impl Hash<u32> for u32 {
  fn hash(val: &u32) -> u32 {
    let mut res = ((*val >> 16) ^ *val) * 0x45d9f3b;
    res = ((res >> 16) ^ res) * 0x45d9f3b;
    res = (res >> 16) ^ res;
    return res;
  }
}

impl Hash<String> for String {
  fn hash(val: &String) -> u32 {
    const P: i32 = 53;
    const M: i32 = i32::pow(1, 9) + 9;

    let mut res: i32 = 0;
    let mut p_pow: i32 = 1;

    for ch in val.chars() {
      res = (res + (ch as i32 - 'a' as i32 + 1) * p_pow) % M;
      p_pow = (p_pow * P) % M;
    }

    return res as u32;
  }
}
