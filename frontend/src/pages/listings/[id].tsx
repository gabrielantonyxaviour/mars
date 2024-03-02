import Layout from "@/components/Layout";
import NFTCard from "@/components/NFTCard";
import LoadingSpinner from "@/components/Spinner";
import Confetti from "react-confetti";

import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  WalletClient,
  createPublicClient,
  decodeEventLog,
  formatUnits,
  getContract,
  http,
} from "viem";
import { useAccount, useWriteContract } from "wagmi";
import useWindowSize from "@/hooks/useWindowSize";
import {
  explorers,
  protocolAddress,
  venusConnectorAbi,
  venusConnectorAddresses,
  venusProtocolAbi,
  wormholeChainIds,
} from "@/utils/constants";
import { shortenEthereumAddress } from "@/utils";
import { moonbaseAlpha } from "viem/chains";
import axios from "axios";
import resolveChain from "@/utils/resolveChain";
import TransactionStatusOrder from "@/components/TransactionStatus/TransactionStatusOrder";
import TransactionStatusCreate from "@/components/TransactionStatus/TransactionStatusCreate";

export default function Listing() {
  const router = useRouter();
  const { id } = router.query;
  const { width, height } = useWindowSize();
  const { address } = useAccount();
  const [txHash, setTxHash] = useState("");
  const [txConfirmed, setTxConfirmed] = useState(false);
  const [receiverValue, setReceiverValue] = useState(BigInt(0));
  const [mintFee, setMintFee] = useState(BigInt(0));
  const [listing, setListing] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const { writeContractAsync: purchaseNft } = useWriteContract();
  const [orderId, setOrderId] = useState("");
  const publicClient = createPublicClient({
    chain: moonbaseAlpha,
    transport: http(),
  });
  useEffect(() => {
    (async function getListing() {
      console.log(id);
      const lstng = await axios.post(
        "/api/drpc/get-listing-details",
        { id: id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(lstng.data);
      setListing(lstng.data[0]);
    })();
  }, [id]);

  useEffect(() => {
    if (listing != null) {
      const publicClient = createPublicClient({
        chain: resolveChain(listing.nativeChainId),
        transport: http(),
      });

      const publicClientMoonbeam = createPublicClient({
        chain: moonbaseAlpha,
        transport: http(),
      });
      const connectorContract = getContract({
        address: venusConnectorAddresses[
          listing.nativeChainId
        ] as `0x${string}`,
        abi: venusConnectorAbi,
        client: publicClient,
      });

      const protcolContact = getContract({
        address: protocolAddress as `0x${string}`,
        abi: venusProtocolAbi,
        client: publicClientMoonbeam,
      });
      (async function getMintFee() {
        const response = await connectorContract.read.quoteCrossChainCall([
          "16",
          "0",
        ]);
        console.log(response);
        setReceiverValue(response as bigint);
        const query = await protcolContact.read.quoteCrossChainCall([
          wormholeChainIds[listing.chainId],
          (response as bigint).toString(),
          "200000",
        ]);
        console.log(query);
        setMintFee(query as bigint);
      })();
    }
  }, [listing]);
  useEffect(() => {
    if (listing != null) {
      const targetTimestamp =
        Math.floor(new Date(listing.timestamp).getTime() / 1000) +
        listing.validity;

      const intervalId = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime > targetTimestamp) {
          setTimeLeft(0);
          clearInterval(intervalId);
        } else {
          const remaining = Math.max(0, targetTimestamp - currentTime);

          setTimeLeft(remaining);

          if (remaining === 0) {
            clearInterval(intervalId);
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [listing]);

  return (
    <Layout>
      {txHash != "" && <Confetti width={width} height={height} />}

      {listing != null && (
        <div className=" mt-20 mb-12 w-[80%] mx-auto flex justify-between">
          <div className="flex justify-between w-full">
            <div className="flex flex-col">
              <NFTCard
                tokenAddress={listing.address}
                tokenId={listing.tokenId}
                chainId={listing.nativeChainId}
                mode={"create ✨"}
                size={300}
              />
            </div>

            <div className="flex flex-1 flex-col  mx-24">
              <p className="font-bold text-4xl ">Listing #{id}</p>
              <div className="flex mt-8 flex justify-between space-x-4">
                <div className="flex-1">
                  <p className="font-semibold text-md">Token Address</p>
                  <input
                    type="text"
                    placeholder={"Click on the box to upload your NFT"}
                    value={
                      listing.address == undefined ? address : listing.address
                    }
                    disabled={true}
                    className="font-theme font-semibold text-[#6c6f70] text-md bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6 p-2 rounded-xl focus:outline-none  w-full flex-shrink-0 mr-2"
                  />
                </div>
                <div className="w-[30%]">
                  <p className="font-semibold text-md">Token Id</p>
                  <input
                    type="text"
                    placeholder={"Click on the box to upload your NFT"}
                    value={listing.tokenId}
                    disabled={true}
                    className="font-theme font-semibold text-[#6c6f70] text-md bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6  p-2 rounded-xl focus:outline-none  w-full flex-shrink-0 mr-2"
                  />
                </div>
              </div>
              <div className="flex mt-8 flex justify-between space-x-4">
                <div className="">
                  <p className="font-semibold text-md">Origin Chain</p>
                  <Image
                    src={`/chains/${listing.nativeChainId}.png`}
                    width={60}
                    height={60}
                    alt={"Listing"}
                    className="mt-4 ml-2"
                  />
                </div>
                <div className="w-[30%] flex flex-col">
                  <p className="font-semibold text-md">Price</p>
                  <div className="flex-1 py-auto">
                    <p className="mt-6 font-semibold text-xl text-[#9c9e9e] ">
                      {listing.price} GLMR
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex mt-8 flex justify-between space-x-4">
                <div className="">
                  <p className="font-semibold text-md">Expires in</p>
                  <p className="text-xl font-semibold mt-4 text-[#9c9e9e]">
                    {Math.floor(timeLeft / 86400)} Days,{"  "}
                    {Math.floor((timeLeft % 86400) / 3600) < 10 ? "0" : ""}
                    {Math.floor((timeLeft % 86400) / 3600)}:{" "}
                    {Math.floor((timeLeft % 3600) / 60) < 10 ? "0" : ""}
                    {Math.floor((timeLeft % 3600) / 60)}:{" "}
                    {timeLeft % 60 < 10 ? "0" : ""}
                    {timeLeft % 60}
                  </p>
                </div>
                <div className="w-[30%]">
                  <p className="font-semibold text-md">Owner</p>
                  <div
                    className="flex cursor-pointer"
                    onClick={() => {
                      window.open(
                        `https://${explorers["1287"]}/address/${listing.seller}`
                      );
                    }}
                  >
                    <p className="text-xl font-semibold text-[#9c9e9e] my-4 mr-2">
                      {shortenEthereumAddress(
                        listing.seller == undefined ? "" : listing.seller
                      )}
                    </p>
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="text-[#9c9e9e] text-sm font-normal my-auto"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button
                  onClick={async () => {
                    if (listing.chainId == "1287") {
                      const tx = await purchaseNft({
                        address: protocolAddress as `0x${string}`,
                        abi: venusProtocolAbi,
                        functionName: "purchaseNft",
                        args: [id as string],
                        value: BigInt(formatUnits(BigInt(listing.price), 18)),
                      });
                      setTxHash(tx);
                    } else {
                      const unwatch = publicClient.watchContractEvent({
                        address: protocolAddress as `0x${string}`,
                        abi: venusProtocolAbi,
                        onLogs: async (logs: any) => {
                          console.log("Logged!");
                          console.log(logs[0].args.orderId);
                          setOrderId(logs[0].args.orderId);
                          setTxConfirmed(true);
                          unwatch();
                        },
                      });
                      const tx = await purchaseNft({
                        address: protocolAddress as `0x${string}`,
                        abi: venusProtocolAbi,
                        functionName: "purchaseNftViaWormhole",
                        args: [id as string, "", "200000"],
                        value: mintFee,
                      });
                      setTxHash(tx);
                    }
                  }}
                  // disabled={}
                  className={`${
                    false
                      ? "bg-[#25272b] text-[#5b5e5b]"
                      : "bg-white text-black"
                  } px-4 py-2 rounded-xl font-semibold `}
                >
                  Purchase NFT
                </button>
              </div>
              <p className="text-center font-semibold text-[#a9a9a9] mt-2 text-sm">
                Mint Fee: {formatUnits(mintFee, 18)} GLMR{" "}
              </p>
            </div>
          </div>
        </div>
      )}
      {listing != null &&
        (listing.chainId == "1287" ? (
          <TransactionStatusCreate
            destinationChainId={listing.chainId}
            sourceTransactionHash={txHash as string}
            transactionConfirmed={txConfirmed}
          />
        ) : (
          <TransactionStatusOrder
            sourceTransactionHash={txHash}
            destinationChainId={listing.chainId}
            transactionConfirmed={txConfirmed}
            orderId={orderId}
          />
        ))}
    </Layout>
  );
}
