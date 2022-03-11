// Resources:
//  https://www.studytonight.com/operating-system/highest-response-ratio-next-hrrn-scheduling?utm_source=pocket_mylist

use std::time::SystemTime;
use std::vec::Vec;

struct Process<T> {
  created_at: u128,
  execution: u32,

  value: T,
}

pub struct Queue<T> {
  clock: SystemTime,
  queue: Vec<Process<T>>,
}

impl<T> Queue<T> {
  pub fn new() -> Self {
    Queue {
      clock: SystemTime::now(),
      queue: vec![],
    }
  }

  pub fn push(&mut self, value: T, execution: u32) {
    self.queue.push(Process {
      created_at: self
        .clock
        .elapsed()
        .expect("System clock crashed on push request")
        .as_millis(),

      execution,
      value,
    });
  }

  pub fn pop(&mut self) -> Option<T> {
    let mut index: usize = usize::MIN;
    let mut response_ration: f64 = f64::MIN;

    let now = self
      .clock
      .elapsed()
      .expect("System clock crashed on push request")
      .as_millis();

    for (i, proc) in self.queue.iter().enumerate() {
      let temp = (now - proc.created_at) as f64 / proc.execution as f64 + 1.;
      if response_ration < temp {
        index = i;
        response_ration = temp;
      }
    }

    if self.queue.len() != 0 {
      return Some(self.queue.remove(index).value);
    }
    None
  }
}

#[cfg(test)]
mod test {
  use super::Queue;
  use std::thread::sleep;
  use std::time::Duration;

  //
  //  +--+--+--+--+--+--+--+--+--+--+- Time diagram  -+--+--+--+--+--+--+--+--+--+--+-
  //  | A |  @~~~~~~~~>  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  |
  //  | B |  .  .  @..o~~~~~~~~~~~~~~~~~>  .  .  .  .  .  .  .  .  .  .  .  .  .  .  |
  //  | C |  .  .  .  .  @................................o~~~~~~~~~~~~~~~~~~~~~~~>  |
  //  | D |  .  .  .  .  .  .  @........o~~~~~~~~~~~>  .  .  .  .  .  .  .  .  .  .  |
  //  | E |  .  .  .  .  .  .  .  @.................o~~~~~>  .  .  .  .  .  .  .  .  |
  //  |   +==========================================================================+
  //  |   0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24  |
  //  +--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+-
  //
  //  Annotations:
  //    '@' - Add Process to queue
  //    '.' - Process is waiting
  //    'o' - Process start execution
  //    '~' - Process is till running
  //    '>' - Process has been finished
  //
  #[test]
  fn basic() {
    let mut queue = Queue::new();
    sleep(Duration::from_millis(1)); // t = 1

    // Populate queue
    queue.push("A", 3);
    assert_eq!(queue.pop(), Some("A"));

    sleep(Duration::from_millis(2)); // t = 3
    queue.push("B", 6);

    sleep(Duration::from_millis(1)); // t = 4
    assert_eq!(queue.pop(), Some("B"));

    sleep(Duration::from_millis(1)); // t = 5
    queue.push("C", 8);

    sleep(Duration::from_millis(2)); // t = 7
    queue.push("D", 4);

    sleep(Duration::from_millis(1)); // t = 8
    queue.push("E", 5);

    sleep(Duration::from_millis(2)); // t = 10
    assert_eq!(queue.pop(), Some("D"));

    sleep(Duration::from_millis(4)); // t = 14
    assert_eq!(queue.pop(), Some("E"));

    sleep(Duration::from_millis(2)); // t = 16
    assert_eq!(queue.pop(), Some("C"));

    assert_eq!(queue.pop(), None);
  }
}
