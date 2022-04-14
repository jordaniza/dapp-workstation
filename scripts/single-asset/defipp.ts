import * as hre from "hardhat";
import { CONTRACTS, MULTISIGS, TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses";
import DEFI_PP from '../../abi/defi-pp.json'
import { DefiPp } from '../../abi/types/DefiPp'
import { BigNumber, BigNumberish, Contract } from "ethers";
import { impersonate } from "../../utils/impersonate";
import { ethers, network } from "hardhat";
import { transfer } from "../../utils/transfer";
import { Token } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { transferDefipl, transferDefips } from "../transfers/defi";

const isExitEnabled = async (defiPp: DefiPp) => {
    const exitEnabled = await defiPp.getJoinExitEnabled();
    console.log({ exitEnabled })
}

type Pie = keyof typeof TOKENS['PIES'];

const PIE: Pie = 'DEFI_L'


/**
 * Ensure the DEFI++ pool is enabled for exits 
 */
async function enablePool() {
    const multisig = await impersonate(MULTISIGS.OPS);
    const defiPp = new hre.ethers.Contract(CONTRACTS.PIES[PIE], DEFI_PP, multisig) as DefiPp;
    await isExitEnabled(defiPp);
    await defiPp.setJoinExitEnabled(true)
    await isExitEnabled(defiPp);
};

const getDefiPies = (account: SignerWithAddress,): [defiPx: DefiPp, defiPp: DefiPp] => {
    const defiPx = new hre.ethers.Contract(CONTRACTS.PIES[PIE], DEFI_PP, account) as DefiPp;
    const defiPp = new hre.ethers.Contract(CONTRACTS.PIES.DEFI_PP, DEFI_PP, account) as DefiPp;
    return [defiPx, defiPp];
}

async function approveSwap() {
    const address = TEST_ACCOUNTS.FAKE_NEWS

    const account = await impersonate(address);

    const [defiPx, defiPp] = getDefiPies(account);
    await defiPx.approve(CONTRACTS.PIES.DEFI_PP, ethers.constants.MaxUint256, {
        maxFeePerGas: 99999999999
    });

    const limit = await defiPx.allowance(address, CONTRACTS.PIES.DEFI_PP);
    console.log({ limit: limit.eq(hre.ethers.constants.MaxUint256) ? 'Max' : limit })

    await printBalances(address, [defiPx, defiPp]);
};

function slippageValue(quote: BigNumber, slippagePercent = 100): BigNumberish {
    const slippageValue = quote.mul(100).div(100 + slippagePercent);
    console.table([{
        quote, slippageValue
    }, {
        quote: ethers.utils.formatEther(quote),
        slippageValue: ethers.utils.formatEther(slippageValue)
    }])
    return slippageValue;
};

async function getQuote(quantity: BigNumber) {
    const address = TEST_ACCOUNTS.FAKE_NEWS;

    const account = await impersonate(address);

    const [_, defiPp] = getDefiPies(account);

    const quote = await defiPp.calcPoolOutGivenSingleIn(TOKENS.PIES[PIE], quantity);

    const [input, output] = [quantity, quote].map(ethers.utils.formatEther)
    console.log(`Quote: trade ${input} ${PIE} for ${output} DEFI++`)
    return quote;
}

async function executeSwap(quantity: BigNumber, quote: BigNumber) {
    const address = TEST_ACCOUNTS.FAKE_NEWS;

    const account = await impersonate(address);

    const [defiPx, defiPp] = getDefiPies(account);

    await printBalances(address, [defiPx, defiPp])

    await defiPp.joinswapExternAmountIn(TOKENS.PIES[PIE], quantity, slippageValue(quote))

    await printBalances(address, [defiPx, defiPp])

};

const printBalances = async (address: string, contracts: DefiPp[]) => {
    const results = await Promise.all(contracts.map(c => c.balanceOf(address)));
    const [balancedefiPx, balanceDefiPP] = results.map(ethers.utils.formatEther)
    console.table([{ balancedefiPx, balanceDefiPP }])
}

export const transferEth = async () => {
    await transfer({
        token: null,
        whale: WHALES.ETH,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 10
    })
};

const main = async () => {
    await transferEth();
    await transfer({
        token: TOKENS.PIES[PIE],
        whale: WHALES[PIE],
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 100
    });

    console.log('transfers complete')
    const quantity = hre.ethers.utils.parseEther(String(100))
    // await enablePool();
    // console.log('Pool Enabled');
    await approveSwap();
    console.log('Swap Approved');

    const quote = await getQuote(quantity);

    await executeSwap(quantity, quote);
    console.log('Swap Completed');
};

main().then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    })