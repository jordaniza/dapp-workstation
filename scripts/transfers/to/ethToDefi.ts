
import { WHALES } from "../../../utils/addresses";
import { transfer } from "../../../utils/transfer";

export const transferEth = async () => {
    await transfer({
        token: null,
        whale: WHALES.ETH,
        receiver: WHALES.DEFI_PP,
        quantity: 10
    })
};

transferEth()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });

