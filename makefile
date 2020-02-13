init-wasm :
	./scripts/init.sh

build-chain : init-wasm
	cargo build --release

purge-chain :
	./target/release/node-template purge-chain --dev

clean-chain : purge-chain
	rm -fr ./target

start-chain :
	./target/release/node-template --dev

build-ui :
	cd ./ui && yarn

clean-ui :
	rm -fr ./ui/node_modules

start-ui:
	cd ui && yarn start

build : build-chain build-ui

clean : clean-chain clean-ui

podman-build :
	podman build --tag subpi:latest ./rpi/

pi-build : podman-build
	./rpi/pi-build.sh
