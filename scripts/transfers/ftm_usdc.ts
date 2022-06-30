import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses"
import { transfer } from "../../utils/transfer"

const transferlooks = async (): Promise<void> => {
    console.warn('CURRENTLY SETUP FOR FTM');
    await transfer({
        token: TOKENS.FTM_USDC,
        whale: WHALES.FTM_USDC,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 10_000
    })
};

if (require.main === module) transferlooks()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });