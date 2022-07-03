use std::{
  fmt::Display,
  fs::{copy, metadata, remove_file, File},
  io::{BufRead, BufReader, Write},
  str::FromStr,
};

use super::{hash::Hash, map::HashMap};

const KEY_VALUE_SEP: &str = " = ";
const FORMATTED_KEY_VALUE_SEP: &str = "#=#";
const TEMP_FILE_SUFFIX: &str = "temp";

pub struct History {
  pub file: String,
  temp: String,
}

impl History {
  pub fn new(file: String) -> Self {
    return History {
      temp: format!("{}.{}", file, TEMP_FILE_SUFFIX),
      file,
    };
  }

  pub fn screenshot<T, U>(&self, map: &HashMap<T, U>)
  where
    T: Hash<T> + Clone + Display + FromStr,
    U: Clone + Display + FromStr,
  {
    copy(&self.file, &self.temp).unwrap();
    let mut f = File::create(&self.file).unwrap();

    for key in map.keys() {
      if let Some(val) = map.get(&key) {
        println!("SAVE [{}] -- {}", key, val);
        match f.write(format!("{}{}{}\n", self.pre_format(key), KEY_VALUE_SEP, val).as_bytes()) {
          Ok(_) => {}
          Err(err) => {
            if metadata(&self.temp).is_err() {
              panic!("{}", err);
            }

            copy(&self.file, &self.temp).unwrap();
            remove_file(&self.temp).unwrap();
            panic!("{}", err);
          }
        }
      }
    }

    remove_file(&self.temp).unwrap();
  }

  pub fn restore<T, U>(&self, map: &mut HashMap<T, U>)
  where
    T: Hash<T> + Clone + Display + FromStr,
    U: Clone + Display + FromStr,
  {
    let f = File::open(&self.file).unwrap();
    let buf = BufReader::new(f);

    for l in buf.lines() {
      let line = l.unwrap();

      // TODO: Save key length & start splitting from that !!
      let vec = line.splitn(2, KEY_VALUE_SEP).collect::<Vec<_>>();
      if (vec.len() != 2) {
        panic!("Strange value encounter: {:?}", vec);
      }

      println!("LOAD [{}] -- {}", self.post_format(vec[0]), vec[1]);

      let key = match vec[0].parse::<T>() {
        Ok(v) => v,
        Err(_) => panic!("Ain't be able to parse key string"),
      };

      let value = match vec[1].parse::<U>() {
        Ok(v) => v,
        Err(_) => panic!("Ain't be able to parse value string"),
      };

      map.set(key, value);
    }
  }

  #[inline]
  fn pre_format<T>(&self, value: T) -> String
  where
    T: Display,
  {
    format!("{}", value).replace(KEY_VALUE_SEP, FORMATTED_KEY_VALUE_SEP)
  }

  #[inline]
  fn post_format(&self, value: &str) -> String {
    value.replace(FORMATTED_KEY_VALUE_SEP, KEY_VALUE_SEP)
  }
}

#[cfg(test)]
mod test {
  use super::HashMap;
  use super::History;

  #[test]
  fn basics() {
    let mut map = HashMap::new();

    // Populate map
    map.set(String::from("HELLO"), 5);
    map.set(String::from("WORLD"), 4);
    map.set(String::from("TEST_"), 3);

    let history = History::new(String::from("./map.history"));

    // Save current map state to file
    history.screenshot(&map);

    // Create new map
    let mut map = HashMap::new();

    // Restore saved state
    history.restore(&mut map);

    // Check value receiving
    assert_eq!(map.get(&String::from("HELLO")), Some(5));
    assert_eq!(map.get(&String::from("WORLD")), Some(4));
    assert_eq!(map.get(&String::from("TEST_")), Some(3));
  }
}
