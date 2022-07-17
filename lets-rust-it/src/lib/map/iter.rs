use std::{
  fmt::Display,
  fs::File,
  io::{BufReader, Lines},
  str::FromStr,
  sync::{Arc, Mutex},
};

use super::{hash::Hash, list::Node, map::HashMap};

pub struct ListIter<T> {
  next: Option<Arc<Mutex<Node<T>>>>,
}

impl<T> ListIter<T>
where
  T: Clone,
{
  pub fn new(next: Option<Arc<Mutex<Node<T>>>>) -> ListIter<T> {
    ListIter { next }
  }
}

impl<T> Iterator for ListIter<T>
where
  T: Clone,
{
  type Item = T;
  fn next(&mut self) -> Option<Self::Item> {
    let value = match self.next.as_ref() {
      Some(head) => head.lock().unwrap().value(),
      None => None,
    };

    self.next = match self.next.as_ref() {
      Some(head) => match head.lock().unwrap().next() {
        Some(head) => Some(head),
        None => None,
      },
      None => None,
    };

    value
  }
}

// NOTE: There was some strange bug with DoubleEndedIterator
// therefor creating a different Iter for prev is much MUCH
// easer approach for me (at least right now)
pub struct ListIterRev<T> {
  prev: Option<Arc<Mutex<Node<T>>>>,
}

impl<T> ListIterRev<T>
where
  T: Clone,
{
  pub fn new(prev: Option<Arc<Mutex<Node<T>>>>) -> ListIterRev<T> {
    ListIterRev { prev }
  }
}

impl<T> Iterator for ListIterRev<T>
where
  T: Clone,
{
  type Item = T;
  fn next(&mut self) -> Option<Self::Item> {
    let value = match self.prev.as_ref() {
      Some(tail) => tail.lock().unwrap().value(),
      None => None,
    };

    self.prev = match self.prev.as_ref() {
      Some(tail) => match tail.lock().unwrap().prev() {
        Some(tail) => Some(tail),
        None => None,
      },
      None => None,
    };

    value
  }
}

pub struct HistoryIter<T, U> {
  _type: Option<HashMap<T, U>>,
  lines: Vec<String>,
}

impl<T, U> HistoryIter<T, U>
where
  T: Hash<T> + Clone + Display + FromStr,
  U: Clone + Display + FromStr,
{
  pub fn new(lines: Lines<BufReader<File>>) -> Self {
    HistoryIter {
      _type: None,
      lines: lines.map(|l| l.unwrap()).collect::<Vec<_>>(),
    }
  }
}

impl<T, U> Iterator for HistoryIter<T, U>
where
  T: Hash<T> + Clone + Display + FromStr,
  U: Clone + Display + FromStr,
{
  type Item = (i32, T, U);
  fn next(&mut self) -> Option<Self::Item> {
    match self.lines.pop() {
      Some(line) => HashMap::parse(line),
      None => None,
    }
  }
}

pub struct MapIter<T, U> {
  iter: ListIter<T>,
  history: HistoryIter<T, U>,
}

impl<T, U> MapIter<T, U>
where
  T: Hash<T> + Clone + Display + FromStr,
  U: Clone + Display + FromStr,
{
  pub fn new(history: HistoryIter<T, U>, iter: ListIter<T>) -> MapIter<T, U> {
    MapIter { history, iter }
  }
}

impl<T, U> Iterator for MapIter<T, U>
where
  T: Hash<T> + Clone + Display + FromStr,
  U: Clone + Display + FromStr,
{
  type Item = (Option<i32>, T);

  #[inline]
  fn next(&mut self) -> Option<Self::Item> {
    match self.iter.next() {
      Some(key) => Some((None, key)),
      None => loop {
        match self.history.next() {
          Some((pr, key, val)) => {
            if pr == -1 {
              return Some((Some(pr), key));
            }

            continue;
          }
          None => return None,
        }
      },
    }
  }
}
