
// this enables ethers on the hre
import "@nomiclabs/hardhat-waffle";

import ERC20 from '../abi/erc20.json'
import { Token } from "../typechain/Token";
import * as hre from 'hardhat'
import { impersonate } from './impersonate'

export const transfer = async (params: {
    token: null | string // null is eth,
    whale: string,
    receiver: string,
    quantity: number
}) => {
    await impersonate(params.whale);

    const whale = await hre.ethers.getSigner(params.whale);
    const testAccount = await hre.ethers.getSigner(params.receiver)

    let [whaleBalance, taBalance] = await Promise.all([
        whale.getBalance(),
        testAccount.getBalance()
    ]);

    console.log({ whaleBalance, taBalance });

    if (!params.token) {
        await whale.sendTransaction({
            to: testAccount.address,
            value: hre.ethers.utils.parseEther(params.quantity.toString()),
            maxFeePerGas: 92198409185,
        }

        );

        [whaleBalance, taBalance] = await Promise.all([
            whale.getBalance(),
            testAccount.getBalance()
        ]);

    } else {
        const token = new hre.ethers.Contract(params.token, ERC20, whale) as Token;

        await token.transfer(
            params.receiver,
            hre.ethers.utils.parseEther(params.quantity.toString()),
            {
                from: whale.address,
                maxFeePerGas: 92198409185
            }
        );

        [whaleBalance, taBalance] = await Promise.all([
            token.balanceOf(params.whale),
            token.balanceOf(params.receiver)
        ]);
    }
    console.log({ whaleBalance, taBalance })
}