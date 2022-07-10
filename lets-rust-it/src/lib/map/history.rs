use std::{
  fmt::Display,
  fs::{copy, remove_file, File},
  io::{BufRead, BufReader, Write},
  slice::Iter,
  str::FromStr,
};

use super::{
  hash::Hash,
  iter::HistoryIter,
  macros::temp_name,
  map::{HashMap, Pair},
};

const TEMP_FILE_SUFFIX: &str = "temp";

pub struct History<T, U> {
  _type: Option<Pair<T, U>>,

  path: String,
}

impl<T, U> History<T, U>
where
  T: Hash<T> + Clone + Display + FromStr,
  U: Clone + Display + FromStr,
{
  pub fn new(path: String) -> Self {
    History { path, _type: None }
  }

  pub fn screenshot(&self, map: &HashMap<T, U>) {
    let temp = temp_name(&self.path, TEMP_FILE_SUFFIX);
    copy(&self.path, &temp).unwrap();

    let mut f = File::create(&temp).unwrap();

    for key in map.keys() {
      if let Some(line) = HashMap::to_string(map, &key) {
        match f.write(line.as_bytes()) {
          Ok(_) => {}
          Err(err) => {
            drop(f);

            remove_file(&temp).unwrap();
            panic!("{}", err);
          }
        }
      }
    }

    f.flush().unwrap();
    drop(f);

    copy(&temp, &self.path).unwrap();
    remove_file(temp).unwrap();
  }

  pub fn restore(&self, map: &mut HashMap<T, U>) {
    let f = File::open(&self.path).unwrap();
    let buf = BufReader::new(f);

    let mut vec = vec![];

    for line in buf.lines() {
      let line = line.unwrap();
      if let Some((pr, key, val)) = HashMap::parse(line) {
        vec.push((pr, key, val));
      }
    }

    vec.sort_by(|(a, _, _), (b, _, _)| b.cmp(a));

    for (_, key, val) in vec {
      map.set(key, val);
    }
  }

  pub fn iter(&self) -> HistoryIter<T, U> {
    HistoryIter::new(BufReader::new(File::open(&self.path).unwrap()).lines())
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

    let mut history = History::new(String::from("./map.history"));

    // Save current map state to file
    history.screenshot(&mut map);

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
