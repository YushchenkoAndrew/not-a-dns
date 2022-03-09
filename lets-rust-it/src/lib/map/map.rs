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
  const INIT: Option<Pair<T, U>> = None;

  pub fn new() -> Self {
    return HashMap {
      keys: List::new(),
      values: [HashMap::INIT; HASH_MAP_SIZE],
    };
  }

  pub fn set(&mut self, key: T, value: U)
  where
    T: Hash<T> + Clone,
  {
    self.keys.push(key.clone());
    let index = (T::hash(&key) as usize) % HASH_MAP_SIZE;
    self.values[index] = Some(Pair { key, value });
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
