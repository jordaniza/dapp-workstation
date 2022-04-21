
import { ethers } from "hardhat";
import { Token } from "../../typechain";
import { CONTRACTS, TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses";
import { impersonate } from "../../utils/impersonate";
import { transfer } from "../../utils/transfer";
import ERC20 from '../../abi/erc20.json'

export const transferDough = async () => {
    await transfer({
        token: TOKENS.DOUGH,
        whale: WHALES.DOUGH,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 10_000
    })
};

export const approveDoughStaking = async () => {
    await impersonate(TEST_ACCOUNTS.FAKE_NEWS);
    const testAccount = await ethers.getSigner(TEST_ACCOUNTS.FAKE_NEWS)
    const dough = new ethers.Contract(TOKENS.DOUGH, ERC20, testAccount) as Token
    await dough.approve(CONTRACTS.STAKING, ethers.constants.MaxUint256, {
        maxFeePerGas: 22054650735
    });
}

transferDough()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });