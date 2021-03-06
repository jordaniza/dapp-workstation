import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses"
import { transfer } from "../../utils/transfer"

export const transferPlay = async (): Promise<void> => {
    await transfer({
        token: TOKENS.PIES.PLAY,
        whale: WHALES.PLAY,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 1_000
    })
};

if (require.main === module) transferPlay()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });