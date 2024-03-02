require("@chainlink/env-enc").config();

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 5;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const SECOND_PRIVATE_KEY = process.env.SECOND_PRIVATE_KEY;

const accounts = [];
if (PRIVATE_KEY) {
  accounts.push(PRIVATE_KEY);
}
if (SECOND_PRIVATE_KEY) {
  accounts.push(SECOND_PRIVATE_KEY);
}

const networks = {
  moonbaseAlpha: {
    url: "https://rpc.api.moonbase.moonbeam.network",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.MOONBASE_API_KEY || "UNSET",
    chainId: 1287,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    wormholeChainId: "16",
    wormholeCore: "0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901",
    wormholeRelayer: "0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0",
    protocol: "0xFD6a2699FFd3293c646498388077B66b2e459130",
  },
  ethereumSepolia: {
    url: "https://ethereum-sepolia-rpc.publicnode.com",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.ETHEREUM_API_KEY || "UNSET",
    chainId: 11155111,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    wormholeChainId: "10002",
    wormholeRelayer: "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470",
    connector: "0x178F1a1d6C37824B8CB5AcF0FF54D1cbf3D1317A",
  },
  polygonMumbai: {
    url: "https://polygon-mumbai-pokt.nodies.app",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.POLYGON_API_KEY || "UNSET",
    chainId: 80001,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "MATIC",
    wormholeChainId: "5",
    wormholeCoreBridge: "0x0CBE91CF822c73C2315FB05100C2F714765d5c20",
    testing: "0x615270a5CBA6C1e34D7F8BCB5D26a5BC9285fA20",
    connector: "0xA3539Ae35C914950717FCf993716CbC980d8bc72",
  },
  baseSepolia: {
    url: "https://base-sepolia-rpc.publicnode.com",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.BASE_API_KEY || "UNSET",
    chainId: 84532,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    connector: "0x16CBC6Cb38D19B73A3b545109c70b2031d20EA37",
  },
  arbitrumSepolia: {
    url: "https://sepolia-rollup.arbitrum.io/rpc",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.ARB_API_KEY || "UNSET",
    chainId: 421614,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    connector: "0x16CBC6Cb38D19B73A3b545109c70b2031d20EA37",
  },
};

module.exports = {
  networks,
};
