import {
  arbitrumGoerli,
  arbitrumSepolia,
  baseSepolia,
  moonbaseAlpha,
  polygonMumbai,
  sepolia,
} from "viem/chains";

function resolveChain(chainId: string) {
  if (chainId == "1287") return moonbaseAlpha;
  else if (chainId == "80001") return polygonMumbai;
  else if (chainId == "11155111") return sepolia;
  else if (chainId == "84532") return baseSepolia;
  else return arbitrumSepolia;
}

export default resolveChain;
