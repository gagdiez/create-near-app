#!/bin/sh

./build.sh

echo ">> Deploying contract"

near dev-deploy --wasmFile ./build/release/contract.wasm