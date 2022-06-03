import BASKETDAO_MIGRATE from '../abi/basketdao.json';
import ERC_20 from '../abi/erc20.json';

// Change the account in .env to your account or change it here
const MY_ACCOUNT = process.env.TEST_ACCOUNT ?? '0x63BCe354DBA7d6270Cb34dAA46B869892AbB3A79'

/**
 * Accounts with relatively large amounts of tokens.
 * As we are forking, it is possible these addresses will need to be updated
 * from time to time as some whales exit their positions.
 */
export const WHALES = {
    ETH: '0x19184ab45c40c2920b0e0e31413b9434abd243ed',
    WETH: '0x9790e2f55c718a3c3d701542072d7c1d3d2e3f5f',
    WBTC: '0x0a1dc3fcff85eee497e4be7f5e2ee4223733bad8',
    DEFI_PP: '0xed5d4aa57e28689050eb7de9975d79e0b254f4a0',
    DOUGH: '0x90ae1ba6e3d33775b97273902a06560aa6ac4c96',
    DEFI_L: '0x450c0c90706a8cc664e8b496711370b43415715d',
    DEFI_S: '0xc69880ea5086c89972cf1bb08b9bb6ad2bdc9df9',
    SLICE: '0x4281579d99d855f2430c95a13720e53a0fcc0549',
    BCP: '0x7091de9a5435dba7f051045d64c5ef56bd96064e',
    JCR: '0xdebf00c3a56eda60364c7f7f38b80f28e2d8ba5e',
    BDI: '0x5d33d8322ec6e9a789200cc144245a13015e5172',
};

export const TEST_ACCOUNTS = {
    FAKE_NEWS: MY_ACCOUNT
};

export const CONTRACTS = {
    PIES: {
        DEFI_PP: '0x8D1ce361eb68e9E05573443C407D4A3Bed23B033',
        DEFI_L: '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
        DEFI_S: '0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c',
        BCP: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
    },
    STAKING: '0x6Bd0D8c8aD8D3F1f97810d5Cc57E9296db73DC45',
    BASKETDAO_MIGRATE: '0x7940c0225c836742e8953f69e0af0c4b371a35bf',
};

export const ABIS = {
    BASKETDAO_MIGRATE,
    ERC_20,
}

export const TOKENS = {
    DOUGH: '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
    SLICE: '0x1083d743a1e53805a95249fef7310d75029f7cd6',
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    JCR: '0x84f20bf5bb4be345d3ab37c565f732753435dbe3',
    BDI: '0x0309c98b1bffa350bcb3f9fb9780970ca32a5060',
    PIES: CONTRACTS.PIES,
};

export const MULTISIGS = {
    OPS: '0x6458A23B020f489651f2777Bd849ddEd34DfCcd2'
};

export const GOVERNANCE = {
    BASKETDAO_MIGRATE: '0x6458A23B020f489651f2777Bd849ddEd34DfCcd2'
}