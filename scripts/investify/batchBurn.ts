import { Erc20__factory } from '../../abi/types/factories/Erc20__factory';
import { TEST_ACCOUNTS, TOKENS } from '../../utils/addresses';
import { getAccountWithFallback } from '../../utils/impersonate';
import { getAuxoContracts } from '../../utils/getAuxoContracts';
import dotenv from 'dotenv';

dotenv.config();

export async function execBatchBurn(LOG_LEVEL: 'info' | 'debug' = 'info') {
    console.log('Executing batch burn from Auxo - note this is currently configured for the FTM network');
    
    const account = await getAccountWithFallback(TEST_ACCOUNTS.FAKE_NEWS);
    
    const { auxo, auxoAuth, auth } = await getAuxoContracts(account);
    
    const usdc = Erc20__factory.connect(TOKENS.FTM_USDC, account);
    console.log(`Balance of USDC is now ${await usdc.balanceOf(account.address)}, Auxo Shares: ${await auxo.balanceOf(account.address)}`)
    
    let tx;
    const auxoShares = await auxo.balanceOf(account.address);
    // @dev you can get a tough-to-debug revert if you request too many tokens here
    tx = await auxo.enterBatchBurn(1000);
    await tx.wait();
    console.log('Entered Batch Burn');

    const lastHarvest = await auxo.lastHarvest();
    const harvestDelay = await auxo.harvestDelay();
    const nextBurn = lastHarvest.add(harvestDelay);

    const currentBlock = await auxo.provider.getBlockNumber();
    const currentBlockTimestamp = (await auxo.provider.getBlock(currentBlock)).timestamp;

    if (LOG_LEVEL === 'debug') {
        console.log(`Current Block: ${currentBlock}, Current Timestamp ${currentBlockTimestamp} Next Burn ${nextBurn}`);
        console.log('Condition', currentBlockTimestamp >= nextBurn.toNumber());
        console.log(await auth.admin(), await auxoAuth.signer.getAddress(), await auxo.burningFeeReceiver())
    }

    const round = await auxo.batchBurnRound();

    if (LOG_LEVEL === 'debug') {
        console.log(`Total Shares: ${(await auxo.batchBurns(round)).totalShares}, Float: ${await auxo.totalFloat()}`);
        console.log(`ER: ${await auxo.exchangeRate()}`);
    }

    tx = await auxoAuth.execBatchBurn();    
    await tx.wait();

    tx = await auxo.exitBatchBurn();
    await tx.wait();

    console.log('Exited Batch Burn');
    console.log(`Balance of USDC is now ${await usdc.balanceOf(account.address)}, Auxo Shares: ${await auxo.balanceOf(account.address)}`)
}

if (require.main === module) execBatchBurn()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });
