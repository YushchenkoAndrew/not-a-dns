// Resources:
//  https://medium.com/@narengowda/designing-the-caching-system-e42c6938df6a

use super::hash::Hash;
use super::list::{Iter, List};

use std::rc::Rc;

pub const HASH_MAP_SIZE: usize = 500;

pub struct Pair<T, U> {
  pub key: T,
  pub value: U,
}

pub struct HashMap<T, U> {
  keys: List<T>,

  recent_value: List<Rc<Pair<T, U>>>,
  // values: [Option<Pair<T, U>>; HASH_MAP_SIZE],
  values: [Option<List<Rc<Pair<T, U>>>>; HASH_MAP_SIZE],
}

impl<T, U> HashMap<T, U> {
  const NONE: Option<List<Rc<Pair<T, U>>>> = None;

  pub fn new() -> Self {
    return HashMap {
      keys: List::new(),
      recent_value: List::new(),
      values: [HashMap::NONE; HASH_MAP_SIZE],
    };
  }

  pub fn set(&mut self, key: T, value: U)
  where
    T: Hash<T> + Clone,
  {
    self.keys.push(key.clone());

    let index = (T::hash(&key) as usize) % HASH_MAP_SIZE;
    let pair = Rc::new(Pair { key, value });

    self.recent_value.push(Rc::clone(&pair));
    match &mut self.values[index] {
      Some(list) => list.push(pair),
      None => {
        let mut list = List::new();
        list.push(pair);

        self.values[index] = Some(list);
      }
    };
  }

  pub fn get(&self, key: &T) -> Option<&U>
  where
    T: Hash<T> + Clone,
  {
    match &self.values[(T::hash(key) as usize) % HASH_MAP_SIZE] {
      Some(list) => {
        for item in list.iter() {
          if T::eq(&item.key, key) {
            return Some(&item.value);
          }
        }
        return None;
      }
      None => {
        return None;
      }
    }
  }

  pub fn del(&self, key: &T)
  where
    T: Hash<T> + Clone,
  {
    match &self.values[(T::hash(key) as usize) % HASH_MAP_SIZE] {
      Some(list) => {
        for item in list.iter() {
          if T::eq(&item.key, key) {
            // TODO: !!!
            // Some(&item.value);
            break;
          }
        }
      }
      None => (),
    }
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
