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
    nftAddress: "0x17517f552d14e3ae1b2a8005f594d7916ce6466d",
    wormholeRelayer: "0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0",
    minterAddress: "0x620b89DeE45a3Fb1675182B8AD538B656b3D8366",
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
    nftAddress: "0x91330771f441BbC12dBa994e64A9D6F82f9dc56d",
    wormholeRelayer: "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470",
    crossMintAddress: "0x91330771f441BbC12dBa994e64A9D6F82f9dc56d",
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
    nftAddress: "0x91330771f441BbC12dBa994e64A9D6F82f9dc56d",
    wormholeRelayer: "0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0",
    crossMintAddress: "0x26D968108207230b69E54b8d2Bb1A437117F3F85",
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
    nftAddress: "0xc6b011774FE1393AE254d19456e76F0f1b5B09Eb",
    wormholeRelayer: "0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE",
    crossMintAddress: "0xC044FCe37927A0Cb55C7e57425Fe3772181228a6",
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
    nftAddress: "0x108A91edD1329e17409A86b54D4204A102534ec3",
    wormholeRelayer: "0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470",
    crossMintAddress: "0xc6b011774FE1393AE254d19456e76F0f1b5B09Eb",
    connector: "",
  },
};

module.exports = {
  networks,
};
