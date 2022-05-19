import { ethers } from "hardhat";
import { TEST_ACCOUNTS, TOKENS } from "../../utils/addresses";
import { impersonate } from "../../utils/impersonate";
import { transferEth } from "../single-asset/bcp-exit";
import { transferJCR } from "../transfers/jcr";
import JCRABI from '../../abi/jcr.json'
import { Jcr } from '../../abi/types/Jcr'
import { BigNumber } from "ethers";

const burn = async () => {
    const account = await impersonate(TEST_ACCOUNTS.FAKE_NEWS);
    const jcr = new ethers.Contract(TOKENS.JCR, JCRABI, account) as Jcr;


    const balMePre = await jcr.balanceOf(account.address);
    const balBurnPre = await jcr.balanceOf(ethers.constants.AddressZero)
    console.debug({ balMePre, balBurnPre })


    await jcr.burn(BigNumber.from(10).pow(21))

    const balMe = await jcr.balanceOf(account.address);
    const balBurn = await jcr.balanceOf(ethers.constants.AddressZero)
    console.debug({ balMe, balBurn })
}

const main = async () => {
    await transferEth();
    await transferJCR();
    await burn();

}

main().then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    })