use std::{
  fmt::Display,
  fs::{copy, metadata, remove_file, File},
  io::{BufRead, BufReader, Write},
  str::FromStr,
};

use super::{hash::Hash, map::HashMap};

const TEMP_FILE_SUFFIX: &str = "temp";

pub struct History {}

impl History {
  pub fn screenshot<T, U>(path: &String, map: &mut HashMap<T, U>)
  where
    T: Hash<T> + Clone + Display + FromStr,
    U: Clone + Display + FromStr,
  {
    let temp = format!("{}_{}", path, TEMP_FILE_SUFFIX);
    copy(&path, &temp).unwrap();

    let mut f = File::create(path).unwrap();

    for key in map.keys() {
      if let Some(line) = map.to_string(&key) {
        match f.write(line.as_bytes()) {
          Ok(_) => {}
          Err(err) => {
            if metadata(&temp).is_err() {
              panic!("{}", err);
            }

            copy(path, &temp).unwrap();
            remove_file(&temp).unwrap();
            panic!("{}", err);
          }
        }
      }
    }

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
      let pr = map.priority(&line);
      if pr != -1 {
        vec.push((pr, line));
      }
    }

    vec.sort_by(|(a, _), (b, _)| b.cmp(a));
    println!("{:?}", vec);

    for (_, line) in vec {
      map.from_string(line)
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
