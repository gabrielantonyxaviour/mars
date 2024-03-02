import { nftContractAbi } from "@/utils/constants";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";
import {
  arbitrumSepolia,
  baseSepolia,
  moonbaseAlpha,
  polygonMumbai,
  sepolia,
} from "viem/chains";
import { useAccount } from "wagmi";

function resolveChain(chainId: string) {
  if (chainId == "1287") return moonbaseAlpha;
  else if (chainId == "80001") return polygonMumbai;
  else if (chainId == "11155111") return sepolia;
  else if (chainId == "84532") return baseSepolia;
  else return arbitrumSepolia;
}
export default function NFTCard({
  chainId,
  tokenAddress,
  tokenId,
  mode,
  size,
}: {
  tokenAddress: string;
  tokenId: string;
  chainId: string;
  mode: string;
  size: number;
}) {
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
    console.log(tokenId);
    (async function () {
      console.log("NFTCard");

      const resTokenUri = await contract.read.tokenURI([2]);
      console.log(resTokenUri);
      const metadata = await fetch(resTokenUri as string);
      const metadataJson = await metadata.json();
      const _image = metadataJson.image;
      setImage(_image);
    })();
  }, []);

  return (
    <Link
      href={"/nft/" + tokenAddress + "-" + tokenId}
      className={`border-[1px] border-[#3c3f41] p-2 rounded-lg font-theme bg-black`}
    >
      <Image
        src={image}
        width={size}
        height={size}
        alt="logo"
        className="bg-white rounded-lg"
      />

      <div className="flex justify-around m-2">
        <p className="text-[#CCCCCC] font-semibold text-sm my-auto mx-2 text-center">
          {mode}
        </p>
        <Image
          src={`/chains/${chainId}.png`}
          width={30}
          height={300}
          alt="chain_logo"
          className="my-auto"
        />
      </div>
    </Link>
  );
}
