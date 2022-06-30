# PieDAO development Environment

This is a sample development environment for PieDAO allowing you to spin up a local fork and connect via RPC.
## Motivation

We already have Development environments. Brownie, Hardhat, Truffle etc. etc. These tools are excellent and this environment does not aim to replicate them.

Instead it is a collection of template files, scripts for common operations, documentation for common pitfalls, and worked examples. The aim is very simple: getting your DApp environment working quickly will save you a TON of development time, and even the learning curve of something as user friendly as, say, hardhat, is time you could spend building cool Web3 apps.

Essentially, this is aiming to get you started, addressing the sharp corners in running forked nodes, and providing you with a swiss-army knife of tools that you can add to as you need.
## Starting the network

Open a terminal and start an RPC Server on `http://localhost:{PORT}`, this will also unlock all the accounts in the `WHALES` variable in `utils/addresses.ts`.

```bash
yarn fork:{NETWORK}
```
Available options for NETWORK are `mainnet` (port 8545) and `ftm` (port 8546)


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
yarn run:hardhat /path/to/script.ts
```

If you actually want changes to be applied to the fork, open a second terminal while the fork is running, and use:

```sh
yarn run:fork[:NETWORK] /path/to/script.ts
```

The script defaults to mainnet, you can run on different forks by adding the NETWORK variable, for example:

```
sh

# run on mainnet
yarn run:fork /script

# run on fantom fork
yarn run:fork:ftm /script
```

A common use case is to transfer tokens to your account for testing different states. You can do this by:

1. Creating a new script in `scripts/transfers` with the name of the file as the token you want to transfer.
2. Ensure that you add the contract of the token, and an associated 'Whale' from whom you can transfer the tokens.
3. Ensure your account is added to the test accounts.
4. Run the following
```sh
yarn transfer [network] [tokens] 
```
Example, to transfer WBTC, SLICE and ETH on mainnet:
```
yarn transfer mainnet wbtc slice eth
``` 

Alternatively, you can transfer on FTM:

```
yarn transfer fantom ftm_usdc ftm
```
You'll notice that each erc20 needs to be setup for each chain, we will look to improve that in the future.

## Generate Typings

```
yarn types
```

We can also generate types using `npx hardhat typechain`, but this is generally used for contracts.

## Metamask

Forked networks in particular seem to have a lot of challenges with metamask on lots of development environments:

* Brownie can lock up completly with multiple inbound RPC calls
* Hardhat has a number of bugs that cause the RPC node to become unresponsive over time
* Ganache is by far the most stable, but has comptability issues with some versions of metamask
* Tenderly forks work fine, but have rate limits and limited functionality for scripting

Different versions of Metamask have different stability. It is possible for transactions to get stuck indefinitely, although this seems intermittent. If in doubt, try restarting the RPC, resetting the nonce on metamask & reopening the browser.

The Metamask Flask is a useful canary version that can be used as an alternative to the current metamask if you are having difficulties. You can also try installing older versions.

## Gotchas:

### Impersonate Accounts before transfering

Before executing transactions on behalf of other accounts, you need to enable such accounts on the network:


**On Hardhat**
Before making a signed request on behalf of another account, ensure you call the special method "hardhat_impersonateAccount":

```ts
await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: ['0x....'],
});

```

**On Ganache**
Ganache requires the account be added as a parameter in the `--unlock` flag when starting the node. Note that this means the node needs to be restarted if you need to add another account.

In the `utils/addresses.ts` file, there is a list of `WHALES`: accounts on a given blockchain that have large numbers of a particular token. If you add an account to this, it will automatically get picked up by the `yarn fork:{chain}` script.

**Helper Utils**
Call the `impersonate(account: string)` method when writing scripts. This can be found in the `utils/` folder. This will check if the network is hardhat or not before calling the impersonate method. Useful to avoid having to rewrite scripts between unit testing and forking. 
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
