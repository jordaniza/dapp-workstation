import { Auxo__factory } from '../abi/types/factories/Auxo__factory';
import { VaultAuth__factory } from '../abi/types/factories/VaultAuth__factory';
import { CONTRACTS } from '../utils/addresses';
import { impersonate } from '../utils/impersonate';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Wallet } from 'ethers';

/**
 * Get Auxo contract and associated Auth contract, connected as the admin
 */
export async function getAuxoContracts (account: SignerWithAddress | Wallet) {
    console.log('Fetching Contracts');
    const auxo = Auxo__factory.connect(CONTRACTS.VAULTS.FTM.AUXO_USDC, account);

    const authAddr = await auxo.auth()   
    let auth = VaultAuth__factory.connect(authAddr, account);  
    
    const adminAddress = await auth.admin();
    const admin = await impersonate(adminAddress);
    
    auth = VaultAuth__factory.connect(CONTRACTS.VAULTS.FTM.AUTH, admin)

    const auxoAuth = Auxo__factory.connect(CONTRACTS.VAULTS.FTM.AUXO_USDC, admin);
    return {
        auxo, auth, auxoAuth
    }
}