.PHONY: build test clean dev

clean:
	rm -rf src/pb/*

build: clean
	cargo build

test: 
	cargo test

dev: build
	# THIS PROGRAM SHOULD BE LAUNCHED WITH ROOT PERMISSIONS
	./target/debug/lets-rust-it
