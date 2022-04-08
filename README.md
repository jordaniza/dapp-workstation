# PieDAO development Environment

This is a sample development environment for PieDAO allowing you to spin up a local fork and connect via RPC.

## Starting the network

Open a terminal and start an RPC Server on `http://localhost:8545`

```bash
yarn fork:mainnet
```
See the [metamask](#metamask) section below for the issues with metamask, and why we are using the ganache-cli to run the local RPC node.

## Running scripts

Scripts can access the runtime environment by simply importing it:

```ts
// this enables ethers on the hre
import "@nomiclabs/hardhat-waffle";
import * as hre from 'hardhat'
```

When running a script, you can test it works without messing with the fork by running:

```sh
npx hardhat --network hardhat run scripts/myScript.ts
```

If you actually want changes to be applied to the fork, use:

```sh
npx hardhat --network localhost run scripts/transferDough.ts
```

## Generate Typings

```
yarn types
```

We can generate types using `npx hardhat typechain`, but this is generally used for contracts 

## Metamask

Forked networks in particular seem to have a lot of challenges with metamask on lots of development environments:

* Brownie can lock up completly with multiple inbound RPC calls
* Hardhat has a number of bugs that cause the RPC node to become unresponsive over time
* Ganache is by far the most stable, but has comptability issues with some versions of metamask
* Tenderly forks work fine, but have rate limits and limited functionality for scripting

As of time of writing, a stable option is to install the 10.7.1 version of metamask connected to an RPC server on ganache-cli

## Gotchas:


### Impersonate Accounts before transfering

Before making a signed request on behalf of another account, ensure you call the special method "hardhat_impersonateAccount":

```ts
await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ['0x....'],
});

```
### Scripts need to be invoked

Add this boilerplate so your async scripts actually run when you invoke them:

```ts

export const transferEth = async () => {
    await doStuff();
}

transferEth()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });
```

### Reset Nonce on Metamask

When you mess around with forks, this can cause issues on Metamask unless you reset the transaction nonce to zero. It might now always be clear that this is the issue, so if you've just restarted the RPC Server, you should do this:

Open Metamask -> Click Profile -> Settings -> Advanced -> Reset Account
