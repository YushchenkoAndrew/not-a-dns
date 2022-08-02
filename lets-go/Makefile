.PHONY: build test dns dev restart

dns: 
	# PAUSE DNS SERVICE
	# sudo systemctl stop systemd-resolved

restart:
	# RESTART DNS SERVICE
	sudo systemctl restart systemd-resolved

clean:
	rm -rf src/pb/*

proto: clean
	protoc --proto_path=../proto ../proto/cache_service.proto --go-grpc_out=src/pb --go_out=src/pb
	protoc --proto_path=../proto ../proto/dns_service.proto --go-grpc_out=src/pb --go_out=src/pb

build: 
	go build -o ./out/lets-go ./src/main.go

dev: build dns
	# THIS PROGRAM SHOULD BE LAUNCHED WITH ROOT PERMISSIONS
	set CACHE_ADDR=127.0.0.1:50031
	./out/lets-go 0.0.0.0:50053 ./config/config.yaml

test: build
	mkdir -p pb/cache
	set CACHE_ADDR=127.0.0.1:50031
	./out/lets-go 0.0.0.0:53535 ./config/config_test.yaml
