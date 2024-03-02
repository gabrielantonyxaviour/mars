import { explorers } from "@/utils/constants";
import {
  faArrowUpRightFromSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useState } from "react";

export default function TransactionStatusOrder({
  sourceTransactionHash,
  destinationChainId,
  transactionConfirmed,
  orderId,
}: {
  destinationChainId: string;
  sourceTransactionHash: string;
  transactionConfirmed: boolean;
  orderId: string;
}) {
  const [destinationTransactionHash, setDestinationTransactionHash] =
    useState("");
  const [destinationTransactionConfirmed, setDestinationTransactionConfirmed] =
    useState(false);
  const [callbackTransactionHash, setCallbackTransactionHash] = useState("");
  const [callbackTransactionConfirmed, setCallbackTransactionConfirmed] =
    useState(false);
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
              <div
                className={`border-b border-dashed ${
                  destinationTransactionConfirmed
                    ? "border-[#00B418]"
                    : "border-[#F0DE00]"
                } my-auto flex-1 mx-6`}
              ></div>
              <div>
                <Image
                  src={`/chains/${destinationChainId}.png`}
                  height={100}
                  width={100}
                  alt={destinationChainId}
                  className="my-auto mx-auto"
                />
                <p className="text-[#a9a9a9] font-semibold text-center mt-2 text-sm">
                  {destinationTransactionConfirmed
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
          <div
            className={`border-b border-dashed ${
              callbackTransactionConfirmed
                ? "border-[#00B418]"
                : "border-[#F0DE00]"
            } my-auto flex-1 mx-6`}
          ></div>
          {destinationChainId != "1287" && (
            <div>
              <Image
                src={"/chains/1287.png"}
                height={100}
                width={100}
                alt="moonbase"
                className="m-auto"
              />
              <p className="text-[#a9a9a9] font-semibold text-center mt-2 text-sm">
                {callbackTransactionConfirmed ? "Confirm ✔️" : "Pending ⏳"}
              </p>
              {callbackTransactionHash != "" && (
                <a
                  className="text-xs text-[#9c9e9e] "
                  href={
                    "https://moonbase.moonscan.io/tx/" + callbackTransactionHash
                  }
                  target={"_blank"}
                >
                  {callbackTransactionHash.substring(0, 8) +
                    "...." +
                    callbackTransactionHash.substring(
                      callbackTransactionHash.length - 8
                    )}
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    className="ml-2"
                  />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
}
