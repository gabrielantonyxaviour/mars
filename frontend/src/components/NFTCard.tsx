import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function NFTCard({
  image,
  chainId,
  tokenAddress,
  tokenId,
  mode,
  size,
}: {
  image: string;
  tokenAddress: string;
  tokenId: string;
  chainId: string;
  mode: string;
  size: number;
}) {
  const { chain } = useAccount();

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
