import {
  venusMoonbaseNftAbi,
  venusMoonbaseNftAddress,
} from "@/utils/constants";
import axios from "axios";
import React from "react";
import { createPublicClient, http } from "viem";
import { moonbaseAlpha } from "viem/chains";
import { useAccount, useWriteContract } from "wagmi";

export default function GenerateButton({
  setCount,
  setMessageId,
  messageId,
  mintFee,
  selectedChain,
  setTransactionConfirmed,
  publicClient,
  setFetchTime,
  index,
  setChooseImage,
  setTxHash,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setMessageId: React.Dispatch<React.SetStateAction<string>>;
  setTransactionConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  messageId: string;
  publicClient: any;
  mintFee: bigint;
  selectedChain: string;
  setFetchTime: React.Dispatch<React.SetStateAction<number>>;
  index: string;
  setChooseImage: React.Dispatch<React.SetStateAction<string>>;
  setTxHash: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { writeContractAsync: mintNft } = useWriteContract();
  const { address } = useAccount();

  return (
    <button
      className="bg-[#25272b] mx-2 my-2 py-2 px-6 rounded-lg"
      onClick={async () => {
        setCount(3);

        const res = await fetch("/api/midjourney/upscale", {
          method: "POST",
          body: JSON.stringify({
            task_id: messageId,
            index,
          }),
        });
        const { task_id } = await res.json();
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

        const metadata = {
          name: "NFT Artwork",
          description:
            "A unique digital artwork stored on the blockchain as an NFT.",
          image: fetchedImage.task_result.image_url,
          attributes: [],
          external_url: "https://venus-nine.vercel.app/",
          background_color: "FFFFFF",
        };

        const resData = await axios.post("/api/pinata/json", metadata, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const unwatch = publicClient.watchContractEvent({
          address: venusMoonbaseNftAddress,
          abi: venusMoonbaseNftAbi,
          onLogs: async (logs: any) => {
            console.log("Logged!");
            setCount(4);
            setTransactionConfirmed(true);
          },
        });
        setMessageId("");

        const tx = await mintNft({
          address: venusMoonbaseNftAddress,
          abi: venusMoonbaseNftAbi,
          functionName: "mintImportNft",
          args: [address, resData.data.IpfsHash, "0x", selectedChain, "200000"],
          value: mintFee,
        });

        setTxHash(tx);
      }}
    >
      <p>
        {index == "1" ? "↖️" : index == "2" ? "↗️" : index == "3" ? "↙️" : "↘️"}
      </p>
    </button>
  );
}
