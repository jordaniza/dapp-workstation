import { ethers } from "hardhat";
import { CONTRACTS, TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses"
import { transfer } from "../../utils/transfer"
import erc20Abi from '../../abi/erc20.json'
import { Token } from "../../typechain";
import { impersonate } from "../../utils/impersonate";

const transferBDI = async (): Promise<void> => {

    const account = await impersonate(TEST_ACCOUNTS.FAKE_NEWS);
    const bdi = new ethers.Contract(TOKENS.BDI, erc20Abi, account) as Token;

    await bdi.approve(CONTRACTS.BASKETDAO_MIGRATE, 0);
    await transfer({
        token: TOKENS.BDI,
        whale: WHALES.BDI,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 100
    })
};

transferBDI()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });