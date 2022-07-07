use std::{
  fmt::Display,
  fs::{copy, metadata, remove_file, File},
  io::{BufRead, BufReader, Write},
  str::FromStr,
};

use super::{hash::Hash, iter::HistoryIter, map::HashMap};

const TEMP_FILE_SUFFIX: &str = "temp";
// TODO: Use mutex when working with files
// const HISTORY_IN_USE: Mutex<i32> = Mutex::new(0);

pub struct History {}

impl History {
  // let inUse = Option<Arc<Mutex<Node<T>>>>,

  pub fn screenshot<T, U>(path: &String, map: &mut HashMap<T, U>)
  where
    T: Hash<T> + Clone + Display + FromStr,
    U: Clone + Display + FromStr,
  {
    let temp = History::temp_name(path);
    copy(&path, &temp).unwrap();

    let mut f = File::create(&temp).unwrap();

    for key in map.keys() {
      if let Some(line) = HashMap::to_string(map, &key) {
        match f.write(line.as_bytes()) {
          Ok(_) => {}
          Err(err) => {
            remove_file(&temp).unwrap();
            panic!("{}", err);
          }
        }
      }
    }

    copy(&temp, path).unwrap();
    remove_file(temp).unwrap();
  }

  pub fn restore<T, U>(path: &String, map: &mut HashMap<T, U>)
  where
    T: Hash<T> + Clone + Display + FromStr,
    U: Clone + Display + FromStr,
  {
    let f = File::open(path).unwrap();
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

  pub fn iter<T, U>(path: &String) -> HistoryIter<T, U>
  where
    T: Hash<T> + Clone + Display + FromStr,
    U: Clone + Display + FromStr,
  {
    HistoryIter::new(BufReader::new(File::open(path).unwrap()).lines())
  }

  fn temp_name(path: &String) -> String {
    let mut i = 0;
    loop {
      let temp = format!("{}_{}.{}", path, TEMP_FILE_SUFFIX, i);
      if metadata(&temp).is_err() {
        return temp;
      }

      i += 1;
    }
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

    let path = String::from("./map.history");

    // Save current map state to file
    History::screenshot(&path, &mut map);

    // Create new map
    let mut map = HashMap::new();

    // Restore saved state
    History::restore(&path, &mut map);

    // Check value receiving
    assert_eq!(map.get(&String::from("HELLO")), Some(5));
    assert_eq!(map.get(&String::from("WORLD")), Some(4));
    assert_eq!(map.get(&String::from("TEST_")), Some(3));
  }
}
