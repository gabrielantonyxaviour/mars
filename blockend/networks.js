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
    wormholeRelayer: "0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0",
    minterAddress: "0xBbF4E51Cfa0f681a4eBBC5E800b4f53507B00A5B",
    protocol: "",
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
    crossMintAddress: "",
    connector: "",
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
    wormholeRelayer: "0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0",
    crossMintAddress: "",
    connector: "",
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
    wormholeChainId: "10004",
    wormholeRelayer: "0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE",
    crossMintAddress: "",
    connector: "",
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
    wormholeChainId: "10003",
    wormholeRelayer: "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470",
    crossMintAddress: "0xc6b011774FE1393AE254d19456e76F0f1b5B09Eb",
    connector: "",
  },
};

module.exports = {
  networks,
};
