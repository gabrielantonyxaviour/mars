const injectiveEvmTestnet = {
  id: 2424,
  name: "Injective EVM Testnet",
  network: "in-evm-testnet",
  nativeCurrency: { name: "INJ", symbol: "INJ", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://testnet.rpc.inevm.com/http"],
    },
    public: {
      http: ["https://testnet.rpc.inevm.com/http"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Injective EVM Testnet Explorer",
      url: "https://inevm-testnet.explorer.caldera.xyz",
    },
    default: {
      name: "Injective EVM Testnet Explorer",
      url: "https://inevm-testnet.explorer.caldera.xyz",
    },
  },
  testnet: true,
};
const zircuitTestnet = {
  id: 48899,
  name: "Zircuit Testnet",
  network: "zircuit-testnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://zircuit1.p2pify.com"],
    },
    public: {
      http: ["https://zircuit1.p2pify.com"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Zircuit Explorer",
      url: "https://explorer.zircuit.com",
    },
    default: {
      name: "Zircuit Explorer",
      url: "https://explorer.zircuit.com",
    },
  },
  testnet: false,
};
export { injectiveEvmTestnet, zircuitTestnet };
