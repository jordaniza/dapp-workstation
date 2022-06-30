import { ethers, network } from "hardhat";
import pingpongabi from '../../abi/pingpong.json';
import ilzroabi from '../../abi/iLayerZeroEndpoint.json';
import { Pingpong, ILayerZeroEndpoint } from '../../abi/types'
import { CONTRACTS } from "../../utils/addresses";

const AVAX_FUJI = {
    chainId: 43113,
    lZeroChainId: 10006
};
const FTM_TESTNET = {
    chainId: 4002,
    lZeroChainId: 10012,
}

const pk = process.env.PRIVATE_KEY;
if (!pk) throw new Error('Missing Private Key');

async function ftmTest() {

    const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network');
    const wallet = new ethers.Wallet(pk!, provider);
    const pingPong = new ethers.Contract(CONTRACTS.PINGPONG.FTM_TESTNET, pingpongabi, wallet) as Pingpong;
    // set some eth
    // await wallet.sendTransaction({
    //     to: pingPong.address,
    //     value: ethers.utils.parseEther("2"),
    // })
    const balance = await provider.getBalance(pingPong.address);
    // await pingPong.setTrustedRemote(AVAX_FUJI.lZeroChainId, CONTRACTS.PINGPONG.AVAX_FUJI);
    const remote = await pingPong.trustedRemoteLookup(AVAX_FUJI.lZeroChainId);
    const iLayerZeroEndpoint = new ethers.Contract(CONTRACTS.LAYER_ZERO_EP.FANTOM_TESTNET, ilzroabi, wallet) as ILayerZeroEndpoint;
    const fee = await iLayerZeroEndpoint.estimateFees(AVAX_FUJI.lZeroChainId, pingPong.address, "0x", false, "0x");
    console.log({balance, remote, fee})
    const tx = await pingPong.ping(AVAX_FUJI.lZeroChainId, CONTRACTS.PINGPONG.AVAX_FUJI, 0,);
    await tx.wait();
    console.log({ tx });
}

async function fuji() {
    const provider = new ethers.providers.JsonRpcProvider("https://api.avax-test.network/ext/C/rpc");
    const wallet = new ethers.Wallet(pk!, provider);
    const pingPong = new ethers.Contract(CONTRACTS.PINGPONG.AVAX_FUJI, pingpongabi, wallet) as Pingpong;
    // set some eth
    // await wallet.sendTransaction({
    //     to: pingPong.address,
    //     value: ethers.utils.parseEther("0.1"),
    // })
    const balance = await provider.getBalance(pingPong.address);
    // await pingPong.setTrustedRemote(FTM_TESTNET.lZeroChainId, CONTRACTS.PINGPONG.FTM_TESTNET);
    const remote = await pingPong.trustedRemoteLookup(FTM_TESTNET.lZeroChainId);

    const iLayerZeroEndpoint = new ethers.Contract(CONTRACTS.LAYER_ZERO_EP.FUJI, ilzroabi, provider) as ILayerZeroEndpoint;
    const fee = await iLayerZeroEndpoint.estimateFees(FTM_TESTNET.lZeroChainId, pingPong.address, "0x", false, "0x");
    console.log({ balance, remote, fee });

    const tx = await pingPong.ping(FTM_TESTNET.lZeroChainId, CONTRACTS.PINGPONG.FTM_TESTNET, 0,);
    await tx.wait();
    console.log(tx.blockHash);
}

async function main() {
    const { name } = network;
    console.log("Executing for network", name);
    switch (name) {
        case 'ftmTest': {
            await ftmTest();
            break;
        };
        case 'fuji': {
            await fuji();
            break;
        }
        default: {
            throw new Error('Unrecognised Network')
        }
    }
}

main().then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(error);
        process.exit(1);
    })