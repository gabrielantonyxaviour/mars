export const MIDJOURNEY_BASE_URL = "https://api.midjourneyapi.xyz/mj/v2";

export const chains: { [key: string]: string } = {
  "80001": "Polygon Mumbai",
  "1287": "Moonbase Alpha",
  "11155111": "Ethereum Sepolia",
  "2424": "Injetive EVM Testnet",
  "48899": "Zircuit Testnet",
  "59140": "Linea Goerli",
  "84532": "Base Sepolia",
  "421614": "Arbitrum Sepolia",
};

export const explorers: { [key: string]: string } = {
  "80001": "mumbai.polygonscan.com",
  "1287": "moonbase.moonscan.io",
  "11155111": "sepolia.etherscan.io",
  "2424": "testnet.explorer.inevm.com",
  "48899": "explorer.zircuit.com",
  "59140": "goerli.lineascan.build",
  "84532": "sepolia.basescan.org",
  "421614": "sepolia.arbiscan.io",
};
