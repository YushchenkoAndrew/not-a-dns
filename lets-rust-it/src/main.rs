mod lib;

use lib::map::map::HashMap;
use std::string::String;

fn main() {
    println!("Hello {}!", "world");

    let mut map = HashMap::new();
    map.set(String::from("HELLO"), "WORLD");
    map.set(String::from("WORLD"), "TEST");
    map.set(String::from("HELLO WORLD"), "YESS");
    map.set(String::from("TEST"), "5555");

    for key in map.keys() {
        if let Some(value) = map.get(key) {
            println!("'{}': '{}'", key, value);
        }
    }
}
