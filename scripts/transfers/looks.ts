import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses"
import { transfer } from "../../utils/transfer"

const transferlooks = async (): Promise<void> => {
    await transfer({
        token: TOKENS.LOOKS,
        whale: WHALES.LOOKS,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 1000
    })
};

transferlooks()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });