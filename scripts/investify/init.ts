import { executeBashScript } from '../../utils/executeBash'

/**
 * An init script for e2e testing with synpress and investify 
 **/

async function main() {
    console.log('------- Beginning transfers -------');
    await executeBashScript('yarn transfer eth defi play bcp');
    console.log('------- Setting up Auxo Vaults -------');
    await setupAuxo();
    console.log('------- Setup Complete -------');
}

async function setupAuxo() {
    // sets up an auxo vault deposit
}

main().then(() => process.exit(0))
 .catch((error: unknown) => {
     console.error(error);
     process.exit(1);
})