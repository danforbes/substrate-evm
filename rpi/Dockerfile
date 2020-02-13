FROM rust:latest

RUN dpkg --add-architecture armhf && \
    apt-get update && apt-get upgrade -y && \
    apt-get install -y aptitude && \
    aptitude install -y \
        gcc-arm-linux-gnueabihf \
        libgtk-3-dev:armhf \
        pkg-config \
        libasound2-dev:armhf \
        g++-arm-linux-gnueabihf \
        cmake \
        libssl-dev \
        git \
        clang \
        libclang-dev \
        libssl-dev:armhf \
        libsdl2-dev:armhf

# Install nightly with w32-u-u and add arvm7 to stable
RUN rustup target add armv7-unknown-linux-gnueabihf
RUN rustup install nightly && \
    rustup target add wasm32-unknown-unknown --toolchain nightly &&\
    cargo +nightly install --git https://github.com/alexcrichton/wasm-gc --force

ENV CARGO_TARGET_ARMV7_UNKNOWN_LINUX_GNUEABIHF_LINKER arm-linux-gnueabihf-gcc
ENV PKG_CONFIG_ALLOW_CROSS 1
ENV PKG_CONFIG_PATH /usr/lib/arm-linux-gnueabihf/pkgconfig/

RUN useradd rust --user-group --create-home --shell /bin/bash --groups sudo
WORKDIR /home/rust/src
