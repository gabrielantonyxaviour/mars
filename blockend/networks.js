require("@chainlink/env-enc").config();

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 3;

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
    wormholeCoreBridge: "0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901",
    testing: "0x4ab8f50796b059aE5C8b8534afC6bb4c84912ff6",
    protocol: "0x50751BD8d7b0a84c422DE96A56426a370F31a42D",
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
    wormholeCoreBridge: "0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901",
    connector: "0xe0fBC90eD998B8A2dc5C0CcbF660721d99d7ba0d",
  },
  polygonMumbai: {
    url: "https://polygon-mumbai-pokt.nodies.app",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.POLYGON_API_KEY || "UNSET",
    chainId: 80001,
    confirmations: 5,
    nativeCurrencySymbol: "MATIC",
    wormholeChainId: "5",
    wormholeCoreBridge: "0x0CBE91CF822c73C2315FB05100C2F714765d5c20",
    testing: "0x615270a5CBA6C1e34D7F8BCB5D26a5BC9285fA20",
    connector: "0xA3539Ae35C914950717FCf993716CbC980d8bc72",
  },
  injectiveEvmTestnet: {
    url: "https://testnet.rpc.inevm.com/http",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    // verifyApiKey: process.env.POLYGON_API_KEY || "UNSET",
    chainId: 2424,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "INJ",
    wormholeChainId: "",
    wormholeCoreBridge: "",
    testing: "",
    connector: "0x16CBC6Cb38D19B73A3b545109c70b2031d20EA37",
  },
  zircuitTestnet: {
    url: "https://zircuit1.p2pify.com/",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.ZIRCUIT_API_KEY || "UNSET",
    chainId: 48899,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    wormholeChainId: "",
    wormholeCoreBridge: "",
    testing: "",
    connector: "0x16CBC6Cb38D19B73A3b545109c70b2031d20EA37",
  },
  lineaTestnet: {
    url: "https://linea-goerli.public.blastapi.io",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    verifyApiKey: process.env.LINEA_API_KEY || "UNSET",
    chainId: 59140,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    wormholeChainId: "",
    wormholeCoreBridge: "",
    testing: "",
    connector: "0x16CBC6Cb38D19B73A3b545109c70b2031d20EA37",
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
