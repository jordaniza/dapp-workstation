
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
    BCP: '0x7091de9a5435dba7f051045d64c5ef56bd96064e'
};

export const TEST_ACCOUNTS = {
    FAKE_NEWS: '0x63BCe354DBA7d6270Cb34dAA46B869892AbB3A79'
};

export const CONTRACTS = {
    PIES: {
        DEFI_PP: '0x8D1ce361eb68e9E05573443C407D4A3Bed23B033',
        DEFI_L: '0x78f225869c08d478c34e5f645d07a87d3fe8eb78',
        DEFI_S: '0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c',
        BCP: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
    },
    STAKING: '0x6Bd0D8c8aD8D3F1f97810d5Cc57E9296db73DC45'
};

export const TOKENS = {
    DOUGH: '0xad32A8e6220741182940c5aBF610bDE99E737b2D',
    SLICE: '0x1083d743a1e53805a95249fef7310d75029f7cd6',
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    PIES: CONTRACTS.PIES,
};

export const MULTISIGS = {
    OPS: '0x6458A23B020f489651f2777Bd849ddEd34DfCcd2'
};