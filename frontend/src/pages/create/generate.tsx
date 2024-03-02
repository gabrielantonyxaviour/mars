import Layout from "@/components/Layout";
import LoadingSpinner from "@/components/Spinner";
import { capitalizeString, shortenEthereumAddress } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import {
  createPublicClient,
  decodeEventLog,
  formatUnits,
  getContract,
  http,
} from "viem";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useChainModal } from "@rainbow-me/rainbowkit";
import GenerateButton from "@/components/GenerateButton";
import TransactionStatusCreate from "@/components/TransactionStatus/TransactionStatusCreate";
import ChooseChainDropdown from "@/components/Dropdown/ChooseChainDropdown";
import {
  venusMoonbaseNftAbi,
  venusMoonbaseNftAddress,
  wormholeChainIds,
} from "@/utils/constants";
import { moonbaseAlpha } from "viem/chains";
export default function Generate() {
  const router = useRouter();
  const { chain: chainQueryParam } = router.query;
  const { address } = useAccount();
  const { width, height } = useWindowSize();
  const { chain } = useAccount();
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(0);
  const [messageId, setMessageId] = useState("");
  const [chooseImage, setChooseImage] = useState("");
  const [fetchTime, setFetchTime] = useState(0);
  const [txHash, setTxHash] = useState<string>("");
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const { openChainModal } = useChainModal();
  const [selectedChain, setSelectedChain] = useState("1287");
  const [mintFee, setMintFee] = useState<bigint>(BigInt(0));
  const [chains, setChains] = useState([
    "1287",
    "80001",
    "11155111",
    "84532",
    "421614",
  ]);
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
      <div className="flex justify-center h-[100vh] items-center ">
        {count == 4 && <Confetti width={width} height={height} />}
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
            <p className="text-white text-xl font-semibold ml-4 mb-2">Prompt</p>
            <input
              type="text"
              placeholder={"Ex. CryptoPunk that looks like Drake"}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
              className="font-theme ml-2 font-semibold placeholder:text-[#6c6f70] text-xl placeholder:text-base bg-[#25272b] border border-[#25272b] focus:border-white my-1 pl-6 text-white p-2 rounded-xl focus:outline-none  w-full flex-shrink-0 mr-2"
            />

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
                <p className="text-white text-xl font-semibold ml-4  mt-2">
                  Confirmation
                </p>
                <p className="ml-4 mb-2 text-[#9c9e9e] font-semibold text-sm">
                  Mint Fee: {formatUnits(mintFee, 18)} &nbsp;GLMR
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
                onClick={async () => {
                  console.log(prompt);
                  setCount(1);
                  const gen = await fetch("/api/midjourney/imagine", {
                    method: "POST",
                    body: JSON.stringify({
                      prompt,
                    }),
                  });
                  const { task_id } = await gen.json();
                  setMessageId(task_id);
                  let fetchedImage: any = {
                    status: "pending",
                    process_time: 0,
                  };
                  while (fetchedImage.status != "finished") {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    const res = await fetch("/api/midjourney/fetch", {
                      method: "POST",
                      body: JSON.stringify({
                        task_id,
                      }),
                    });
                    fetchedImage = await res.json();
                    setFetchTime(fetchedImage.process_time);
                  }
                  setChooseImage(fetchedImage.task_result.image_url);
                  setCount(2);
                  setFetchTime(0);
                }}
                disabled={count != 0 || chain?.id != 1287 || prompt == ""}
                className={`${
                  count != 0 || chain?.id != 1287 || prompt == ""
                    ? "bg-[#25272b] text-[#5b5e5b]"
                    : "bg-white text-black"
                } px-4 py-2 rounded-xl font-semibold `}
              >
                {count == 0
                  ? "Mint 🪄"
                  : count == 1 || count == 2 || count == 3
                  ? "Minting..."
                  : "Done ✅"}
              </button>
            </div>
          </div>
          <div>
            <div className=" border border-white border-dashed h-[500px] w-[500px] rounded-xl ml-16">
              {count == 2 ? (
                <div className="flex flex-col items-center">
                  <Image
                    src={chooseImage}
                    width={300}
                    height={300}
                    alt="gen-image"
                    className="rounded-xl"
                  />
                  <div className="pt-6 w-full">
                    <p className="text-xl font-semibold text-white text-center">
                      Upscale
                    </p>
                    <div className="grid grid-cols-2 w-[85%] mx-auto pt-4">
                      <GenerateButton
                        setCount={setCount}
                        setMessageId={setMessageId}
                        messageId={messageId}
                        setTransactionConfirmed={setTransactionConfirmed}
                        publicClient={publicClient}
                        mintFee={mintFee}
                        selectedChain={selectedChain}
                        setFetchTime={setFetchTime}
                        index="1"
                        setChooseImage={setChooseImage}
                        setTxHash={setTxHash}
                      />
                      <GenerateButton
                        setCount={setCount}
                        setMessageId={setMessageId}
                        messageId={messageId}
                        setTransactionConfirmed={setTransactionConfirmed}
                        publicClient={publicClient}
                        mintFee={mintFee}
                        selectedChain={selectedChain}
                        setFetchTime={setFetchTime}
                        index="2"
                        setChooseImage={setChooseImage}
                        setTxHash={setTxHash}
                      />
                      <GenerateButton
                        setCount={setCount}
                        setMessageId={setMessageId}
                        messageId={messageId}
                        setTransactionConfirmed={setTransactionConfirmed}
                        publicClient={publicClient}
                        mintFee={mintFee}
                        selectedChain={selectedChain}
                        setFetchTime={setFetchTime}
                        index="3"
                        setChooseImage={setChooseImage}
                        setTxHash={setTxHash}
                      />
                      <GenerateButton
                        setCount={setCount}
                        setMessageId={setMessageId}
                        messageId={messageId}
                        setTransactionConfirmed={setTransactionConfirmed}
                        publicClient={publicClient}
                        mintFee={mintFee}
                        selectedChain={selectedChain}
                        setFetchTime={setFetchTime}
                        index="4"
                        setChooseImage={setChooseImage}
                        setTxHash={setTxHash}
                      />
                    </div>
                  </div>
                </div>
              ) : messageId != "" ? (
                <div className="flex flex-col justify-center items-center h-full">
                  <p className="font-bold text-xl text-[#9c9e9e]">Seed</p>
                  <p className="font-semibold text-lg">{messageId}</p>
                  <p className="font-bold text-xl text-[#9c9e9e] mt-8">
                    Process Time
                  </p>
                  <p className="font-semibold mb-8 text-lg">
                    {fetchTime} sec(s)
                  </p>
                  <Image
                    src={"/mint.gif"}
                    width={200}
                    height={200}
                    alt="minting"
                  />
                </div>
              ) : (
                count == 4 && (
                  <Image
                    src={chooseImage}
                    width={500}
                    height={500}
                    alt="gen-image"
                    className="rounded-xl"
                  />
                )
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
