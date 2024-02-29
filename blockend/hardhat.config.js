require("@nomicfoundation/hardhat-toolbox");
require("hardhat-dependency-compiler");
require("hardhat-contract-sizer");
require("./tasks");
const { networks } = require("./networks");

const REPORT_GAS =
  process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false;

const SOLC_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
};
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: SOLC_SETTINGS,
      },
    ],
  },

  networks: {
    ...networks,
  },
  etherscan: {
    apiKey: {
      sepolia: networks.ethereumSepolia.verifyApiKey,
      moonbaseAlpha: networks.moonbaseAlpha.verifyApiKey,
      polygonMumbai: networks.polygonMumbai.verifyApiKey,
      arbitrumSepolia: networks.arbitrumSepolia.verifyApiKey,
      baseSepolia: networks.baseSepolia.verifyApiKey,
      lineaTestnet: networks.lineaTestnet.verifyApiKey,
      zircuitTestnet: networks.zircuitTestnet.verifyApiKey,
      injectiveEvmTestnet: networks.injectiveEvmTestnet.verifyApiKey,
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: networks.arbitrumSepolia.chainId,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
      {
        network: "baseSepolia",
        chainId: networks.baseSepolia.chainId,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org/",
        },
      },
      {
        network: "lineaTestnet",
        chainId: networks.lineaTestnet.chainId,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build/",
        },
      },
      {
        network: "zircuitTestnet",
        chainId: networks.zircuitTestnet.chainId,
        urls: {
          apiURL: "",
          browserURL: "https://explorer.zircuit.com/",
        },
      },
      {
        network: "injectiveEvmTestnet",
        chainId: networks.injectiveEvmTestnet.chainId,
        urls: {
          apiURL: "",
          browserURL: "https://testnet.explorer.inevm.com/",
        },
      },
    ],
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  mocha: {
    timeout: 200000,
  },
};
