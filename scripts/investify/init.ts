import { transferBCP } from '../transfers/bcp';
import { transferDefipp } from '../transfers/defi';
import { transferEth } from '../transfers/eth';
import { transferPlay } from '../transfers/play';
import { depositIntoAuxo } from './auxo';

/**
 * An init script for e2e testing with synpress and investify 
 **/

async function main() {
    console.log('------- Beginning transfers -------');
    await transferEth();
    await transferPlay();
    await transferDefipp();
    await transferBCP();
    console.log('------- Setting up Auxo Vaults -------');
    // await depositIntoAuxo();
    console.log('------- Setup Complete -------');
}


main().then(() => process.exit(0))
 .catch((error: unknown) => {
     console.error(error);
     process.exit(1);
})