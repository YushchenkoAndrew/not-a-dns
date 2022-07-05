// Resources:
//  https://medium.com/@narengowda/designing-the-caching-system-e42c6938df6a

use crate::lib::map::macros::parse_T;

use super::hash::Hash;
use super::history::History;
use super::iter::{KeyIter, ListIter};
use super::list::List;

use std::fmt::Display;
use std::str::FromStr;
use std::sync::Arc;

pub const HASH_MAP_SIZE: usize = 100;
pub const HASH_MAP_MAX_RECENT: i32 = 20;
pub const HASH_MAP_HISTORY: &str = "./map.history";

pub struct Pair<T, U> {
  pub key: T,
  pub value: U,
}

pub struct HashMap<T, U> {
  keys: List<T>,

  recent_value: List<Arc<Pair<T, U>>>,
  values: [Option<List<Arc<Pair<T, U>>>>; HASH_MAP_SIZE],

  history: String,
}

impl<T, U> HashMap<T, U>
where
  T: Hash<T> + Clone + Display + FromStr,
  U: Clone + Display + FromStr,
{
  const NONE: Option<List<Arc<Pair<T, U>>>> = None;

  pub fn new() -> Self {
    return HashMap {
      keys: List::new(),
      recent_value: List::new(),
      values: [HashMap::NONE; HASH_MAP_SIZE],
      history: String::from(HASH_MAP_HISTORY),
    };
  }

  pub fn set(&mut self, key: T, value: U) {
    let index = (T::hash(&key) as usize) % HASH_MAP_SIZE;
    let pair = Arc::new(Pair {
      key: key.clone(),
      value,
    });

    match &mut self.values[index] {
      Some(list) => {
        if let Some(_) = list.del(|v| T::eq(&v.key, &key)) {
          list.push_front(Arc::clone(&pair));
          self.recent_value.del(|v| T::eq(&v.key, &key));
        } else {
          self.keys.push_front(key);
          list.push_front(Arc::clone(&pair));
        }
      }
      None => {
        let mut list = List::new();
        list.push_front(Arc::clone(&pair));

        self.keys.push_front(key);
        self.values[index] = Some(list);
      }
    }

    if self.recent_value.len() == HASH_MAP_MAX_RECENT {
      self.recent_value.pop_back();
    }

    self.recent_value.push_front(pair);

    // TODO: Make in thread / async !!
    History::screenshot(&self.history.clone(), self);
  }

  pub fn get(&self, key: &T) -> Option<U> {
    match &self.values[(T::hash(key) as usize) % HASH_MAP_SIZE] {
      Some(list) => list
        .includes(|v| T::eq(&v.key, &key))
        .0
        .map(|v| v.value.clone()),
      None => None,
    }
  }

  pub fn del(&mut self, key: &T) -> Option<U> {
    let index = (T::hash(key) as usize) % HASH_MAP_SIZE;
    self.keys.del(|v| T::eq(v, key));
    self.values[index]
      .as_mut()
      .map(|item| item.del(|v| T::eq(&v.key, key)));

    self
      .recent_value
      .del(|v| T::eq(&v.key, key))
      .map(|item| item.value.clone())
  }

  pub fn keys(&self) -> KeyIter<T, U> {
    KeyIter::new(History::iter(&self.history))
  }

  pub fn key_iter(&self) -> ListIter<T> {
    self.keys.iter()
  }

  #[inline]
  pub fn to_string(map: &mut HashMap<T, U>, key: &T) -> Option<String>
  where
    T: Hash<T> + Clone + Display + FromStr,
    U: Clone + Display + FromStr,
  {
    let val = map.get(key);
    let (_, pr) = map.recent_value.includes(|v| T::eq(&v.key, &key));

    if pr == -1 {
      let index = (T::hash(&key) as usize) % HASH_MAP_SIZE;
      if let Some(ref mut list) = map.values[index] {
        list.del(|v| T::eq(&v.key, &key));
      }
    }

    val.map(|val| format!("{} {} {}={}\n", pr, key.to_string().len(), key, val))
  }

  #[inline]
  pub fn parse(line: String) -> Option<(i32, T, U)>
  where
    T: Hash<T> + Clone + Display + FromStr,
    U: Clone + Display + FromStr,
  {
    let vec = line.splitn(3, " ").collect::<Vec<_>>();
    if vec.len() != 3 {
      return None;
    }

    let len = parse_T!(vec[1], usize);
    Some((
      parse_T!(vec[0], i32),
      parse_T!(vec[2][..len], T),
      parse_T!(vec[2][len + 1..], U),
    ))
  }
}

#[cfg(test)]
mod test {
  use super::HashMap;

  #[test]
  fn basics() {
    let mut map = HashMap::new();

    // Check empty map behaves right
    assert_eq!(map.get(&String::from("HELLO")), None);

    // Populate map
    map.set(String::from("HELLO"), 5);
    map.set(String::from("WORLD"), 4);
    map.set(String::from("TEST_"), 3);

    // Rewrite value
    map.set(String::from("TEST_"), 2);

    // Check value receiving
    assert_eq!(map.get(&String::from("HELLO")), Some(5));
    assert_eq!(map.get(&String::from("WORLD")), Some(4));
    assert_eq!(map.get(&String::from("TEST_")), Some(2));

    // Check normal removal
    assert_eq!(map.del(&String::from("WORLD")), Some(4));
    assert_eq!(map.get(&String::from("WORLD")), None);

    // Push some more just to make sure nothing's corrupted
    map.set(String::from("WORLD"), 6);
    map.set(String::from("TEST_"), 7);

    assert_eq!(map.get(&String::from("HELLO")), Some(5));
    assert_eq!(map.get(&String::from("WORLD")), Some(6));
    assert_eq!(map.get(&String::from("TEST_")), Some(7));

    // Check normal removal
    assert_eq!(map.del(&String::from("WORLD2")), None);
    assert_eq!(map.del(&String::from("WORLD3")), None);

    // Check exhaustion
    assert_eq!(map.del(&String::from("HELLO")), Some(5));
    assert_eq!(map.del(&String::from("WORLD")), Some(6));
    assert_eq!(map.del(&String::from("TEST_")), Some(7));
  }

  #[test]
  fn iter() {
    let mut map = HashMap::new();

    // Check empty map behaves right
    assert_eq!(map.get(&String::from("HELLO")), None);

    // Populate map
    map.set(String::from("HELLO"), 5);
    map.set(String::from("WORLD"), 4);
    map.set(String::from("TEST_"), 3);
    map.set(String::from("TEST_"), 3);

    let mut iter = map.keys();

    assert_eq!(iter.next(), Some(String::from("TEST_")));
    assert_eq!(iter.next(), Some(String::from("WORLD")));
    assert_eq!(iter.next(), Some(String::from("HELLO")));
  }

  #[test]
  fn keys() {
    let mut map = HashMap::new();

    // Populate map
    map.set(String::from("HELLO"), 5);
    map.set(String::from("WORLD"), 4);
    map.set(String::from("TEST_"), 3);

    let mut iter = map.keys();

    // Check value receiving
    assert_eq!(iter.next(), Some(String::from("TEST_")));
    assert_eq!(iter.next(), Some(String::from("WORLD")));
    assert_eq!(iter.next(), Some(String::from("HELLO")));

    // Check if keys still exists
    assert_eq!(map.get(&String::from("HELLO")), Some(5));
    assert_eq!(map.get(&String::from("WORLD")), Some(4));
    assert_eq!(map.get(&String::from("TEST_")), Some(3));

    iter = map.keys();

    // Check value receiving
    assert_eq!(iter.next(), Some(String::from("TEST_")));
    assert_eq!(iter.next(), Some(String::from("WORLD")));
    assert_eq!(iter.next(), Some(String::from("HELLO")));
  }

  #[test]
  fn string() {
    let mut map = HashMap::new();

    // Populate map
    map.set(String::from("HELLO"), 5);
    map.set(String::from("WORLD"), 4);
    map.set(String::from("TEST_"), 3);

    // Check to_string func
    assert_eq!(
      HashMap::to_string(&mut map, &String::from("HELLO")),
      Some(String::from("2 5 HELLO=5\n"))
    );

    assert_eq!(
      HashMap::to_string(&mut map, &String::from("HELLO_WORLD")),
      None
    );

    // Check from_string func
    assert_eq!(
      HashMap::parse(String::from("-1 5 TEST2=6")),
      Some((-1, String::from("TEST2"), 6))
    );
    assert_eq!(HashMap::<String, i32>::parse(String::from("")), None);
    // map.from_string(String::from(""));
  }
}
