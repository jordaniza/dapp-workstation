import { ethers } from 'hardhat';
import { Auxo__factory } from '../../abi/types/factories/Auxo__factory';
import { VaultAuth__factory } from '../../abi/types/factories/VaultAuth__factory';
import { Erc20__factory } from '../../abi/types/factories/Erc20__factory';
import { CONTRACTS, GOVERNANCE, TEST_ACCOUNTS, TOKENS, WHALES } from '../../utils/addresses';
import { impersonate } from '../../utils/impersonate';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import MerkleTree from '../MerkleProofs/output/merkle-tree.json'
import { executeBashScript } from '../../utils/executeBash';
import { BigNumber, Wallet } from 'ethers';
import { promises } from 'dns';
// import { MerkleTree } from 'merkletreejs'
// import SHA256 from 'crypto-js/sha256';
import { keccak256 } from 'ethers/lib/utils';
import dotenv from 'dotenv';

dotenv.config();


async function transferTokens(account: SignerWithAddress | Wallet) {
    console.log("Sending Tokens");
    const auth = VaultAuth__factory.connect(CONTRACTS.VAULTS.FTM.AUTH, account);    
    const adminAddress = await auth.admin();

    const usdcWhale = await impersonate(WHALES.FTM_USDC);
    const ftmWhale = await impersonate(WHALES.FTM);

    const usdc = Erc20__factory.connect(TOKENS.FTM_USDC, usdcWhale);

    console.log('Sending FTM');

    console.log(await ftmWhale.getBalance())
    const tx = await ftmWhale.sendTransaction({
        to: adminAddress,
        value: ethers.utils.parseEther('1'),
    });
    await tx.wait();
  
    await usdc.transfer(account.address, 1e9); // 1 mill
}

function merkleTreeAndRoot() {
    const addresses = [TEST_ACCOUNTS.FAKE_NEWS, ...Object.values(WHALES)];
    const { MerkleTree } = require('merkletreejs');
    const { keccak256 } = require('@ethersproject/keccak256');
    
    function hash(address: string) {
        const keccak = ethers.utils.solidityKeccak256(['address','bool'],[address,true]);
        const sliceKeccak = keccak.slice(2);
        const buff = Buffer.from(sliceKeccak, 'hex');
        const output = ethers.utils.hexlify(buff);
        return output
    }
    
    const Leaves = addresses.map(hash);
    const Tree = new MerkleTree(Leaves, keccak256, {sortPairs: true});

    const root = Tree.getHexRoot()
    const leaf = hash(TEST_ACCOUNTS.FAKE_NEWS);
    const proof = Tree.getProof(leaf) as Array<{ position: string, data: Buffer }>

    const _proof = proof.map(p => { return ethers.utils.hexlify(p.data)});    
    console.log({ root, _proof });

    console.log(Tree.verify(_proof, leaf, root)) // true

    return {
        root,
        _proof
    }
}

async function authDepositor(account: SignerWithAddress | Wallet) {
    console.log("Authorizing Depositor"); 
    const { root, _proof } = merkleTreeAndRoot();

    const auxo = Auxo__factory.connect(CONTRACTS.VAULTS.FTM.AUXO_USDC, account);

    const authAddr = await auxo.auth()   
    const auth = VaultAuth__factory.connect(authAddr, account);  
    
    const adminAddress = await auth.admin();
    const admin = await impersonate(adminAddress);

    console.log({ adminAddress }, 'adminOther', GOVERNANCE.AUXO_FTM_ADMIN)
    
    const authAdmin = VaultAuth__factory.connect(CONTRACTS.VAULTS.FTM.AUTH, admin)

    // @ts-ignore
    // const claims = MerkleTree.claims[account.address];
    // const root = MerkleTree.merkleRoot;
    // const _proof = claims.proof;
    const oldRoot = await auth.merkleRoot();

    console.log('Setting Root')
    console.log({ root, oldRoot })
    const tx = await authAdmin.setMerkleRoot(root);
    await tx.wait();

    const isAuthorised = auth.isDepositor(auxo.address, account.address);

    if (!isAuthorised) await auth.authorizeDepositor(account.address, _proof);

}

async function depositIntoAuxo() {
    // merkleTreeAndRoot()
    // const getBalance = async (account: string): Promise<void> => {
    //     const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8546');
    //     const balance = await provider.getBalance(account);
    //     console.log({ account, balance });
    // }

    // await Promise.all([
    //     '0x19dd92c9a9c4eb6f0426846c4f8a071a7b79209a',
    // ].map(getBalance))
    let account: SignerWithAddress | Wallet;
    try {
        account = await impersonate(TEST_ACCOUNTS.FAKE_NEWS);
        const usdc = Erc20__factory.connect(TOKENS.FTM_USDC, account);
        const check = await usdc.approve(account.address, 1);
        console.log({ check })
    } catch {
        console.log('Using Fallback wallet')
        account = new Wallet(process.env.PRIVATE_KEY ?? '', new ethers.providers.JsonRpcProvider('http://localhost:8546'))
    }

    
    await transferTokens(account);

    // console.log('Hello')

    console.log(await account.getAddress())
    
    const auxo = Auxo__factory.connect(CONTRACTS.VAULTS.FTM.AUXO_USDC, account);
    const usdc = Erc20__factory.connect(TOKENS.FTM_USDC, account);
    
    const approveTx = await usdc.approve(auxo.address, ethers.constants.MaxUint256);
    await approveTx.wait();

    await authDepositor(account);
    console.log('Authorised depositor')
    const depositTx = await auxo.deposit(account.address, 1e9, {
        gasLimit: 12450000
    });

    // await depositTx.wait();
}

depositIntoAuxo()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });

