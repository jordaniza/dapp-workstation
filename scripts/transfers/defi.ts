
import { TEST_ACCOUNTS, TOKENS, WHALES } from "../../utils/addresses";
import { transfer } from "../../utils/transfer";

export const transferDefips = async () => {
    await transfer({
        token: TOKENS.PIES.DEFI_S,
        whale: WHALES.DEFI_S,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 100
    })
};

export const transferDefipl = async () => {
    await transfer({
        token: TOKENS.PIES.DEFI_L,
        whale: WHALES.DEFI_L,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 100
    });
}

const main = async () => {
    await transferDefips();
    await transferDefipl();
}

main()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });