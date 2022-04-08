
import { TOKENS, WHALES } from "../utils/addresses";
import { transfer } from "../utils/transfer";

export const transferDough = async () => {
    await transfer({
        token: TOKENS.DOUGH,
        whale: WHALES.DOUGH,
        receiver: process.env.TEST_ACCOUNT ?? '0x63BCe354DBA7d6270Cb34dAA46B869892AbB3A79',
        quantity: 10_000
    })
};

transferDough()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });