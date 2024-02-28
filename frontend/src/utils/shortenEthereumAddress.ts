export function shortenEthereumAddress(address: string): string {
  try {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  } catch (er) {
    return "error";
  }
}
