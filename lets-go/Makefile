build: 
	go build -o ./build/lets-go ./build/main.go

dns: 
	# PAUSE DNS SERVICE
	sudo systemctl stop systemd-resolved

clean:
	# RESTART DNS SERVICE
	sudo systemctl restart systemd-resolved

dev: build dns
	# THIS PROGRAM SHOULD BE LAUNCHED WITH ROOT PERMISSIONS
	sudo ./out/lets-go ./config/config.yaml

