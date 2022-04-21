
import { WHALES } from "../../utils/addresses";
import { transfer } from "../../utils/transfer";

export const transferEth = async () => {
    await transfer({
        token: null,
        whale: WHALES.ETH,
        receiver: process.env.TEST_ACCOUNT ?? '0x63BCe354DBA7d6270Cb34dAA46B869892AbB3A79',
        quantity: 10
    })
};

transferEth()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });

