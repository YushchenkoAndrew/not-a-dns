macro_rules! parse_T {
  ($e:expr, $t:ty) => {
    match $e.parse::<$t>() {
      Ok(v) => v,
      Err(_) => panic!("Ain't be able to parse string"),
    }
  };
}

pub(crate) use parse_T;
