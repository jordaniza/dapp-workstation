
import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses";
import { transfer } from "../../utils/transfer";

export const transferSlice = async () => {
    await transfer({
        token: TOKENS.SLICE,
        whale: WHALES.SLICE,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 10_000
    })
};

if (require.main === module) transferSlice()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });