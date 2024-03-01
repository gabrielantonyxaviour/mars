import {
  EthCallData,
  EthCallQueryRequest,
  EthCallQueryResponse,
  PerChainQueryRequest,
  QueryProxyMock,
  QueryRequest,
  QueryResponse,
  signaturesToEvmStruct,
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
  // console.log("Latest Block:     ", latestBlock, `(${BigInt(latestBlock)})`);
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
  // console.log("Target Result:    ", targetResult, `(${BigInt(targetResult)})`);
  // form the query request
  const request = new QueryRequest(
    0, // nonce
    [
      new PerChainQueryRequest(
        10002, // Ethereum Wormhole Chain ID
        new EthCallQueryRequest(latestBlock, [callData])
      ),
    ]
  );

  const mock = new QueryProxyMock({ 10002: rpc });
  const mockData = await mock.mock(request);
  console.log("MOCK DATA");
  console.log(mockData);
  const mockQueryResponse = QueryResponse.from(mockData.bytes);
  const mockQueryResult = (
    mockQueryResponse.responses[0].response as EthCallQueryResponse
  ).results[0];
  res.status(200).json({
    request: request,
    result: mockQueryResult,
    struct: signaturesToEvmStruct(mockData.signatures),
    data: mockData,
  });
}
