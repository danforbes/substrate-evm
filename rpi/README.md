# Cross-Compile for Raspberry Pi

The Dockerfile and build script included in this directory can be used to create a binary that I have successfully run on a [Raspberry Pi 4](https://www.raspberrypi.org/products/raspberry-pi-4-model-b/). These tools rely on [`podman`](https://podman.io/) and it should be installed on your system if you intend on using them. To build the executable, just run `make pi-build` in the project root and copy the resulting artifact from the `./target/armv7-unknown-linux-gnueabihf/release` directory to your Raspberry Pi. Execute the binary from your Pi's terminal to start your own blockchain that implements the Ethereum Virtual Machine :rocket:

# Acknowledgments

Thanks to [Sergei Pepyakin](https://github.com/pepyakin) for providing [the tools](https://gist.github.com/pepyakin/2ff227c2d837a2eacd8d3879d5e0c94f) needed to make all this work :pray:
