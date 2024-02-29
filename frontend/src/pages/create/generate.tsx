import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/Spinner";
import { capitalizeString, shortenEthereumAddress } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWalletClient,
} from "wagmi";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import { WalletClient, decodeEventLog, formatUnits } from "viem";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useChainModal } from "@rainbow-me/rainbowkit";
export default function Generate() {
  const router = useRouter();
  const { chain: chainQueryParam } = router.query;
  const { address } = useAccount();
  const { width, height } = useWindowSize();
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(0);
  const [messageId, setMessageId] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [approveSignature, setApproveSignature] = useState<`0x${string}`>();
  const [txHash, setTxHash] = useState<`0x${string}`>();
  const [isMinting, setIsMinting] = useState(false);
  const { openChainModal } = useChainModal();

  useEffect(() => {
    console.log("WE ARE HERE");
    console.log(chain?.id);
    console.log(chainQueryParam);
  }, [chain?.id]);

  async function fetchImage(
    messageId: string
  ): Promise<{ image: string; progress: number; imageAlt: string }> {
    const data = await fetch("/api/get-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MIDJOURNEY_API_KEY}`,
      },
      body: JSON.stringify({
        messageId: messageId,
      }),
    });
    const imageData = await data.json();
    return imageData;
  }
  return (
    <Layout>
      <div className="flex justify-center h-[90vh] items-center ">
        {count == 2 && <Confetti width={width} height={height} />}
        <div className="flex">
          <div className=" flex flex-col justify-start">
            <p className="text-5xl font-bold mb-5">Generate Venus NFT</p>
            <p className="font-semibold text-xl text-[#9c9e9e] ml-2 mb-6">
              Let your imaginations go wild 👽
            </p>
            <div className=" my-5 border border-[#25272b] py-3 px-5 rounded-xl flex justify-between">
              <div className="flex">
                <Image
                  src={"/chains/" + chain?.id + ".png"}
                  width={50}
                  height={50}
                  alt={chain?.name as string}
                ></Image>
                <div className="flex flex-col justify-around ml-3">
                  <p className="font-bold">
                    {shortenEthereumAddress(address as string)}
                  </p>
                  <p className="text-[#9c9e9e] font-semibold">
                    {capitalizeString(chain?.name as string)}
                  </p>
                </div>
              </div>
              {chain?.id != 1287 ? (
                <button
                  className="bg-[#760000] px-4 py-2 rounded-xl font-semibold text-[#E71A1A]"
                  onClick={openChainModal}
                >
                  Wrong Network
                </button>
              ) : (
                <button className="bg-[#1a2c21] px-4 py-2 rounded-xl font-semibold text-[#27ab30]">
                  Connected
                </button>
              )}
            </div>
            <p className="text-white text-xl font-semibold ml-4 mb-2 mt-3">
              Prompt
            </p>
            <input
              type="text"
              placeholder={"Ex. CryptoPunk that looks like Drake"}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              className="font-theme ml-2 font-semibold placeholder:text-[#6c6f70] text-xl placeholder:text-base bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6 text-white p-2 rounded-xl focus:outline-none  w-full flex-shrink-0 mr-2"
            />
            <div className="flex justify-between">
              <div>
                <p className="text-white text-xl font-semibold ml-4  mt-6">
                  Confirmation
                </p>
                <p className="ml-4 mb-2 text-[#9c9e9e] font-semibold text-sm">
                  Mint Fee: 5 &nbsp;GLMR
                </p>
              </div>
            </div>

            <div
              className={`ml-2 border ${
                count != 0 ? "border-[#25272b]" : "border-white"
              } py-3 px-5 rounded-xl flex justify-between my-2`}
            >
              <p
                className={`font-semibold my-auto ${
                  count != 0 ? "text-[#5b5e5b]" : "text-white"
                }`}
              >
                Generate and Mint NFT
              </p>
              <button
                onClick={async () => {}}
                // trigger Transactoin

                disabled={count != 0 || chain?.id != 1287}
                className={`${
                  count != 0 || chain?.id != 1287
                    ? "bg-[#25272b] text-[#5b5e5b]"
                    : "bg-white text-black"
                } px-4 py-2 rounded-xl font-semibold `}
              >
                {count == 0 ? "Mint 🪄" : "Done ✅"}
              </button>
            </div>
          </div>
          <div>
            <div className=" border border-white border-dashed h-[500px] w-[500px] rounded-xl ml-16">
              {count == 2 ? (
                <img src={imageAlt} alt="gen-image" className="rounded-xl" />
              ) : (
                messageId != "" && (
                  <div className="flex flex-col justify-center items-center h-full">
                    <p className="font-bold text-xl text-[#9c9e9e]">Seed</p>
                    <p className="font-semibold text-lg">{messageId}</p>
                    <p className="font-bold text-xl text-[#9c9e9e] mt-8">
                      Minting
                    </p>
                    <p className="font-semibold mb-8 text-lg">
                      {progress} / 100
                    </p>
                    <Image
                      src={"/mint.gif"}
                      width={200}
                      height={200}
                      alt="minting"
                    />
                  </div>
                )
              )}
            </div>
            {txHash != null && txHash.length != 0 && (
              <div className="text-center mt-2">
                <p>Tx Hash</p>
                <a
                  className="text-sm text-[#9c9e9e] "
                  href={
                    chain?.id == 88
                      ? "https://vicscan.xyz/tx/" + txHash
                      : "https://testnet.vicscan.xyz/tx/" + txHash
                  }
                  target={"_blank"}
                >
                  {txHash.substring(0, 10) +
                    "...." +
                    txHash.substring(txHash.length - 10)}
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="ml-2"
                  />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
