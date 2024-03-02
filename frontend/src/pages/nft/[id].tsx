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
import { useAccount, useWriteContract } from "wagmi";
import useWindowSize from "@/hooks/useWindowSize";
import {
  explorers,
  protocolAddress,
  venusProtocolAbi,
} from "@/utils/constants";
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
  const { writeContractAsync: listNft } = useWriteContract();
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

                    await listNft({
                      address: protocolAddress as `0x${string}`,
                      abi: venusProtocolAbi,
                      functionName: "listNft",
                      args: [
                        tokenAddress,
                        tokenId,
                        price,
                        300000,
                        chainId,
                        [
                          "0x" + resData.data.bytes,
                          resData.struct[0].r,
                          resData.struct[0].s,
                          resData.struct[0].v,
                          resData.struct[0].guardianIndex,
                        ],
                      ],
                    });
                    //   args: [
                    //     "0x" + resData.data.bytes,
                    //     resData.struct[0].r,
                    //     resData.struct[0].s,
                    //     resData.struct[0].v,
                    //     resData.struct[0].guardianIndex,
                    //   ],
                    // });
                  }}
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
