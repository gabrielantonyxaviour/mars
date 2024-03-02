import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/Spinner";
import { capitalizeString, shortenEthereumAddress } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, use, useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useChainModal } from "@rainbow-me/rainbowkit";
import ChainDropdown from "@/components/Dropdown/ChainDropdown";
import TransactionStatusCreate from "@/components/TransactionStatus/TransactionStatusCreate";
import ChooseChainDropdown from "@/components/Dropdown/ChooseChainDropdown";
import {
  venusMoonbaseNftAbi,
  venusMoonbaseNftAddress,
  wormholeChainIds,
} from "@/utils/constants";
import {
  createPublicClient,
  formatUnits,
  getContract,
  http,
  parseEther,
  parseGwei,
} from "viem";
import { moonbaseAlpha } from "viem/chains";
import axios from "axios";
import readFileAsBase64 from "@/utils/readFileAsBase64";
export default function Import() {
  const router = useRouter();
  const { chain: chainQueryParam } = router.query;
  const { address, chain } = useAccount();
  const { width, height } = useWindowSize();
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(0);
  const [messageId, setMessageId] = useState("");
  const [progress, setProgress] = useState(0);
  const [approveSignature, setApproveSignature] = useState<`0x${string}`>();
  const [txHash, setTxHash] = useState<string>("");
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [selectedChain, setSelectedChain] = useState("1287");
  const [mintFee, setMintFee] = useState<bigint>(BigInt(0));
  const [chains, setChains] = useState([
    "1287",
    "80001",
    "11155111",
    "84532",
    "421614",
  ]);
  const { writeContractAsync: mintNft } = useWriteContract();
  const publicClient = createPublicClient({
    chain: moonbaseAlpha,
    transport: http(),
  });
  const contract = getContract({
    address: venusMoonbaseNftAddress,
    abi: venusMoonbaseNftAbi,
    client: publicClient,
  });
  useEffect(() => {
    (async function getMintFee() {
      const response = await contract.read.quoteCrossChainCall([
        wormholeChainIds[selectedChain],
        "200000",
      ]);
      console.log(response);
      setMintFee(response as bigint);
    })();
  }, [selectedChain]);

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

  // Function to handle image selection
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImageSrc(e.target.result as string);
          console.log(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
    setCount(1);
    setSelectedFile(file || null);
  };
  return (
    <Layout>
      <div className="flex justify-center h-[90vh] items-center ">
        {count == 2 && <Confetti width={width} height={height} />}
        <div className="flex">
          <div className=" flex flex-col justify-start">
            <p className="text-5xl font-bold mb-5">Import Venus NFT</p>
            <p className="font-semibold text-xl text-[#9c9e9e] ml-2 mb-6">
              You got the next NFT sensation? 👽
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

            <p className="text-white text-xl font-semibold ml-4 mb-2 mt-4">
              Choose Chain
            </p>
            <ChooseChainDropdown
              options={chains}
              setOption={setSelectedChain}
              selectedOption={selectedChain}
            />
            <div className="flex justify-between">
              <div>
                <p className="text-white text-xl font-semibold ml-4  mt-6">
                  Confirmation
                </p>
                <p className="ml-4 mb-2 text-[#9c9e9e] font-semibold text-sm">
                  Mint Fee: {formatUnits(mintFee, 18)} &nbsp;GLMR
                </p>
              </div>
            </div>

            <div
              className={`ml-2 border ${
                count != 1 ? "border-[#25272b]" : "border-white"
              } py-3 px-5 rounded-xl flex justify-between my-2`}
            >
              <p
                className={`font-semibold my-auto ${
                  count != 1 ? "text-[#5b5e5b]" : "text-white"
                }`}
              >
                Generate and Mint NFT
              </p>
              <button
                onClick={async () => {
                  try {
                    console.log(imageSrc);
                    const imageRes = await axios.post(
                      "/api/pinata/image",
                      JSON.stringify({ file: imageSrc }),
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    console.log(imageRes.data.IpfsHash);
                    const metadata = {
                      name: "NFT Artwork",
                      description:
                        "A unique digital artwork stored on the blockchain as an NFT.",
                      image: imageRes.data.IpfsHash,
                      attributes: [],
                      external_url: "https://venus-nine.vercel.app/",
                      background_color: "FFFFFF",
                    };

                    const res = await axios.post("/api/pinata/json", metadata, {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    });
                    console.log([
                      address as string,
                      res.data.IpfsHash,
                      "0x",
                      selectedChain,
                      "200000",
                      mintFee,
                    ]);
                    const unwatch = publicClient.watchContractEvent({
                      address: venusMoonbaseNftAddress,
                      abi: venusMoonbaseNftAbi,
                      onLogs: async (logs) => {
                        console.log("Logged!");
                        setTransactionConfirmed(true);
                      },
                    });
                    const tx = await mintNft({
                      abi: venusMoonbaseNftAbi,
                      address: venusMoonbaseNftAddress,
                      functionName: "mintImportNft",
                      args: [
                        address as string,
                        res.data.IpfsHash,
                        "0x",
                        selectedChain,
                        "200000",
                      ],
                      value: mintFee,
                    });
                    setTxHash(tx);
                  } catch (e) {
                    console.log(e);
                  }
                }}
                disabled={count != 1 || chain?.id != 1287}
                className={`${
                  count != 1 || chain?.id != 1287
                    ? "bg-[#25272b] text-[#5b5e5b]"
                    : "bg-white text-black"
                } px-4 py-2 rounded-xl font-semibold `}
              >
                {count != 2 ? "Mint 🪄" : "Done ✅"}
              </button>
            </div>
          </div>
          <div>
            <div className=" border border-white border-dashed h-[500px] w-[500px] rounded-xl ml-16">
              {count == 1 ? (
                <div
                  className="flex flex-col justify-center items-center h-full cursor-pointer"
                  onClick={() => {
                    document.getElementById("imageInput")?.click();
                  }}
                >
                  <Image
                    src={imageSrc}
                    alt="gen-image"
                    width={500}
                    height={500}
                    className="rounded-xl"
                  />
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              ) : (
                <div
                  className="flex flex-col justify-center items-center h-full cursor-pointer"
                  onClick={() => {
                    document.getElementById("imageInput")?.click();
                  }}
                >
                  <p className="font-bold text-2xl mb-1">Upload your NFT</p>
                  <p className="text-sm text-[#a9a9a9] mb-4">
                    Click here to import from your device
                  </p>
                  <Image
                    src={"/create/import.png"}
                    width={50}
                    height={50}
                    alt="upload"
                  />
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <TransactionStatusCreate
        destinationChainId={selectedChain}
        sourceTransactionHash={txHash as string}
        transactionConfirmed={transactionConfirmed}
      />
    </Layout>
  );
}
