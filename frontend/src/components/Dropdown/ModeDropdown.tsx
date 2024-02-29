import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

export default function ModeDropdown() {
  const [mode, setMode] = useState("all");
  const [modeDropdown, setModeDropdown] = useState(false);
  return (
    <>
      <button
        className="text-white font-semibold text-xl text-left flex justify-between my-6 mx-1"
        onClick={() => {
          if (modeDropdown) setModeDropdown(false);
          else setModeDropdown(true);
        }}
      >
        <p>Mode</p>
        <FontAwesomeIcon
          icon={faChevronDown}
          size="xs"
          className="my-auto"
          flip={modeDropdown ? "vertical" : "horizontal"}
        ></FontAwesomeIcon>
      </button>
      {modeDropdown && (
        <div className="flex justify-around bg-[#25272b]  text-white rounded-xl my-3">
          <button
            className={
              mode == "all"
                ? `bg-[#d0d1d1] text-black w-full h-full p-3 flex justify-center rounded-xl`
                : `w-full h-full p-3 flex justify-center rounded-xl`
            }
            onClick={() => {
              setMode("all");
            }}
          >
            <p className=" font-semibold text-md">All</p>
          </button>
          <button
            className={
              mode == "upload"
                ? `bg-[#d0d1d1] text-black w-full h-full p-3 flex justify-center rounded-xl`
                : `w-full h-full p-3 flex justify-center rounded-xl`
            }
            onClick={() => {
              setMode("upload");
            }}
          >
            <p className=" font-semibold text-md">Upload</p>
          </button>
          <button
            className={
              mode == "gen"
                ? `bg-[#d0d1d1] text-black w-full h-full p-3 flex justify-center rounded-xl`
                : `w-full h-full p-3 flex justify-center rounded-xl`
            }
            onClick={() => {
              setMode("gen");
            }}
          >
            <p className=" font-semibold text-md">Gen</p>
          </button>
          <button
            className={
              mode == "import"
                ? `bg-[#d0d1d1] text-black w-full h-full p-3 flex justify-center rounded-xl`
                : `w-full h-full p-3 flex justify-center rounded-xl`
            }
            onClick={() => {
              setMode("import");
            }}
          >
            <p className=" font-semibold text-md">Import</p>
          </button>
        </div>
      )}
    </>
  );
}
