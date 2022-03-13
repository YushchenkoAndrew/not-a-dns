.PHONY: build test dev

clean:
	rm -rf src/pb/*

build: 
	cargo build

test: 
	cargo test

dev: build
	# THIS PROGRAM SHOULD BE LAUNCHED WITH ROOT PERMISSIONS
	./target/debug/lets-rust-it [::1]:50051
