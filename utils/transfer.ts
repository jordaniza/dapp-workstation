
// this enables ethers on the hre
import "@nomiclabs/hardhat-waffle";

import ERC20 from '../abi/erc20.json'
import * as hre from 'hardhat'
import { impersonate } from './impersonate'
import { BigNumberish } from "ethers";
import { Standard_Token } from "../typechain";

export const transfer = async (params: {
    token: null | string // null is eth,
    whale: string,
    receiver: string,
    quantity: number
}) => {
    let [whaleBalancePost, accountBalancePost, decimals] = [] as BigNumberish[];

    await impersonate(params.whale);

    const whale = await hre.ethers.getSigner(params.whale);
    const testAccount = await hre.ethers.getSigner(params.receiver)

    let [whaleBalancePre, accountBalancePre] = await Promise.all([
        whale.getBalance(),
        testAccount.getBalance()
    ]);

    if (!params.token) {
        await whale.sendTransaction({
            to: testAccount.address,
            value: hre.ethers.utils.parseEther(params.quantity.toString()),
            maxFeePerGas: 92198409185,
        });

        whaleBalancePost = await whale.getBalance();
        accountBalancePost = await testAccount.getBalance();

    } else {
        const token = new hre.ethers.Contract(params.token, ERC20, whale) as Standard_Token;

        [whaleBalancePre, accountBalancePre, decimals] = await Promise.all([
            token.balanceOf(params.whale),
            token.balanceOf(params.receiver),
            token.decimals()
        ]);

        await token.transfer(
            params.receiver,
            hre.ethers.utils.parseUnits(params.quantity.toString(), decimals),
            {
                maxFeePerGas: 92198409185
            }
        );

        whaleBalancePost = await token.balanceOf(params.whale)
        accountBalancePost = await token.balanceOf(params.receiver)
    }

    console.table([
        { when: 'pre', whale: whaleBalancePre, account: accountBalancePre },
        { when: 'post', whale: whaleBalancePost, account: accountBalancePost }
    ]);
}