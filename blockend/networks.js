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
    wormholeCore: "0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901",
    wormholeRelayer: "0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0",
    minterAddress: "0x620b89DeE45a3Fb1675182B8AD538B656b3D8366",
    protocol: "0x2E0EFaD15f38667Ed6ebD54868286a6b1ffeae62",
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
    connector: "0x6431B7Ab83b41b564EF95e1429683A73aF906D06",
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
    nftAddress: "0x91330771f441BbC12dBa994e64A9D6F82f9dc56d",
    wormholeRelayer: "0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0",
    crossMintAddress: "0x26D968108207230b69E54b8d2Bb1A437117F3F85",
    connector: "0x8Cb87DB28Ac0Aa41174C12E7d9E735A94e820E4d",
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
    connector: "0x09F1aF4e16728fcF340051055159F0f9D5e00b54",
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
    connector: "0xeC9fF9F59c52F72649EDD99eA2455AdE53eb8f83",
  },
};

module.exports = {
  networks,
};
