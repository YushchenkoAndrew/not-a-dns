mod lib;

use lib::map::hash::HashMap;
use std::string::String;

fn main() {
    println!("Hello {}!", "world");

    let mut map = HashMap::new();
    map.set(String::from("HELLO"), String::from("WORLD"));
    // map.set(&String::from("WORLD"), 7);
    // map.set(&String::from("HELLO WORLD"), 6);
    // map.set(&String::from("TEST"), 5);

    for key in map.keys.iter() {
        if let Some(value) = map.get(key.to_owned()) {
            println!("'{}': '{}'", key, value);
        }
    }
}
