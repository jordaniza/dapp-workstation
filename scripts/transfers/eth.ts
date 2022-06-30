
import { TEST_ACCOUNTS, WHALES } from "../../utils/addresses";
import { transfer } from "../../utils/transfer";

export const transferEth = async () => {
    await transfer({
        token: null,
        whale: WHALES.ETH,
        receiver: TEST_ACCOUNTS.FAKE_NEWS,
        quantity: 10
    })
};

if (require.main === module) transferEth()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    });

