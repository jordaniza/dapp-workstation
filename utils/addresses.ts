import BASKETDAO_MIGRATE from '../abi/basketdao.json';
import ERC_20 from '../abi/erc20.json';

// Change the account in .env to your account or change it here
// const MY_ACCOUNT = '0x72D37081E51f6AF28F3c38108397ca20cDca03Bb' 
const MY_ACCOUNT = process.env.TEST_ACCOUNT ?? '0x72D37081E51f6AF28F3c38108397ca20cDca03Bb'

/**
 * Accounts with relatively large amounts of tokens.
 * As we are forking, it is possible these addresses will need to be updated
 * from time to time as some whales exit their positions.
 */
export const WHALES = {
    ETH: '0x19184ab45c40c2920b0e0e31413b9434abd243ed',
    WETH: '0x9790e2f55c718a3c3d701542072d7c1d3d2e3f5f',
    WBTC: '0x0a1dc3fcff85eee497e4be7f5e2ee4223733bad8',

    DEFI_PP: '0x19dd92c9a9c4eb6f0426846c4f8a071a7b79209a',
    DOUGH: '0x90ae1ba6e3d33775b97273902a06560aa6ac4c96',
    DEFI_L: '0x450c0c90706a8cc664e8b496711370b43415715d',

    DEFI_S: '0xc69880ea5086c89972cf1bb08b9bb6ad2bdc9df9',
    SLICE: '0x4281579d99d855f2430c95a13720e53a0fcc0549',
    BCP: '0x7091de9a5435dba7f051045d64c5ef56bd96064e',

    BDI: '0x5d33d8322ec6e9a789200cc144245a13015e5172',
    LOOKS: '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b',
    PLAY: '0xa30c7b2e676be6b0c26d631c8161b62ebebc3cd2',

    FTM_USDC: '0x5d13f4bf21db713e17e04d711e0bf7eaf18540d6',
    FTM: '0x19dd92c9a9c4eb6f0426846c4f8a071a7b79209a'
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
        PLAY: '0x33e18a092a93ff21ad04746c7da12e35d34dc7c4'
    },
    VAULTS: {
        FTM: {
            AUXO_USDC: '0x662556422AD3493fCAAc47767E8212f8C4E24513',
            AUTH: '0xa86fc7ad871b5247f13bb38a08a67be4d38e577b',
        },
    },
    
    STAKING: '0x6Bd0D8c8aD8D3F1f97810d5Cc57E9296db73DC45',
    BASKETDAO_MIGRATE: '0x7940c0225c836742e8953f69e0af0c4b371a35bf',
    PINGPONG: {
        FTM_TESTNET: '0xcb162b56427b0bff26a9b490781fdd2de03e283c',
        MUMBAI: '0xb3b3b80828b4f30ddb338d768d19191e918d730c',
        AVAX_FUJI: '0x3809176cfeef251acaffd2bcb190ca56aefc5896',
    },
    LAYER_ZERO_EP: {
        ETHEREUM: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
        BSC: "0x3c2269811836af69497E5F486A85D7316753cf62",
        AVALANCHE: "0x3c2269811836af69497E5F486A85D7316753cf62",
        POLYGON: "0x3c2269811836af69497E5F486A85D7316753cf62",
        ARBITRUM: "0x3c2269811836af69497E5F486A85D7316753cf62",
        OPTIMISM: "0x3c2269811836af69497E5F486A85D7316753cf62",
        FANTOM: "0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7",
        RINKEBY: "0x79a63d6d8BBD5c6dfc774dA79bCcD948EAcb53FA",
        BSC_TESTNET: "0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1",
        FUJI: "0x93f54D755A063cE7bB9e6Ac47Eccc8e33411d706",
        MUMBAI: "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
        ARBITRUM_RINKEBY: "0x4D747149A57923Beb89f22E6B7B97f7D8c087A00",
        OPTIMISM_KOVAN: "0x72aB53a133b27Fa428ca7Dc263080807AfEc91b5",
        FANTOM_TESTNET: "0x7dcAD72640F835B0FA36EFD3D6d3ec902C7E5acf"
    }
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
    BDI: '0x0309c98b1bffa350bcb3f9fb9780970ca32a5060',
    PIES: CONTRACTS.PIES,
    LOOKS: '0xf4d2888d29d722226fafa5d9b24f9164c092421e',
    FTM_USDC: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    FTM: '0x57900b3dc6206994d3b2d593db8f6c6bfdbb61a9'
};

export const MULTISIGS = {
    OPS: '0x6458A23B020f489651f2777Bd849ddEd34DfCcd2',
    AUXO_FTM_ADMIN: '0x309dcdbe77d9d73805e96662503b08fee229597a'
};

export const GOVERNANCE = {
    BASKETDAO_MIGRATE: '0x6458A23B020f489651f2777Bd849ddEd34DfCcd2',
    // gnosis
    AUXO_FTM_ADMIN: MULTISIGS.AUXO_FTM_ADMIN
}