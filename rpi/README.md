# Cross-Compile for Raspberry Pi

The Dockerfile and build script in this directory can be used to create an executable that will run on a [Raspberry Pi](https://www.raspberrypi.org). These tools rely on [`podman`](https://podman.io/) and it must be installed in order to use them. To build the executable, run `make pi-build` in the project root and copy `substrate-evm` from the `./target/armv7-unknown-linux-gnueabihf/release` directory to the Raspberry Pi. Execute the binary from the Pi's terminal to start a blockchain that implements the Ethereum Virtual Machine :rocket:

## External Polkadot UI

In order to use an external Polkadot UI with a Substrate node, the node must be started with the `--ws-external`/`--unsafe-ws-external` and `--rpc-cors all` flags. Note that these flags are not safe for production and should only be used for development purposes.

## Acknowledgments

Thanks to [Sergei Pepyakin](https://github.com/pepyakin) for providing [the tools](https://gist.github.com/pepyakin/2ff227c2d837a2eacd8d3879d5e0c94f) needed to make all this work :pray:
