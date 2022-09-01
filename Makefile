.PHONY: all proto clean

GO_PROJECT=lets-go
RUST_PROJECT=lets-rust-it
SVELTE_PROJECT=lets-svelte-it

clean: 
	echo "TODO"
	rm -rf lets-go/src/pb

proto:
	protoc proto/*.proto --go-grpc_out=lets-go/src --go_out=lets-go/src
	make build -C ./$(RUST_PROJECT)
