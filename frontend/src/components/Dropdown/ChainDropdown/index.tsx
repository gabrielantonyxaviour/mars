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
            chain="moonbeam"
            currentChain={chain}
            chainName="Moonbase"
            setChain={setChain}
            count={count.moonbeam}
          />
          <ChainComponent
            chain="ethereum"
            currentChain={chain}
            chainName="Ethereum"
            setChain={setChain}
            count={count.ethereum}
          />
          <ChainComponent
            chain="polygon"
            currentChain={chain}
            chainName="Polygon"
            setChain={setChain}
            count={count.polygon}
          />
          <ChainComponent
            chain="arbitrum"
            currentChain={chain}
            chainName="Arbitrum"
            setChain={setChain}
            count={count.arbitrum}
          />
          <ChainComponent
            chain="linea"
            currentChain={chain}
            chainName="Linea"
            setChain={setChain}
            count={count.linea}
          />
          <ChainComponent
            chain="zircuit"
            currentChain={chain}
            chainName="Zircuit"
            setChain={setChain}
            count={count.zircuit}
          />
          <ChainComponent
            chain="base"
            currentChain={chain}
            chainName="Base"
            setChain={setChain}
            count={count.base}
          />
          <ChainComponent
            chain="injective"
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
