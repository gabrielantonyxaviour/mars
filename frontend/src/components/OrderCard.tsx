import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";

export default function OrderCard({
  image,
  orderId,
  chainId,
  createdAt,
  status,
  mode,
  size,
}: {
  image: string;
  chainId: string;
  orderId: string;
  createdAt: string;
  mode: string;
  status: string;
  size: number;
}) {
  const { chain } = useNetwork();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (status === "COMPLETED") return;
    let timerTemp = 0;
    const intervalId = setInterval(() => {
      timerTemp =
        Math.floor(Date.now() / 1000) -
        Math.floor(new Date(createdAt).getTime() / 1000);
      console.log(timerTemp);
      setTimer(timerTemp);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <Link
      href={"/orders/" + orderId}
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
          <p className="text-center">Status</p>
          <p className="text-center">{status}</p>
        </div>
      </div>

      <div className="rounded-lg  bg-[#25272b] text-center  ">
        <p className="text-sm font-semibold p-2 text-[#9c9e9e]">
          Epoch {Math.floor(timer / 86400)} Days,{"  "}
          {Math.floor((timer % 86400) / 3600) < 10 ? "0" : ""}
          {Math.floor((timer % 86400) / 3600)}:{" "}
          {Math.floor((timer % 3600) / 60) < 10 ? "0" : ""}{" "}
          {Math.floor((timer % 3600) / 60)}: {timer % 60 < 10 ? "0" : ""}
          {timer % 60}
        </p>
      </div>
    </Link>
  );
}
