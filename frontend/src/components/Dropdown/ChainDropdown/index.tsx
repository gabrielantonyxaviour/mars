import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ChainComponent from "./ChainComponent";

export default function ChainDropdown({ count }: { count: any }) {
  const [chain, setChain] = useState("");
  const [chainDropdown, setChainDropdown] = useState(false);
  return (
    <>
      <button
        className="text-white font-semibold text-xl text-left flex justify-between my-6 mx-1"
        onClick={() => {
          if (chainDropdown) setChainDropdown(false);
          else setChainDropdown(true);
        }}
      >
        <p>Chain</p>
        <FontAwesomeIcon
          icon={faChevronDown}
          size="xs"
          className="my-auto"
          flip={chainDropdown ? "vertical" : "horizontal"}
        ></FontAwesomeIcon>
      </button>
      {chainDropdown && (
        <div className="flex flex-col">
          <ChainComponent
            chainId={"1287"}
            currentChain={chain}
            chainName="Moonbase"
            setChain={setChain}
            count={count.moonbeam}
          />
          <ChainComponent
            chainId="11155111"
            currentChain={chain}
            chainName="Ethereum"
            setChain={setChain}
            count={count.ethereum}
          />
          <ChainComponent
            chainId="80001"
            currentChain={chain}
            chainName="Polygon"
            setChain={setChain}
            count={count.polygon}
          />
          <ChainComponent
            chainId="421614"
            currentChain={chain}
            chainName="Arbitrum"
            setChain={setChain}
            count={count.arbitrum}
          />
          <ChainComponent
            chainId="59140"
            currentChain={chain}
            chainName="Linea"
            setChain={setChain}
            count={count.linea}
          />
          <ChainComponent
            chainId="48899"
            currentChain={chain}
            chainName="Zircuit"
            setChain={setChain}
            count={count.zircuit}
          />
          <ChainComponent
            chainId="84532"
            currentChain={chain}
            chainName="Base"
            setChain={setChain}
            count={count.base}
          />
          <ChainComponent
            chainId="2424"
            currentChain={chain}
            chainName="Injective"
            setChain={setChain}
            count={count.injective}
          />
        </div>
      )}
    </>
  );
}
