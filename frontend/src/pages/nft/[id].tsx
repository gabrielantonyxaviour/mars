import Layout from "@/components/Layout";
import NFTCard from "@/components/NFTCard";
import LoadingSpinner from "@/components/Spinner";
import Confetti from "react-confetti";

import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { WalletClient, decodeEventLog } from "viem";
import { useAccount } from "wagmi";
import useWindowSize from "@/hooks/useWindowSize";
import { explorers } from "@/utils/constants";
import { shortenEthereumAddress } from "@/utils";

export default function Nft() {
  const router = useRouter();
  const { address } = useAccount();
  const { id } = router.query;
  const { width, height } = useWindowSize();
  const [txHash, setTxHash] = useState("");
  const [pairBred, setPairBred] = useState("");
  const [tokenAddress, setTokenAddress] = useState(
    "0xd04b45920bcf51518338f783bdc1544844775f21"
  );
  const [tokenId, setTokenId] = useState("1");
  const [chainId, setChainId] = useState("1287");
  const [price, setPrice] = useState(0);

  // const { writeAsync: testWormhole } = useContractWrite({
  //   address: "0xC044FCe37927A0Cb55C7e57425Fe3772181228a6",
  //   abi: [
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "_wormhole",
  //           type: "address",
  //         },
  //       ],
  //       stateMutability: "nonpayable",
  //       type: "constructor",
  //     },
  //     {
  //       inputs: [],
  //       name: "ChainIdMismatch",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "EmptyWormholeAddress",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "InvalidChainId",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "InvalidContractAddress",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "InvalidFunctionSignature",
  //       type: "error",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "received",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "expected",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "InvalidPayloadLength",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "InvalidResponseVersion",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "NumberOfResponsesMismatch",
  //       type: "error",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "offset",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "length",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "OutOfBounds",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "RequestTypeMismatch",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "StaleBlockNum",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "StaleBlockTime",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "UnexpectedNumberOfResults",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "UnsupportedQueryType",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "VersionMismatch",
  //       type: "error",
  //     },
  //     {
  //       inputs: [],
  //       name: "ZeroQueries",
  //       type: "error",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "uint8",
  //               name: "version",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "uint16",
  //               name: "senderChainId",
  //               type: "uint16",
  //             },
  //             {
  //               internalType: "uint32",
  //               name: "nonce",
  //               type: "uint32",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "requestId",
  //               type: "bytes",
  //             },
  //             {
  //               components: [
  //                 {
  //                   internalType: "uint16",
  //                   name: "chainId",
  //                   type: "uint16",
  //                 },
  //                 {
  //                   internalType: "uint8",
  //                   name: "queryType",
  //                   type: "uint8",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "request",
  //                   type: "bytes",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "response",
  //                   type: "bytes",
  //                 },
  //               ],
  //               internalType: "struct ParsedPerChainQueryResponse[]",
  //               name: "responses",
  //               type: "tuple[]",
  //             },
  //           ],
  //           indexed: false,
  //           internalType: "struct ParsedQueryResponse",
  //           name: "r",
  //           type: "tuple",
  //         },
  //         {
  //           components: [
  //             {
  //               internalType: "bytes",
  //               name: "requestBlockId",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "blockNum",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "blockTime",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "blockHash",
  //               type: "bytes32",
  //             },
  //             {
  //               components: [
  //                 {
  //                   internalType: "address",
  //                   name: "contractAddress",
  //                   type: "address",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "callData",
  //                   type: "bytes",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "result",
  //                   type: "bytes",
  //                 },
  //               ],
  //               internalType: "struct EthCallData[]",
  //               name: "result",
  //               type: "tuple[]",
  //             },
  //           ],
  //           indexed: false,
  //           internalType: "struct EthCallQueryResponse",
  //           name: "eqr",
  //           type: "tuple",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "address",
  //           name: "owner",
  //           type: "address",
  //         },
  //       ],
  //       name: "Logger",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "listingId",
  //           type: "uint256",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "address",
  //           name: "seller",
  //           type: "address",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "address",
  //           name: "tokenAddress",
  //           type: "address",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "priceInNative",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "NFTListed",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "orderId",
  //           type: "uint256",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "address",
  //           name: "seller",
  //           type: "address",
  //         },
  //       ],
  //       name: "NftPurchaseCompleted",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "orderId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "NftPurchaseFailed",
  //       type: "event",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "orderId",
  //           type: "uint256",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "foreignChainListingId",
  //           type: "uint256",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "wormholeChainId",
  //           type: "uint256",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "address",
  //           name: "buyer",
  //           type: "address",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "pricePaidInNative",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "NftPurchaseInitiated",
  //       type: "event",
  //     },
  //     {
  //       inputs: [],
  //       name: "QT_ETH_CALL",
  //       outputs: [
  //         {
  //           internalType: "uint8",
  //           name: "",
  //           type: "uint8",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "QT_ETH_CALL_BY_TIMESTAMP",
  //       outputs: [
  //         {
  //           internalType: "uint8",
  //           name: "",
  //           type: "uint8",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "QT_ETH_CALL_WITH_FINALITY",
  //       outputs: [
  //         {
  //           internalType: "uint8",
  //           name: "",
  //           type: "uint8",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "QT_MAX",
  //       outputs: [
  //         {
  //           internalType: "uint8",
  //           name: "",
  //           type: "uint8",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "QT_SOL_ACCOUNT",
  //       outputs: [
  //         {
  //           internalType: "uint8",
  //           name: "",
  //           type: "uint8",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "VERSION",
  //       outputs: [
  //         {
  //           internalType: "uint8",
  //           name: "",
  //           type: "uint8",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "getListingIdCounte",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "getOrderIdCounter",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "bytes",
  //           name: "response",
  //           type: "bytes",
  //         },
  //       ],
  //       name: "getResponseDigest",
  //       outputs: [
  //         {
  //           internalType: "bytes32",
  //           name: "",
  //           type: "bytes32",
  //         },
  //       ],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "bytes",
  //           name: "response",
  //           type: "bytes",
  //         },
  //       ],
  //       name: "getResponseHash",
  //       outputs: [
  //         {
  //           internalType: "bytes32",
  //           name: "",
  //           type: "bytes32",
  //         },
  //       ],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "tokenAddress",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "nativePrice",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "bytes",
  //           name: "response",
  //           type: "bytes",
  //         },
  //         {
  //           components: [
  //             {
  //               internalType: "bytes32",
  //               name: "r",
  //               type: "bytes32",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "s",
  //               type: "bytes32",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "v",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "guardianIndex",
  //               type: "uint8",
  //             },
  //           ],
  //           internalType: "struct IWormhole.Signature[]",
  //           name: "signatures",
  //           type: "tuple[]",
  //         },
  //       ],
  //       name: "listNft",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "listingIdCounter",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "listings",
  //       outputs: [
  //         {
  //           internalType: "address",
  //           name: "seller",
  //           type: "address",
  //         },
  //         {
  //           internalType: "address",
  //           name: "tokenAddress",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "tokenId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "wormholeChainId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "priceInNative",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "bytes",
  //           name: "signature",
  //           type: "bytes",
  //         },
  //         {
  //           internalType: "bool",
  //           name: "isActive",
  //           type: "bool",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "orderId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "address",
  //           name: "seller",
  //           type: "address",
  //         },
  //         {
  //           internalType: "bool",
  //           name: "isSuccess",
  //           type: "bool",
  //         },
  //       ],
  //       name: "nftPurchaseCallback",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "orderIdCounter",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "orders",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "orderId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "listingId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "wormholeChainId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "address",
  //           name: "buyer",
  //           type: "address",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "pricePaidInNative",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "enum VenusProtocol.OrderStatus",
  //           name: "status",
  //           type: "uint8",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "bytes",
  //           name: "response",
  //           type: "bytes",
  //         },
  //         {
  //           components: [
  //             {
  //               internalType: "bytes32",
  //               name: "r",
  //               type: "bytes32",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "s",
  //               type: "bytes32",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "v",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "guardianIndex",
  //               type: "uint8",
  //             },
  //           ],
  //           internalType: "struct IWormhole.Signature[]",
  //           name: "signatures",
  //           type: "tuple[]",
  //         },
  //       ],
  //       name: "parseAndVerifyQueryResponse",
  //       outputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "uint8",
  //               name: "version",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "uint16",
  //               name: "senderChainId",
  //               type: "uint16",
  //             },
  //             {
  //               internalType: "uint32",
  //               name: "nonce",
  //               type: "uint32",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "requestId",
  //               type: "bytes",
  //             },
  //             {
  //               components: [
  //                 {
  //                   internalType: "uint16",
  //                   name: "chainId",
  //                   type: "uint16",
  //                 },
  //                 {
  //                   internalType: "uint8",
  //                   name: "queryType",
  //                   type: "uint8",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "request",
  //                   type: "bytes",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "response",
  //                   type: "bytes",
  //                 },
  //               ],
  //               internalType: "struct ParsedPerChainQueryResponse[]",
  //               name: "responses",
  //               type: "tuple[]",
  //             },
  //           ],
  //           internalType: "struct ParsedQueryResponse",
  //           name: "r",
  //           type: "tuple",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "uint16",
  //               name: "chainId",
  //               type: "uint16",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "queryType",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "request",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "response",
  //               type: "bytes",
  //             },
  //           ],
  //           internalType: "struct ParsedPerChainQueryResponse",
  //           name: "pcr",
  //           type: "tuple",
  //         },
  //       ],
  //       name: "parseEthCallByTimestampQueryResponse",
  //       outputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "bytes",
  //               name: "requestTargetBlockIdHint",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "requestFollowingBlockIdHint",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "requestTargetTimestamp",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "targetBlockNum",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "targetBlockTime",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "followingBlockNum",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "targetBlockHash",
  //               type: "bytes32",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "followingBlockHash",
  //               type: "bytes32",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "followingBlockTime",
  //               type: "uint64",
  //             },
  //             {
  //               components: [
  //                 {
  //                   internalType: "address",
  //                   name: "contractAddress",
  //                   type: "address",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "callData",
  //                   type: "bytes",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "result",
  //                   type: "bytes",
  //                 },
  //               ],
  //               internalType: "struct EthCallData[]",
  //               name: "result",
  //               type: "tuple[]",
  //             },
  //           ],
  //           internalType: "struct EthCallByTimestampQueryResponse",
  //           name: "r",
  //           type: "tuple",
  //         },
  //       ],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "uint16",
  //               name: "chainId",
  //               type: "uint16",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "queryType",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "request",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "response",
  //               type: "bytes",
  //             },
  //           ],
  //           internalType: "struct ParsedPerChainQueryResponse",
  //           name: "pcr",
  //           type: "tuple",
  //         },
  //       ],
  //       name: "parseEthCallQueryResponse",
  //       outputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "bytes",
  //               name: "requestBlockId",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "blockNum",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "blockTime",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "blockHash",
  //               type: "bytes32",
  //             },
  //             {
  //               components: [
  //                 {
  //                   internalType: "address",
  //                   name: "contractAddress",
  //                   type: "address",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "callData",
  //                   type: "bytes",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "result",
  //                   type: "bytes",
  //                 },
  //               ],
  //               internalType: "struct EthCallData[]",
  //               name: "result",
  //               type: "tuple[]",
  //             },
  //           ],
  //           internalType: "struct EthCallQueryResponse",
  //           name: "r",
  //           type: "tuple",
  //         },
  //       ],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "uint16",
  //               name: "chainId",
  //               type: "uint16",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "queryType",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "request",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "response",
  //               type: "bytes",
  //             },
  //           ],
  //           internalType: "struct ParsedPerChainQueryResponse",
  //           name: "pcr",
  //           type: "tuple",
  //         },
  //       ],
  //       name: "parseEthCallWithFinalityQueryResponse",
  //       outputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "bytes",
  //               name: "requestBlockId",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "requestFinality",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "blockNum",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "blockTime",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "blockHash",
  //               type: "bytes32",
  //             },
  //             {
  //               components: [
  //                 {
  //                   internalType: "address",
  //                   name: "contractAddress",
  //                   type: "address",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "callData",
  //                   type: "bytes",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "result",
  //                   type: "bytes",
  //                 },
  //               ],
  //               internalType: "struct EthCallData[]",
  //               name: "result",
  //               type: "tuple[]",
  //             },
  //           ],
  //           internalType: "struct EthCallWithFinalityQueryResponse",
  //           name: "r",
  //           type: "tuple",
  //         },
  //       ],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "uint16",
  //               name: "chainId",
  //               type: "uint16",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "queryType",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "request",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "response",
  //               type: "bytes",
  //             },
  //           ],
  //           internalType: "struct ParsedPerChainQueryResponse",
  //           name: "pcr",
  //           type: "tuple",
  //         },
  //       ],
  //       name: "parseSolanaAccountQueryResponse",
  //       outputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "bytes",
  //               name: "requestCommitment",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "requestMinContextSlot",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "requestDataSliceOffset",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "requestDataSliceLength",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "slotNumber",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "uint64",
  //               name: "blockTime",
  //               type: "uint64",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "blockHash",
  //               type: "bytes32",
  //             },
  //             {
  //               components: [
  //                 {
  //                   internalType: "bytes32",
  //                   name: "account",
  //                   type: "bytes32",
  //                 },
  //                 {
  //                   internalType: "uint64",
  //                   name: "lamports",
  //                   type: "uint64",
  //                 },
  //                 {
  //                   internalType: "uint64",
  //                   name: "rentEpoch",
  //                   type: "uint64",
  //                 },
  //                 {
  //                   internalType: "bool",
  //                   name: "executable",
  //                   type: "bool",
  //                 },
  //                 {
  //                   internalType: "bytes32",
  //                   name: "owner",
  //                   type: "bytes32",
  //                 },
  //                 {
  //                   internalType: "bytes",
  //                   name: "data",
  //                   type: "bytes",
  //                 },
  //               ],
  //               internalType: "struct SolanaAccountResult[]",
  //               name: "results",
  //               type: "tuple[]",
  //             },
  //           ],
  //           internalType: "struct SolanaAccountQueryResponse",
  //           name: "r",
  //           type: "tuple",
  //         },
  //       ],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "listingId",
  //           type: "uint256",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "wormholeChainId",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "purchaseNFT",
  //       outputs: [
  //         {
  //           internalType: "uint256",
  //           name: "orderId",
  //           type: "uint256",
  //         },
  //       ],
  //       stateMutability: "payable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "responsePrefix",
  //       outputs: [
  //         {
  //           internalType: "bytes",
  //           name: "",
  //           type: "bytes",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint64",
  //           name: "_blockNum",
  //           type: "uint64",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "_minBlockNum",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "validateBlockNum",
  //       outputs: [],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint64",
  //           name: "_blockTime",
  //           type: "uint64",
  //         },
  //         {
  //           internalType: "uint256",
  //           name: "_minBlockTime",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "validateBlockTime",
  //       outputs: [],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint16",
  //           name: "chainId",
  //           type: "uint16",
  //         },
  //         {
  //           internalType: "uint16[]",
  //           name: "_validChainIds",
  //           type: "uint16[]",
  //         },
  //       ],
  //       name: "validateChainId",
  //       outputs: [],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "address",
  //               name: "contractAddress",
  //               type: "address",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "callData",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "result",
  //               type: "bytes",
  //             },
  //           ],
  //           internalType: "struct EthCallData",
  //           name: "r",
  //           type: "tuple",
  //         },
  //         {
  //           internalType: "address[]",
  //           name: "_expectedContractAddresses",
  //           type: "address[]",
  //         },
  //         {
  //           internalType: "bytes4[]",
  //           name: "_expectedFunctionSignatures",
  //           type: "bytes4[]",
  //         },
  //       ],
  //       name: "validateEthCallData",
  //       outputs: [],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           components: [
  //             {
  //               internalType: "address",
  //               name: "contractAddress",
  //               type: "address",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "callData",
  //               type: "bytes",
  //             },
  //             {
  //               internalType: "bytes",
  //               name: "result",
  //               type: "bytes",
  //             },
  //           ],
  //           internalType: "struct EthCallData[]",
  //           name: "r",
  //           type: "tuple[]",
  //         },
  //         {
  //           internalType: "address[]",
  //           name: "_expectedContractAddresses",
  //           type: "address[]",
  //         },
  //         {
  //           internalType: "bytes4[]",
  //           name: "_expectedFunctionSignatures",
  //           type: "bytes4[]",
  //         },
  //       ],
  //       name: "validateMultipleEthCallData",
  //       outputs: [],
  //       stateMutability: "pure",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "bytes",
  //           name: "response",
  //           type: "bytes",
  //         },
  //         {
  //           internalType: "bytes32",
  //           name: "rSig",
  //           type: "bytes32",
  //         },
  //         {
  //           internalType: "bytes32",
  //           name: "sSig",
  //           type: "bytes32",
  //         },
  //         {
  //           internalType: "uint8",
  //           name: "vSig",
  //           type: "uint8",
  //         },
  //         {
  //           internalType: "uint8",
  //           name: "guardianIndexSig",
  //           type: "uint8",
  //         },
  //       ],
  //       name: "verifyApprovalCrossChainQuery",
  //       outputs: [
  //         {
  //           internalType: "bool",
  //           name: "",
  //           type: "bool",
  //         },
  //       ],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "bytes",
  //           name: "response",
  //           type: "bytes",
  //         },
  //         {
  //           components: [
  //             {
  //               internalType: "bytes32",
  //               name: "r",
  //               type: "bytes32",
  //             },
  //             {
  //               internalType: "bytes32",
  //               name: "s",
  //               type: "bytes32",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "v",
  //               type: "uint8",
  //             },
  //             {
  //               internalType: "uint8",
  //               name: "guardianIndex",
  //               type: "uint8",
  //             },
  //           ],
  //           internalType: "struct IWormhole.Signature[]",
  //           name: "signatures",
  //           type: "tuple[]",
  //         },
  //       ],
  //       name: "verifyQueryResponseSignatures",
  //       outputs: [],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "wormhole",
  //       outputs: [
  //         {
  //           internalType: "contract IWormhole",
  //           name: "",
  //           type: "address",
  //         },
  //       ],
  //       stateMutability: "view",
  //       type: "function",
  //     },
  //   ],
  //   functionName: "verifyApprovalCrossChainQuery",
  //   onSuccess(data) {
  //     console.log("Transaction Sent");
  //     console.log("Hash: ", data.hash);
  //     setTxHash(data.hash);
  //   },
  // });

  return (
    <Layout>
      {txHash != "" && pairBred != "" && (
        <Confetti width={width} height={height} />
      )}

      <div className="min-h-[90vh] mt-20 w-[80%] mx-auto flex justify-between">
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <NFTCard
              image={
                "https://img.midjourneyapi.xyz/mj/9be0aacb-8978-4c82-88fb-495dee1efe41.png"
              }
              tokenAddress={"0x123"}
              tokenId={"1"}
              chainId={"80001"}
              mode={"create ✨"}
              size={300}
            />
          </div>

          <div className="flex flex-1 flex-col  mx-24">
            <p className="font-semibold text-3xl">Info</p>

            <div className="flex mt-8 flex justify-between space-x-4">
              <div className="flex-1">
                <p className="font-semibold text-md">Token Address</p>
                <input
                  type="text"
                  placeholder={"Click on the box to upload your NFT"}
                  value={tokenAddress}
                  disabled={true}
                  className="font-theme font-semibold text-[#6c6f70] text-md bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6 p-2 rounded-xl focus:outline-none  w-full flex-shrink-0 mr-2"
                />
              </div>
              <div className="w-[30%]">
                <p className="font-semibold text-md">Token Id</p>
                <input
                  type="text"
                  placeholder={"Click on the box to upload your NFT"}
                  value={tokenId}
                  disabled={true}
                  className="font-theme font-semibold text-[#6c6f70] text-md bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6  p-2 rounded-xl focus:outline-none  w-full flex-shrink-0 mr-2"
                />
              </div>
            </div>
            <div className="flex mt-8 flex justify-between space-x-4">
              <div className="">
                <p className="font-semibold text-md">Origin Chain</p>
                <Image
                  src={`/chains/${chainId}.png`}
                  width={60}
                  height={60}
                  alt={"Listing"}
                  className="mt-4 ml-2"
                />
              </div>
              <div className="w-[30%] flex flex-col">
                <p className="font-semibold text-md">Owner</p>
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://${explorers["1287"]}/address/${address}`
                    );
                  }}
                >
                  <p className="text-xl font-semibold text-[#9c9e9e] my-4 mr-2">
                    {shortenEthereumAddress(
                      address == undefined ? "" : address
                    )}
                  </p>
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="text-[#9c9e9e] text-sm font-normal my-auto"
                  />
                </div>
              </div>
            </div>
            <div className="flex mt-8 flex justify-between space-x-4">
              <div className="">
                <p className="font-semibold text-2xl mb-6">List NFT</p>
                <p className="text-md font-semibold">Price</p>
                <div className="flex">
                  {" "}
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      setPrice(parseInt(e.target.value));
                    }}
                    className="font-theme w-[50%] font-semibold placeholder:text-[#6c6f70] text-xl placeholder:text-base bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6 text-white p-2 rounded-xl focus:outline-none   flex-shrink-0 mr-2"
                  />
                  <p className="text-xl font-semibold my-auto ml-2">GLMR</p>
                </div>
              </div>
              <div className="w-[30%] flex flex-col justify-end mb-2">
                <button
                  onClick={async () => {
                    const res = await fetch("/api/wormhole/query", {
                      method: "POST",
                    });
                    const resData = await res.json();
                    console.log([
                      "0x" + resData.data.bytes,
                      resData.struct[0].r,
                      resData.struct[0].s,
                      resData.struct[0].v,
                      resData.struct[0].guardianIndex,
                    ]);
                    // await testWormhole({
                    //   args: [
                    //     "0x" + resData.data.bytes,
                    //     resData.struct[0].r,
                    //     resData.struct[0].s,
                    //     resData.struct[0].v,
                    //     resData.struct[0].guardianIndex,
                    //   ],
                    // });
                  }}
                  // disabled={}
                  className={`${
                    false
                      ? "bg-[#25272b] text-[#5b5e5b]"
                      : "bg-white text-black"
                  } px-4 py-2 rounded-xl font-semibold `}
                >
                  List NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
