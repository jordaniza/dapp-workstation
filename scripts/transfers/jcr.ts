import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses"
import { transfer } from "../../utils/transfer"

export const transferJCR = async (): Promise<void> => {
    await transfer({
        token: TOKENS.JCR,
        whale: WHALES.JCR,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 1_000
    })
};

transferJCR()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });