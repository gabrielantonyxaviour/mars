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
  },
  // injectiveTestnet:{

  // },
  // ziruitTestnet:{

  // },
  // lineaTestnet:{

  // },
  // baseSepolia: {
  //   url: "https://base-sepolia-rpc.publicnode.com",
  //   gasPrice: undefined,
  //   nonce: undefined,
  //   accounts,
  //   // verifyApiKey: process.env.SCROLL_API_KEY || "UNSET",
  //   chainId: 84532,
  //   confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
  //   nativeCurrencySymbol: "ETH",
  // },
  // arbitrumSepolia: {
  //   url: "https://sepolia-rollup.arbitrum.io/rpc",
  //   gasPrice: undefined,
  //   nonce: undefined,
  //   accounts,
  //   // verifyApiKey: process.env.SCROLL_API_KEY || "UNSET",
  //   chainId: 421614,
  //   confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
  //   nativeCurrencySymbol: "ETH",
  // },
};

module.exports = {
  networks,
};
