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
    // verifyApiKey: process.env.SCROLL_API_KEY || "UNSET",
    chainId: 1287,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
  },
  ethereumSepolia:{
    url: "https://ethereum-sepolia-rpc.publicnode.com",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    // verifyApiKey: process.env.SCROLL_API_KEY || "UNSET",
    chainId: 11155111,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
  },
  polygonMumbai: {
    url: "https://rpc-mumbai.maticvigil.com",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    // verifyApiKey: process.env.SCROLL_API_KEY || "UNSET",
    chainId: 80001,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "MATIC",
  },
  // injectiveTestnet:{
    
  // },
  // ziruitTestnet:{

  // },
  // lineaTestnet:{
    
  // },
  baseSepolia:{
    url: "https://base-sepolia-rpc.publicnode.com",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    // verifyApiKey: process.env.SCROLL_API_KEY || "UNSET",
    chainId: 84532,
    confirmations: DEFAULT_VERIFICATION_sBLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
  },
  arbitrumSepolia:{
    url: "https://sepolia-rollup.arbitrum.io/rpc",
    gasPrice: undefined,
    nonce: undefined,
    accounts,
    // verifyApiKey: process.env.SCROLL_API_KEY || "UNSET",
    chainId: 421614,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
  }
};

module.exports = {
  networks,
};
