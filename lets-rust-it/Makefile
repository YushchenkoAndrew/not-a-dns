build: 
	cargo build

dns: 
	# PAUSE DNS SERVICE
	sudo systemctl stop systemd-resolved

clean:
	# RESTART DNS SERVICE
	sudo systemctl restart systemd-resolved

dev: build dns
	# THIS PROGRAM SHOULD BE LAUNCHED WITH ROOT PERMISSIONS
	sudo ./target/debug/lets-rust-it ./config/config.yaml
