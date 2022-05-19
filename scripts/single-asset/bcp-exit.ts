import * as hre from "hardhat";
import { CONTRACTS, MULTISIGS, TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses";
import BCP from '../../abi/defi-pp.json'
import SMARTPOOLJSONABI from '../../abi/smart-pool.json';
import ERC20ABI from '../../abi/erc20.json';
import { SmartPool } from '../../abi/types/SmartPool'
import { BigNumber, BigNumberish } from "ethers";
import { impersonate } from "../../utils/impersonate";
import { ethers } from "hardhat";
import { transfer } from "../../utils/transfer";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Standard_Token } from "../../typechain";

const isExitEnabled = async (contract?: SmartPool): Promise<boolean> => {
    const multisig = await impersonate(MULTISIGS.OPS);
    const bcp = new hre.ethers.Contract(CONTRACTS.PIES[PIE], BCP, multisig) as BCP;
    const exitEnabled = await bcp.getJoinExitEnabled();
    return exitEnabled
}

type Pie = keyof typeof TOKENS['PIES'];
type Token = keyof typeof TOKENS;

type BCP = SmartPool
const PIE: Pie = 'BCP'
const TOKEN: Token = 'WETH'

/**
 * Ensure the BCP pool is enabled for exits 
 */
async function enablePool() {
    const multisig = await impersonate(MULTISIGS.OPS);
    const bcp = new hre.ethers.Contract(CONTRACTS.PIES[PIE], BCP, multisig) as BCP;
    await isExitEnabled();
    await bcp.setJoinExitEnabled(true)
    await isExitEnabled();
};

const getTokens = (account: SignerWithAddress,): [token: Standard_Token, bcp: BCP] => {
    // wbtc
    const token = new hre.ethers.Contract(TOKENS[TOKEN], ERC20ABI, account) as Standard_Token;

    // BCP
    const bcp = new hre.ethers.Contract(TOKENS.PIES[PIE], SMARTPOOLJSONABI, account) as BCP;
    return [token, bcp];
}

async function approveSwap() {
    const address = TEST_ACCOUNTS.FAKE_NEWS

    const account = await impersonate(address);

    const [token, bcp] = getTokens(account);
    await token.approve(CONTRACTS.PIES.BCP, ethers.constants.MaxUint256, {
        maxFeePerGas: 99999999999
    });

    const limit = await token.allowance(address, CONTRACTS.PIES.BCP);
    console.log({ limit: limit.eq(hre.ethers.constants.MaxUint256) ? 'Max' : limit })

    await printBalances(address, [token, bcp]);
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

async function getQuote(quantity: BigNumber, entry = true) {
    const token = TOKENS[TOKEN];

    if (typeof token !== 'string') return;

    const address = TEST_ACCOUNTS.FAKE_NEWS;

    const account = await impersonate(address);

    const [_, bcp] = getTokens(account);

    const quote = entry
        ? await bcp.calcPoolOutGivenSingleIn(TOKENS.PIES[PIE], quantity)
        : await bcp.calcSingleOutGivenPoolIn(token, quantity);

    const [input, output] = [quantity, quote].map(ethers.utils.formatEther)
    console.log(`Quote: trade ${input} ${entry ? TOKEN : PIE} for ${output} ${entry ? PIE : TOKEN}`)
    return quote;
}

async function executeSwap(quantity: BigNumber, quote: BigNumber, entry = true) {
    const token = TOKENS[TOKEN];

    if (typeof token !== 'string') return;

    const address = TEST_ACCOUNTS.FAKE_NEWS;

    const account = await impersonate(address);

    const [tokenContract, bcp] = getTokens(account);

    await printBalances(address, [tokenContract, bcp]);

    entry
        ? await bcp.joinswapExternAmountIn(TOKENS.PIES[PIE], quantity, slippageValue(quote))
        : await bcp.exitswapPoolAmountIn(token, quantity, 0);

    await printBalances(address, [tokenContract, bcp]);

};

const printBalances = async (address: string, contracts: (BCP | Standard_Token)[]) => {
    const results = await Promise.all(contracts.map(c => c.balanceOf(address)));
    const [balanceA, balanceB] = results.map(ethers.utils.formatEther)
    console.table([{ TOKEN: balanceA, POOL: balanceB }])
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
    const enabled = await isExitEnabled();
    console.log({ enabled });
    await transfer({
        token: TOKENS.PIES[PIE],
        whale: WHALES[PIE],
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 100
    });

    console.log('transfers complete')
    const quantity = hre.ethers.utils.parseEther(String(10))


    await enablePool();


    console.log('Pool Enabled');
    await approveSwap();
    console.log('Swap Approved');

    const quote = await getQuote(quantity, false);

    if (!quote) throw Error('No Quote :(')
    console.debug({ quote })

    await executeSwap(quantity, quote, false);
    console.log('Swap Completed');
};

main().then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    })