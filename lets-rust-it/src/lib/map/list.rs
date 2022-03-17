// Resources:
//  https://rust-unofficial.github.io/too-many-lists/second.html
//  https://stackoverflow.com/a/12996028

use std::sync::{Arc, Mutex};

pub struct Node<T> {
  next: Option<Arc<Mutex<Node<T>>>>,
  prev: Option<Arc<Mutex<Node<T>>>>,
  value: T,
}

impl<T> Node<T> {
  pub fn new(value: T) -> Arc<Mutex<Node<T>>> {
    Arc::new(Mutex::new(Node {
      next: None,
      prev: None,
      value,
    }))
  }
}

pub struct List<T> {
  head: Option<Arc<Mutex<Node<T>>>>,
  tail: Option<Arc<Mutex<Node<T>>>>,
}

impl<T> List<T>
where
  T: Clone,
{
  pub fn new() -> Self {
    List {
      head: None,
      tail: None,
    }
  }

  pub fn push_front(&mut self, value: T) {
    let new_head = Node::new(value);
    match self.head.take() {
      Some(head) => {
        if let Ok(ref mut node) = head.lock() {
          node.prev = Some(Arc::clone(&new_head))
        }

        if let Ok(ref mut node) = new_head.lock() {
          node.next = Some(head)
        }

        self.head = Some(new_head);
      }

      None => {
        self.tail = Some(Arc::clone(&new_head));
        self.head = Some(new_head);
      }
    }
  }

  pub fn push_back(&mut self, value: T) {
    let new_tail = Node::new(value);
    match self.tail.take() {
      Some(tail) => {
        if let Ok(ref mut node) = tail.lock() {
          node.next = Some(Arc::clone(&new_tail))
        }

        if let Ok(ref mut node) = new_tail.lock() {
          node.prev = Some(tail)
        }

        self.tail = Some(new_tail);
      }

      None => {
        self.head = Some(Arc::clone(&new_tail));
        self.tail = Some(new_tail);
      }
    }
  }

  pub fn pop_front(&mut self) -> Option<T> {
    self.head.take().map(|old_head| {
      let mut node = old_head.lock().unwrap();
      match node.next.take() {
        Some(new_head) => {
          match node.prev.take() {
            Some(prev) => {
              prev.lock().unwrap().next = Some(Arc::clone(&new_head));
              new_head.lock().unwrap().prev = Some(prev);
            }
            None => {
              new_head.lock().unwrap().prev.take();
            }
          }

          self.head = Some(new_head);
        }

        None => {
          self.tail.take();
        }
      }

      node.value.clone()
    })
  }

  pub fn pop_back(&mut self) -> Option<T> {
    self.tail.take().map(|old_tail| {
      let mut node = old_tail.lock().unwrap();
      match node.prev.take() {
        Some(new_tail) => {
          match node.next.take() {
            Some(next) => {
              next.lock().unwrap().prev = Some(Arc::clone(&new_tail));
              new_tail.lock().unwrap().next = Some(next);
            }
            None => {
              new_tail.lock().unwrap().next.take();
            }
          }

          self.tail = Some(new_tail);
        }
        None => {
          self.head.take();
        }
      }

      node.value.clone()
    })
  }

  pub fn peek_front(&self) -> Option<T> {
    self
      .head
      .as_ref()
      .map(|node| node.lock().unwrap().value.clone())
  }

  pub fn peek_back(&self) -> Option<T> {
    self
      .tail
      .as_ref()
      .map(|node| node.lock().unwrap().value.clone())
  }

  pub fn iter(&self) -> Iter<T> {
    Iter {
      next: self.head.as_ref().map(|head| Arc::clone(head)),
    }
  }

  pub fn iter_rev(&self) -> IterRev<T> {
    IterRev {
      prev: self.tail.as_ref().map(|tail| Arc::clone(tail)),
    }
  }

  pub fn del(&mut self, eq: impl Fn(&T) -> bool) -> Option<T> {
    if let Some(item) = self.peek_back() {
      if eq(&item) {
        return self.pop_back();
      }
    }

    if let Some(item) = self.peek_front() {
      if eq(&item) {
        return self.pop_front();
      }
    }

    let prev_head = self.head.as_ref().map(|head| Arc::clone(head));

    loop {
      match self.peek_front() {
        Some(item) => {
          if eq(&item) {
            self.pop_front();
            self.head = prev_head;
            return Some(item);
          }

          self.head = match self.head.take() {
            Some(head) => {
              let node = head.lock().unwrap();
              node.next.as_ref().map(|node| Arc::clone(node))
            }
            None => return None,
          }
        }
        None => {
          self.head = prev_head;
          return None;
        }
      }
    }
  }
}

pub struct Iter<T> {
  next: Option<Arc<Mutex<Node<T>>>>,
}

impl<T> Iterator for Iter<T>
where
  T: Clone,
{
  type Item = T;
  fn next(&mut self) -> Option<Self::Item> {
    self.next.take().map(|head| {
      self.next = head.lock().unwrap().next.take();
      head.lock().unwrap().value.clone()
    })
  }
}

// NOTE: There was some strange bug with DoubleEndedIterator
// therefor creating a different Iter for prev is much MUCH
// easer approach for me (at least right now)
pub struct IterRev<T> {
  prev: Option<Arc<Mutex<Node<T>>>>,
}

impl<T> Iterator for IterRev<T>
where
  T: Clone,
{
  type Item = T;
  fn next(&mut self) -> Option<T> {
    self.prev.take().map(|tail| {
      self.prev = tail.lock().unwrap().prev.take();
      tail.lock().unwrap().value.clone()
    })
  }
}

#[cfg(test)]
mod test {
  use super::List;

  #[test]
  fn basics() {
    let mut list = List::new();

    // Check empty list behaves right
    assert_eq!(list.pop_front(), None);

    // Populate list
    list.push_front(1);
    list.push_front(2);
    list.push_front(3);

    // Check normal removal
    assert_eq!(list.pop_front(), Some(3));
    assert_eq!(list.pop_front(), Some(2));

    // Push some more just to make sure nothing's corrupted
    list.push_front(4);
    list.push_front(5);

    // Check normal removal
    assert_eq!(list.pop_front(), Some(5));
    assert_eq!(list.pop_front(), Some(4));

    // Check exhaustion
    assert_eq!(list.pop_front(), Some(1));
    assert_eq!(list.pop_front(), None);

    // ---- back -----

    // Check empty list behaves right
    assert_eq!(list.pop_back(), None);

    // Populate list
    list.push_back(1);
    list.push_back(2);
    list.push_back(3);

    // Check normal removal
    assert_eq!(list.pop_back(), Some(3));
    assert_eq!(list.pop_back(), Some(2));

    // Push some more just to make sure nothing's corrupted
    list.push_back(4);
    list.push_back(5);

    // Check normal removal
    assert_eq!(list.pop_back(), Some(5));
    assert_eq!(list.pop_back(), Some(4));

    // Check exhaustion
    assert_eq!(list.pop_back(), Some(1));
    assert_eq!(list.pop_back(), None);
  }

  #[test]
  fn peek() {
    let mut list = List::new();
    assert!(list.peek_front().is_none());
    assert!(list.peek_back().is_none());

    list.push_front(1);
    list.push_front(2);
    list.push_front(3);

    assert_eq!(list.peek_front(), Some(3));
    assert_eq!(list.peek_back(), Some(1));
  }

  #[test]
  fn iter() {
    let mut list = List::new();
    list.push_front(1);
    list.push_front(2);
    list.push_front(3);

    let mut iter = list.iter();
    assert_eq!(iter.next(), Some(3));
    assert_eq!(iter.next(), Some(2));
    assert_eq!(iter.next(), Some(1));

    list.push_front(1);
    list.push_front(2);
    list.push_front(3);

    let mut iter_rev = list.iter_rev();
    assert_eq!(iter_rev.next(), Some(1));
    assert_eq!(iter_rev.next(), Some(2));
    assert_eq!(iter_rev.next(), Some(3));
  }

  #[test]
  fn del() {
    let mut list = List::new();

    assert_eq!(list.del(|&x| x == 2), None);

    list.push_front(1);
    list.push_front(2);
    list.push_front(3);

    assert_eq!(list.del(|&x| x == 2), Some(2));
    assert_eq!(list.del(|&x| x == 5), None);

    let mut iter = list.iter();
    assert_eq!(iter.next(), Some(3));
    assert_eq!(iter.next(), Some(1));
    assert_eq!(iter.next(), None);

    let mut iter_rev = list.iter_rev();
    assert_eq!(iter_rev.next(), Some(1));
    assert_eq!(iter_rev.next(), Some(3));
    assert_eq!(iter_rev.next(), None);

    assert_eq!(list.del(|&x| x == 1), Some(1));

    list.push_front(4);

    iter = list.iter();
    assert_eq!(iter.next(), Some(4));
    assert_eq!(iter.next(), None);
  }

  #[test]
  fn del_full_list() {
    let mut list = List::new();

    list.push_front(1);
    list.push_front(2);

    assert_eq!(list.del(|&x| x == 2), Some(2));
    assert_eq!(list.del(|&x| x == 1), Some(1));

    let mut iter = list.iter();
    assert_eq!(iter.next(), None);
    assert_eq!(iter.next(), None);
  }
}
