import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
export default function OriginDropdown({ count }: { count: any }) {
  const [origin, setOrigin] = useState("");
  const [originDropdown, setOriginDropdown] = useState(false);
  return (
    <>
      <button
        className="text-white font-semibold text-xl text-left flex justify-between my-6 mx-1"
        onClick={() => {
          if (originDropdown) setOriginDropdown(false);
          else setOriginDropdown(true);
        }}
      >
        <p>Origin</p>
        <FontAwesomeIcon
          icon={faChevronDown}
          size="xs"
          className="my-auto"
          flip={originDropdown ? "vertical" : "horizontal"}
        ></FontAwesomeIcon>
      </button>
      {originDropdown && (
        <div className="flex flex-col">
          <button
            className={`flex mx-2 mb-2 text-left py-2 px-2 rounded-lg ${
              origin == "venus" ? "bg-[#d0d1d1] text-black" : "text-white"
            }`}
            onClick={() => {
              if (origin == "venus") {
                setOrigin("");
              } else {
                setOrigin("venus");
              }
            }}
          >
            <Image
              src={"/logo.png"}
              height={35}
              width={35}
              alt="punk"
              className="rounded-lg "
            />
            <p className="flex-1 ml-3 font-semibold text-lg my-auto">Venus</p>
            <p className=" text-lg font-semibold my-auto">{count.venus}</p>
          </button>
          <button
            className={`flex mx-2 mb-2 text-left py-2 px-2 rounded-lg ${
              origin == "external" ? "bg-[#d0d1d1] text-black" : "text-white"
            }`}
            onClick={() => {
              if (origin == "external") {
                setOrigin("");
              } else {
                setOrigin("external");
              }
            }}
          >
            <Image
              src={"/block.png"}
              height={35}
              width={35}
              alt="external"
              className="rounded-lg"
            />
            <p className="flex-1 ml-3 font-semibold  text-lg my-auto">
              External
            </p>
            <p className=" text-lg font-semibold my-auto">{count.external}</p>
          </button>
        </div>
      )}
    </>
  );
}
