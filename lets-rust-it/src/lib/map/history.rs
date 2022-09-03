use std::{
  fmt::Display,
  fs::{copy, remove_file, File},
  io::{BufRead, BufReader, Write},
  str::FromStr,
};

use super::{
  hash::Hash,
  iter::HistoryIter,
  macros::{temp_name, val_PR},
  map::{HashMap, Pair, HASH_MAP_MAX_RECENT},
};

const TEMP_FILE_SUFFIX: &str = "temp";

pub struct History<T, U> {
  _type: Option<Pair<T, U>>,
  // path: String,
}

impl<T, U> History<T, U>
where
  T: Hash<T> + Clone + Display + FromStr,
  U: Clone + Display + FromStr,
{
  // pub fn new(path: String) -> Self {
  //   History { path, _type: None }
  // }

  pub fn screenshot(path: &String, map: &mut HashMap<T, U>) {
    let temp = temp_name(path, TEMP_FILE_SUFFIX);
    copy(path, &temp).unwrap();

    let mut f = File::create(&temp).unwrap();

    for (pr, key, val) in map.iter() {
      if let Some(line) = HashMap::to_string(map, &key, val, pr) {
        if let Err(err) = f.write(line.as_bytes()) {
          drop(f);

          remove_file(&temp).unwrap();
          panic!("{}", err);
        }
      }
    }

    f.flush().unwrap();
    drop(f);

    // FIXME: Strange bug with writing same key twice !!!
    copy(&temp, &path).unwrap();
    remove_file(temp).unwrap();
  }

  pub fn restore(path: &String, map: &mut HashMap<T, U>) {
    let buf = BufReader::new(File::open(path).unwrap());

    let mut vec = vec![];

    for line in buf.lines() {
      let line = line.unwrap();
      if let Some((pr, key, val)) = HashMap::parse(line) {
        vec.push((pr, key, val));
      }
    }

    vec.sort_by(|(a, _, _), (b, _, _)| b.cmp(a));
    // vec.sort_by(|(a, _, _), (b, _, _)| a.cmp(b));

    for (_, key, val) in vec {
      map.frozen_set(key, val);
    }
  }

  pub fn iter(path: &String) -> HistoryIter<T, U> {
    HistoryIter::new(BufReader::new(File::open(path).unwrap()).lines())
  }

  pub fn del(path: &String, key: &T) -> Option<U> {
    let temp = temp_name(path, TEMP_FILE_SUFFIX);
    copy(path, &temp).unwrap();

    let mut res = None;
    let mut f = File::create(&temp).unwrap();
    for (pr, k, val) in History::<T, U>::iter(path) {
      if T::eq(key, &k) {
        res = Some(val);
        continue;
      }

      let len = k.to_string().len();
      if let Err(err) = f.write(format!("{} {} {}={}\n", val_PR!(pr), len, k, val).as_bytes()) {
        drop(f);

        remove_file(&temp).unwrap();
        panic!("{}", err);
      }
    }

    f.flush().unwrap();
    drop(f);

    copy(&temp, path).unwrap();
    remove_file(temp).unwrap();

    return res;
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
