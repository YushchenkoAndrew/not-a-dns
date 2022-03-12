.PHONY: build test dns dev restart

dns: 
	# PAUSE DNS SERVICE
	sudo systemctl stop systemd-resolved

restart:
	# RESTART DNS SERVICE
	sudo systemctl restart systemd-resolved

clean:
	rm -rf src/pb/*

proto: clean
	protoc --proto_path=../proto ../proto/*.proto --go-grpc_out=src/pb --go_out=src/pb

build: 
	go build -o ./out/lets-go ./src/main.go

dev: build dns
	# THIS PROGRAM SHOULD BE LAUNCHED WITH ROOT PERMISSIONS
	sudo ./out/lets-go 0.0.0.0:53 ./config/config.yaml

test: build
	mkdir -p pb/cache
	./out/lets-go 0.0.0.0:53535 ./config/config_test.yaml
