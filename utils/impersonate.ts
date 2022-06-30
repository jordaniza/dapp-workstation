import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { network, ethers } from 'hardhat'

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