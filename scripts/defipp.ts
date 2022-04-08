import * as hre from "hardhat";
import { CONTRACTS, MULTISIGS, TOKENS, WHALES } from "../utils/addresses";
import DEFI_PP from '../abi/defi-pp.json'
import { DefiPp } from '../abi/types/DefiPp'
import { BigNumber, BigNumberish } from "ethers";

const isExitEnabled = async (defiPp: DefiPp) => {
    const exitEnabled = await defiPp.getJoinExitEnabled();
    console.log({ exitEnabled })
}

async function getWhale() {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [WHALES.DEFI_L],
    });
    return await hre.ethers.getSigner(WHALES.DEFI_L);
}

/**
 * Ensure the DEFI++ pool is enabled for exits 
 */
async function enablePool() {
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [MULTISIGS.OPS],
    });
    const multisig = await hre.ethers.getSigner(MULTISIGS.OPS)
    const defiPp = new hre.ethers.Contract(CONTRACTS.PIES.DEFI_PP, DEFI_PP, multisig) as DefiPp;
    await isExitEnabled(defiPp);
    await defiPp.setJoinExitEnabled(true)
    await isExitEnabled(defiPp);
};

async function approveDefiLSwap(quantity: BigNumber) {
    // for clarity, these are similar interfaces
    type DefiL = DefiPp;
    const DEFI_L = DEFI_PP;

    const whale = await getWhale();
    const defiL = new hre.ethers.Contract(CONTRACTS.PIES.DEFI_L, DEFI_L, whale) as DefiL;
    await defiL.approve(CONTRACTS.PIES.DEFI_PP, quantity);
};

async function executeSwap(quantity: BigNumber) {
    const whale = await getWhale();

    const defiPp = new hre.ethers.Contract(CONTRACTS.PIES.DEFI_PP, DEFI_PP, whale) as DefiPp;

    const defiL = new hre.ethers.Contract(CONTRACTS.PIES.DEFI_L, DEFI_PP, whale) as DefiPp;

    let balance = await defiL.balanceOf(whale.address);
    console.log({ balance })

    await defiPp.joinswapExternAmountIn(TOKENS.PIES.DEFI_L, quantity, 100)

    balance = await defiL.balanceOf(whale.address);
    console.log({ balance })
};

const quantity = hre.ethers.utils.parseEther(String(10_000));

enablePool().then(() => {
    console.log('Pool Enabled');

    approveDefiLSwap(quantity).then(() => {
        console.log('Approved');

        executeSwap(quantity).then(() => {

            console.log('Deposited');
            process.exit(0)
        })

    })
        .catch((error: unknown) => {
            console.error(error);
            process.exit(1);
        })
});