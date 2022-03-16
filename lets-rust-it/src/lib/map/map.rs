// Resources:
//  https://medium.com/@narengowda/designing-the-caching-system-e42c6938df6a

use super::hash::Hash;
use super::list::{Iter, List};

use std::sync::Arc;

pub const HASH_MAP_SIZE: usize = 500;

pub struct Pair<T, U> {
  pub key: T,
  pub value: U,
}

pub struct HashMap<T, U> {
  keys: List<T>,

  recent_value: List<Arc<Pair<T, U>>>,
  values: [Option<List<Arc<Pair<T, U>>>>; HASH_MAP_SIZE],
}

impl<T, U> HashMap<T, U>
where
  T: Clone,
  U: Clone,
{
  const NONE: Option<List<Arc<Pair<T, U>>>> = None;

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
    self.keys.push_front(key.clone());

    let index = (T::hash(&key) as usize) % HASH_MAP_SIZE;
    let pair = Arc::new(Pair { key, value });

    // FIXME: Fix bug with repeated value set
    self.recent_value.push_front(Arc::clone(&pair));
    match &mut self.values[index] {
      Some(list) => list.push_front(pair),
      None => {
        let mut list = List::new();
        list.push_front(pair);

        self.values[index] = Some(list);
      }
    };
  }

  pub fn get(&self, key: &T) -> Option<U>
  where
    T: Hash<T> + Clone,
  {
    match &self.values[(T::hash(key) as usize) % HASH_MAP_SIZE] {
      Some(list) => {
        for item in list.iter() {
          if T::eq(&item.key, key) {
            return Some(item.value.clone());
          }
        }
        return None;
      }
      None => None,
    }
  }

  pub fn del(&mut self, key: &T)
  where
    T: Hash<T> + Clone,
  {
    self.keys.del(|v| T::eq(v, key));
    self.recent_value.del(|v| T::eq(&v.key, key));
    self.values[(T::hash(key) as usize) % HASH_MAP_SIZE]
      .as_mut()
      .map(|item| item.del(|v| T::eq(&v.key, key)));
  }

  pub fn keys(&self) -> Iter<T> {
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

    // Rewrite value
    map.set(&"TEST_", 2);

    // Check value receiving
    assert_eq!(map.get(&"HELLO"), Some(5));
    assert_eq!(map.get(&"WORLD"), Some(4));
    assert_eq!(map.get(&"TEST_"), Some(2));

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
    assert_eq!(iter.next(), Some("TEST_"));
    assert_eq!(iter.next(), Some("WORLD"));
    assert_eq!(iter.next(), Some("HELLO"));
  }
}
