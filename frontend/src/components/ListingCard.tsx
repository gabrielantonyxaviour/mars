import { nftContractAbi } from "@/utils/constants";
import resolveChain from "@/utils/resolveChain";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import { useAccount } from "wagmi";

export default function ListingCard({
  listingId,
  price,
  chainId,
  createdAt,
  tokenAddress,
  tokenId,
  validity,
  mode,
  size,
}: {
  chainId: string;
  listingId: string;
  tokenAddress: string;
  tokenId: string;
  createdAt: string;
  price: string;
  mode: string;
  validity: number;
  size: number;
}) {
  const { chain } = useAccount();
  const [timeLeft, setTimeLeft] = useState(0);
  const [image, setImage] = useState("");
  const publicClient = createPublicClient({
    chain: resolveChain(chainId),
    transport: http(),
  });
  const contract = getContract({
    address: tokenAddress as `0x${string}`,
    abi: nftContractAbi,
    client: publicClient,
  });

  useEffect(() => {
    (async function getTokenUri() {
      try {
        console.log(chainId);
        const resTokenUri = await contract.read.tokenURI([tokenId]);
        console.log(resTokenUri);
        const metadata = await fetch(resTokenUri as string);
        const metadataJson = await metadata.json();
        const _image = metadataJson.image;
        setImage(_image);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  useEffect(() => {
    const targetTimestamp =
      Math.floor(new Date(createdAt).getTime() / 1000) + validity;

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
  }, []);
  return (
    <Link
      href={"/listings/" + listingId}
      className={`border-[1px] border-[#3c3f41] p-2 rounded-lg font-theme bg-black`}
    >
      <Image
        src={image}
        width={size}
        height={size}
        alt="logo"
        className="bg-white rounded-lg"
      />
      <p className="text-[#CCCCCC] font-semibold text-sm mt-2 mx-2 text-center">
        {mode}
      </p>
      <div className="flex justify-around m-2">
        <Image
          src={`/chains/${chainId}.png`}
          width={50}
          height={50}
          alt="chain_logo"
        />
        <div className="flex flex-col justify-center mx-2">
          <p className="text-center">Price</p>
          <p className="text-center">{price} GLMR</p>
        </div>
      </div>

      <div className="rounded-lg  bg-[#25272b] text-center  ">
        <p className="text-sm font-semibold p-2 text-[#9c9e9e]">
          Expires in {Math.floor(timeLeft / 86400)} Days,{"  "}
          {Math.floor((timeLeft % 86400) / 3600) < 10 ? "0" : ""}
          {Math.floor((timeLeft % 86400) / 3600)}:{" "}
          {Math.floor((timeLeft % 3600) / 60) < 10 ? "0" : ""}{" "}
          {Math.floor((timeLeft % 3600) / 60)}: {timeLeft % 60 < 10 ? "0" : ""}
          {timeLeft % 60}
        </p>
      </div>
    </Link>
  );
}
