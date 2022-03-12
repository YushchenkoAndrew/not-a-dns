.PHONY: all proto clean

GO_PROJECT=lets-go
RUST_PROJECT=lets-rust-it
SVELTE_PROJECT=lets-svelte-it

clean: 
	echo "TODO"

proto:
	make proto -C ./$(GO_PROJECT)
	make build -C ./$(RUST_PROJECT)
