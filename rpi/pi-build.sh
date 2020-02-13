#!/bin/bash
podman run --rm -it \
	--env BINDGEN_EXTRA_CLANG_ARGS="--sysroot=/usr/arm-linux-gnueabihf -D__ARM_PCS_VFP -mfpu=vfp -mfloat-abi=hard" \
	-v "$(pwd)":/home/rust/src subpi:latest \
	cargo build --target=armv7-unknown-linux-gnueabihf --release
