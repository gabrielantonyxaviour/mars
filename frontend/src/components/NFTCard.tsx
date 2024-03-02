import { nftContractAbi } from "@/utils/constants";
import resolveChain from "@/utils/resolveChain";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPublicClient, getContract, http } from "viem";

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
    (async function () {
      try {
        console.log("NFTCard");
        console.log(tokenId);
        console.log(chainId);
        const resTokenUri = await contract.read.tokenURI([tokenId]);
        console.log(resTokenUri);
        const metadata = await fetch(resTokenUri as string);
        const metadataJson = await metadata.json();
        const _image = metadataJson.image;
        setImage(_image);
      } catch (e) {
        setImage(
          "https://silver-absolute-wren-28.mypinata.cloud/ipfs/QmPbFa12vQjYiy9E1G7SQskVvFNgyxcJnwiMjHSNABWzYk"
        );
      }
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
