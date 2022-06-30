#!/bin/bash

'''
This script will loop through the passed arguments to execute transfers
on the correct network. You can pass the network as a first argument. 
Currently accepts:

fantom | FANTOM | Fantom;
mainnet | MAINNET | Mainnet;

example:

# transfer ftm and usdc on the fantom network
yarn transfer fantom ftm ftm_usdc 

# transfer eth on mainnet
yarn transfer eth

'''

# will search for the network from the first args
NWI=$1

# Will initially look through rest of args for the tokens
TOKENS="${@:2}"

case $NWI in

  # Localhost is the rpc associated with mainnet
  mainnet | MAINNET | Mainnet)
    NETWORK="localhost"
    ;;

  fantom | FANTOM | Fantom)
    NETWORK="ftm_fork"
    ;;

  # fallback is to mainnet
  *)
    echo "Unrecognised Network, falling back to mainnet..."
    NETWORK="localhost"
    TOKENS="$@"
    ;;
esac

echo "network=$NETWORK" 
echo "tokens=$TOKENS"

# Execute transfers
for token in $TOKENS
do
    echo "Transferring $token"
    npx hardhat run --network $NETWORK "scripts/transfers/$token.ts"
done