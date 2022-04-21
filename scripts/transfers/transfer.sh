#!/bin/bash

for token in "$@"
do
    echo "Transferring $token"
    npx hardhat run --network localhost "scripts/transfers/$token.ts"
done