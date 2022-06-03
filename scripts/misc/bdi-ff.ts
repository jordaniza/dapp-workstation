import { ethers } from "hardhat";
import { Basketdao } from '../../abi/types/Basketdao'
import { TOKENS, ABIS, GOVERNANCE, CONTRACTS } from "../../utils/addresses";
import { impersonate } from "../../utils/impersonate";

async function main(): Promise<void> {
    const account = await impersonate(GOVERNANCE.BASKETDAO_MIGRATE);
    const migrator = new ethers.Contract(CONTRACTS.BASKETDAO_MIGRATE, ABIS.BASKETDAO_MIGRATE, account) as Basketdao;
    await migrator.closeEntry();
    console.log('Closed')
}; 

main().then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    })