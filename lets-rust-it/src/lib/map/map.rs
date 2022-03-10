// Resources:
//  https://medium.com/@narengowda/designing-the-caching-system-e42c6938df6a

use super::hash::Hash;
use super::list::{Iter, List};

pub const HASH_MAP_SIZE: usize = 500;

pub struct Pair<T, U> {
  key: T,
  value: U,
}

pub struct HashMap<T, U> {
  keys: List<T>,
  values: [Option<Pair<T, U>>; HASH_MAP_SIZE],
}

impl<T, U> HashMap<T, U> {
  const NONE: Option<Pair<T, U>> = None;

  pub fn new() -> Self {
    return HashMap {
      keys: List::new(),
      values: [HashMap::NONE; HASH_MAP_SIZE],
    };
  }

  pub fn set(&mut self, key: T, value: U)
  where
    T: Hash<T> + Clone,
  {
    self.keys.push(key.clone());
    let index = (T::hash(&key) as usize) % HASH_MAP_SIZE;
    self.values[index] = Some(Pair { key, value })
  }

  pub fn get(&self, key: &T) -> Option<&U>
  where
    T: Hash<T> + Clone,
  {
    self.values[(T::hash(key) as usize) % HASH_MAP_SIZE]
      .as_ref()
      .map(|node| &node.value)
  }

  pub fn keys(&self) -> Iter<'_, T> {
    self.keys.iter()
  }
}

#[cfg(test)]
mod test {
  use super::HashMap;

  #[test]
  fn basics() {
    let mut map = HashMap::new();

    // Check empty map behaves right
    assert_eq!(map.get(&"HELLO"), None);

    // Populate map
    map.set(&"HELLO", 5);
    map.set(&"WORLD", 4);
    map.set(&"TEST_", 3);

    // Check value receiving
    assert_eq!(map.get(&"HELLO"), Some(&5));
    assert_eq!(map.get(&"WORLD"), Some(&4));
    assert_eq!(map.get(&"TEST_"), Some(&3));

    // TODO: Check normal removal

    // TODO: Push some more just to make sure nothing's corrupted

    // TODO: Check normal removal

    // TODO: Check exhaustion
  }

  #[test]
  fn iter() {
    let mut map = HashMap::new();

    // Check empty map behaves right
    assert_eq!(map.get(&"HELLO"), None);

    // Populate map
    map.set(&"HELLO", 5);
    map.set(&"WORLD", 4);
    map.set(&"TEST_", 3);

    let mut iter = map.keys();
    assert_eq!(iter.next(), Some(&"TEST_"));
    assert_eq!(iter.next(), Some(&"WORLD"));
    assert_eq!(iter.next(), Some(&"HELLO"));
  }
}
