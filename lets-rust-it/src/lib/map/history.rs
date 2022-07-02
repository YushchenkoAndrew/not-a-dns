use std::fmt::Display;

use super::{hash::Hash, map::HashMap};

pub struct History {
  pub file: String,
}

impl History {
  pub fn new(file: String) -> Self {
    return History { file };
  }

  pub fn screenshot<T, U>(&self, map: &HashMap<T, U>)
  where
    T: Hash<T> + Clone + Display,
    U: Clone + Display,
  {
    for key in map.keys() {
      if let Some(val) = map.get(&key) {
        println!("[{}] -- {}", key, val);
      }
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
    map.set("HELLO", 5);
    map.set("WORLD", 4);
    map.set("TEST_", 3);

    let mut history = History::new(String::from("./map.history"));

    // Save current map state to file
    history.screenshot(&map);
  }
}
