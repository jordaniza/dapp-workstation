import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses"
import { transfer } from "../../utils/transfer"

const transferBCP = async (): Promise<void> => {
    await transfer({
        token: TOKENS.PIES.BCP,
        whale: WHALES.BCP,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 1_000
    })
};

transferBCP()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });