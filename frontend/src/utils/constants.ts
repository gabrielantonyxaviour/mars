export const MIDJOURNEY_BASE_URL = "https://api.midjourneyapi.xyz/mj/v2";

export const chains: { [key: string]: string } = {
  "80001": "Polygon Mumbai",
  "1287": "Moonbase Alpha",
  "11155111": "Ethereum Sepolia",
  "84532": "Base Sepolia",
  "421614": "Arbitrum Sepolia",
};

export const explorers: { [key: string]: string } = {
  "80001": "mumbai.polygonscan.com",
  "1287": "moonbase.moonscan.io",
  "11155111": "sepolia.etherscan.io",
  "84532": "sepolia.basescan.org",
  "421614": "sepolia.arbiscan.io",
};

export const venusMoonbaseNftAddress: string =
  "0x620b89DeE45a3Fb1675182B8AD538B656b3D8366";

export const venusCrosschainMintAddresses: { [key: string]: string } = {
  "80001": "0x26D968108207230b69E54b8d2Bb1A437117F3F85",
  "11155111": "0x91330771f441BbC12dBa994e64A9D6F82f9dc56d",
  "84532": "0xC044FCe37927A0Cb55C7e57425Fe3772181228a6",
  "421614": "0xc6b011774FE1393AE254d19456e76F0f1b5B09Eb",
};

export const protocolAddress: string =
  "0x2E0EFaD15f38667Ed6ebD54868286a6b1ffeae62";

export const venusConnectorAddresses: { [key: string]: string } = {
  "80001": "0x8Cb87DB28Ac0Aa41174C12E7d9E735A94e820E4d",
  "11155111": "0x6431B7Ab83b41b564EF95e1429683A73aF906D06",
  "84532": "0x09F1aF4e16728fcF340051055159F0f9D5e00b54",
  "421614": "0xeC9fF9F59c52F72649EDD99eA2455AdE53eb8f83",
};
