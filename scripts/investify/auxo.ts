import { ethers } from 'hardhat';
import { VaultAuth__factory } from '../../abi/types/factories/VaultAuth__factory';
import { Erc20__factory } from '../../abi/types/factories/Erc20__factory';
import { CONTRACTS, TEST_ACCOUNTS, TOKENS, WHALES } from '../../utils/addresses';
import { getAccountWithFallback, impersonate } from '../../utils/impersonate';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import dotenv from 'dotenv';
import { Wallet } from 'ethers';
import { getAuxoContracts } from '../../utils/getAuxoContracts';
import { merkleTreeAndRoot } from '../../utils/generateMerkleTree';

import { Auxo, VaultAuth } from '../../abi/types';

dotenv.config();

async function transferTokens(account: SignerWithAddress | Wallet) {
    const auth = VaultAuth__factory.connect(CONTRACTS.VAULTS.FTM.AUTH, account);    
    const adminAddress = await auth.admin();

    const usdcWhale = await impersonate(WHALES.FTM_USDC);
    const ftmWhale = await impersonate(WHALES.FTM);

    const usdc = Erc20__factory.connect(TOKENS.FTM_USDC, usdcWhale);

    const tx = await ftmWhale.sendTransaction({
        to: adminAddress,
        value: ethers.utils.parseEther('1'),
    });
    await tx.wait();
  
    await usdc.transfer(account.address, 1e9); // 1 mill
}



async function authDepositor(account: SignerWithAddress | Wallet, auth: VaultAuth, auxo: Auxo) {
    console.log("Authorizing Depositor"); 

    const { root, proof } = merkleTreeAndRoot(account.address);

    const oldRoot = await auth.merkleRoot();

    console.log('Setting Root');
    console.log({ root, oldRoot });

    const tx = await auth.setMerkleRoot(root);
    await tx.wait();

    const isAuthorised = await auth.isDepositor(auxo.address, account.address);

    console.log({ isAuthorised });

    if (!isAuthorised) {
        console.log('Depositor Not authorised, authorizing...')
        const authTx = await auth.authorizeDepositor(account.address, proof);
        await authTx.wait();
    }

    console.log('Depositor Authorised');
}

export async function depositIntoAuxo() {
    console.log('Beginning deposit into Auxo - note this is currently configured for the FTM network');

    const account = await getAccountWithFallback(TEST_ACCOUNTS.FAKE_NEWS);
    await transferTokens(account);
    
    const { auxo, auth } = await getAuxoContracts(account);

    const usdc = Erc20__factory.connect(TOKENS.FTM_USDC, account);
    
    const approveTx = await usdc.approve(auxo.address, ethers.constants.MaxUint256);
    await approveTx.wait();

    await authDepositor(account, auth, auxo);

    const depositTx = await auxo.deposit(account.address, 1e9, {
        gasLimit: 12450000
    });

    await depositTx.wait();

    console.log('Deposit Successful');
}

if (require.main === module) depositIntoAuxo()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });
