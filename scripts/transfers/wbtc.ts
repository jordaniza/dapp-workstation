import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses"
import { transfer } from "../../utils/transfer"

export const transferWbtc = async (): Promise<void> => {
    await transfer({
        token: TOKENS.WBTC,
        whale: WHALES.WBTC,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 1
    })
};

if (require.main === module) transferWbtc()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });