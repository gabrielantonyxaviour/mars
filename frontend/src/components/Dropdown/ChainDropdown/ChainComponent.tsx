import Image from "next/image";
import React from "react";

export default function ChainComponent({
  chain,
  currentChain,
  chainName,
  setChain,
  count,
}: {
  chain: string;
  currentChain: string;
  chainName: string;
  count: number;
  setChain: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <button
      className={`flex mx-2 mb-2 text-left py-2 px-2 rounded-lg ${
        chain == currentChain ? "bg-[#d0d1d1] text-black" : "text-white"
      }`}
      onClick={() => {
        setChain(chain == currentChain ? "" : chain);
      }}
    >
      <Image
        src={`/chains/${chain}.png`}
        height={35}
        width={35}
        alt="punk"
        className="rounded-lg "
      />
      <p className="flex-1 ml-3 font-semibold text-lg my-auto">{chainName}</p>
      <p className=" text-lg font-semibold my-auto">10</p>
    </button>
  );
}
