#!/bin/sh

./build.sh

echo ">> Deploying contract"

# https://docs.near.org/tools/near-cli#near-dev-deploy
near dev-deploy --wasmFile build/contract.wasm

export CONTRACT_NAME=$(cat ./neardev/dev-account)

# js contracts always need to be initialized
near call $CONTRACT_NAME init --accountId $CONTRACT_NAME --deposit 1