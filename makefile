init-wasm :
	./scripts/init.sh

build-chain : init-wasm
	cargo build --release

purge-chain :
	./target/release/substrate-evm purge-chain --dev

clean-chain : purge-chain
	rm -fr ./target

start-chain :
	./target/release/substrate-evm --dev

build-ui :
	cd ./ui && yarn

clean-ui :
	rm -fr ./ui/node_modules

start-ui:
	cd ui && yarn start

podman-build :
	podman build --tag subpi:latest ./rpi/

pi-build : podman-build
	./rpi/pi-build.sh
