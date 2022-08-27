#!/bin/sh

# build the contract
npm run build

# deploy the contract
near dev-deploy --wasmFile build/contract.wasm

# get where the contract was deploy
export CONTRACT_NAME=$(cat ./neardev/dev-account)

# initialize it with no arguments
near call $CONTRACT_NAME init --accountId $CONTRACT_NAME --deposit 1