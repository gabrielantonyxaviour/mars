import { explorers } from "@/utils/constants";
import {
  faArrowUpRightFromSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function TransactionStatusCreate({
  sourceTransactionHash,
  destinationChainId,
  transactionConfirmed,
}: {
  destinationChainId: string;
  sourceTransactionHash: string;
  transactionConfirmed: boolean;
}) {
  const [destinationTransactionHash, setDestinationTransactionHash] =
    useState("");
  const { address } = useAccount();

  useEffect(() => {
    (async function fetchS() {
      console.log(destinationChainId);
      if (destinationChainId != "1287") {
        console.log("HELLO");
        const interval = setInterval(async () => {
          const posRes = await axios.post(
            "/api/drpc/get-create-tx",
            {
              chainId: destinationChainId,
              minter: address,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (posRes.data != null) {
            console.log(
              "Destination Transaction Hash: ",
              posRes.data[0].transactionHash
            );
            setDestinationTransactionHash(posRes.data[0].transactionHash);
          }
        }, 5000);
        return () => clearInterval(interval);
      }
    })();
  }, [destinationChainId]);

  return (
    sourceTransactionHash != "" && (
      <div className="w-[70%] mx-auto">
        <p className="text-center font-bold text-xl">Transaction Status</p>
        <div className="flex justify-between mt-4">
          <FontAwesomeIcon
            icon={faUser}
            className="text-5xl my-auto text-[#201c1c] bg-white p-6 rounded-full"
          />
          <div
            className={`border-b border-dashed ${
              transactionConfirmed ? "border-[#00B418]" : "border-[#F0DE00]"
            } my-auto flex-1 mx-6`}
          ></div>
          <div>
            <Image
              src={"/chains/1287.png"}
              height={100}
              width={100}
              alt="moonbase"
              className="m-auto"
            />
            <p className="text-[#a9a9a9] font-semibold text-center mt-2 text-sm">
              {transactionConfirmed ? "Confirm ✔️" : "Pending ⏳"}
            </p>
            <a
              className="text-xs text-[#9c9e9e] "
              href={"https://moonbase.moonscan.io/tx/" + sourceTransactionHash}
              target={"_blank"}
            >
              {sourceTransactionHash.substring(0, 8) +
                "...." +
                sourceTransactionHash.substring(
                  sourceTransactionHash.length - 8
                )}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="ml-2"
              />
            </a>
          </div>

          {destinationChainId != "1287" && (
            <>
              <div className="my-auto flex-1 ">
                <div className="flex justify-center pb-2">
                  <a
                    className="text-xs text-[#9c9e9e] text-center w-full"
                    href={
                      "https://wormholescan.io/#/tx/" + sourceTransactionHash
                    }
                    target={"_blank"}
                  >
                    WormholeScan{" "}
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="ml-2"
                    />
                  </a>
                </div>

                <div
                  className={`border-b border-dashed ${
                    destinationTransactionHash != ""
                      ? "border-[#00B418]"
                      : "border-[#F0DE00]"
                  } mx-6`}
                ></div>
              </div>
              <div>
                <Image
                  src={`/chains/${destinationChainId}.png`}
                  height={100}
                  width={100}
                  alt={destinationChainId}
                  className="my-auto"
                />
                <p className="text-[#a9a9a9] font-semibold text-center mt-2 text-sm">
                  {destinationTransactionHash != ""
                    ? "Confirm ✔️"
                    : "Pending ⏳"}
                </p>
                {destinationTransactionHash != "" && (
                  <a
                    className="text-xs text-[#9c9e9e] "
                    href={
                      "https://" +
                      explorers[destinationChainId] +
                      "/tx/" +
                      destinationTransactionHash
                    }
                    target={"_blank"}
                  >
                    {destinationTransactionHash.substring(0, 8) +
                      "...." +
                      destinationTransactionHash.substring(
                        destinationTransactionHash.length - 8
                      )}
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="ml-2"
                    />
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
}
