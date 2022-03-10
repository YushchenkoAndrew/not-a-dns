build: 
	go build -o ./out/lets-go ./src/main.go

dns: 
	# PAUSE DNS SERVICE
	sudo systemctl stop systemd-resolved

clean:
	# RESTART DNS SERVICE
	sudo systemctl restart systemd-resolved

test: build
	./out/lets-go 0.0.0.0:53535 ./config/config_test.yaml

dev: build dns
	# THIS PROGRAM SHOULD BE LAUNCHED WITH ROOT PERMISSIONS
	sudo ./out/lets-go 0.0.0.0:53 ./config/config.yaml
