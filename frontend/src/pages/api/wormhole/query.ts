import {
  EthCallData,
  EthCallQueryRequest,
  EthCallQueryResponse,
  PerChainQueryRequest,
  QueryProxyMock,
  QueryRequest,
  QueryResponse,
} from "@wormhole-foundation/wormhole-query-sdk";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const rpc = "https://ethereum-sepolia-rpc.publicnode.com";
  const callData: EthCallData = {
    to: "0x9A369955B26f5E9BEcc6339e5661dB675B318B00", // WETH
    data: "0x6352211e0000000000000000000000000000000000000000000000000000000000000000", // web3.eth.abi.encodeFunctionSignature("ownerOf(uint256)")
  };

  const latestBlock: string = (
    await axios.post(rpc, {
      method: "eth_getBlockByNumber",
      params: ["latest", false],
      id: 1,
      jsonrpc: "2.0",
    })
  ).data?.result?.number;
  if (!latestBlock) {
    console.error(`❌ Invalid block returned`);
    return;
  }
  console.log("Latest Block:     ", latestBlock, `(${BigInt(latestBlock)})`);
  const targetResponse = await axios.post(rpc, {
    method: "eth_call",
    params: [callData, latestBlock],
    id: 1,
    jsonrpc: "2.0",
  });
  // console.log(finalizedResponse.data);
  if (targetResponse.data.error) {
    console.error(`❌ ${targetResponse.data.error.message}`);
  }
  const targetResult = targetResponse.data?.result;
  console.log("Target Result:    ", targetResult, `(${BigInt(targetResult)})`);
  // form the query request
  const request = new QueryRequest(
    0, // nonce
    [
      new PerChainQueryRequest(
        2, // Ethereum Wormhole Chain ID
        new EthCallQueryRequest(latestBlock, [callData])
      ),
    ]
  );

  console.log(JSON.stringify(request, undefined, 2));

  res.status(200).json({ request: request });
}
