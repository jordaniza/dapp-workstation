import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses"
import { transfer } from "../../utils/transfer"

export const transferWeth = async (): Promise<void> => {
    await transfer({
        token: TOKENS.WETH,
        whale: WHALES.WETH,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 10
    })
};

if (require.main === module) transferWeth()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });