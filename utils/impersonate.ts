import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Wallet } from 'ethers';
import { network, ethers } from 'hardhat'
import { Erc20__factory } from '../abi/types';
import { TOKENS } from './addresses';
import { Networks } from '../utils/networks';

/**
 * Harhat networks require the impersonateAccount method to be called. This differs from ganache where
 * we must provide the accounts to unlock in the command line args
 * @param who the address of the user to impersonate
 */
export const impersonate = async (who: string): Promise<SignerWithAddress> => {
    console.debug(`Impersonating ${who}`)

    
    if (network.name === 'hardhat') {
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [who],
        })
    };
    
    return await ethers.getSigner(who);
};

/**
 * Switch case for the network name to return some network settings to ping the correct
 * contract and provider.
 */
const getRpcAndTestToken = (): { rpc: string, tokenAddress: string } => {
    let port, address;
    switch (network.name) {
        case (Networks.MAINNET.name): {
            port = 8545;
            address = TOKENS.WETH;
            break;
        }
        case (Networks.FTM.name): {
            port = 8546;
            address = TOKENS.FTM_USDC;
            break;
        }
        default: {
            port = 8545;
            address = TOKENS.WETH;
            break;
        }
    }
    return {
        rpc: `http://localhost:${port}`,
        tokenAddress: address
    }
}

/**
 * Ganache seems to have trouble finding/unlocking certain accounts when connected to forks.
 * If we can't connect using the unlocked account/impersonated account, connect directly with the private key. 
 */
export async function getAccountWithFallback(_who: string): Promise<SignerWithAddress | Wallet> {
    let account;

    const { rpc, tokenAddress } = getRpcAndTestToken()

    try {
        account = await impersonate(_who);
        
        // Test the transaction
        const usdc = Erc20__factory.connect(tokenAddress, account);
        await usdc.approve(account.address, 1);
    } catch {
        console.log('Using Fallback wallet')
        if (!process.env.PRIVATE_KEY) throw new Error('Missing environment variable PRIVATE_KEY');
        account = new Wallet(process.env.PRIVATE_KEY, new ethers.providers.JsonRpcProvider(rpc))
    }

    return account
}