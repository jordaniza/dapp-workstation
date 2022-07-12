
import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses";
import { transfer } from "../../utils/transfer";

export const transferFtm = async () => {
    console.warn('CURRENTLY SETUP FOR FTM');
    await transfer({
        token: null,
        whale: WHALES.FTM,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 100
    })
};

if (require.main === module) transferFtm()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });

