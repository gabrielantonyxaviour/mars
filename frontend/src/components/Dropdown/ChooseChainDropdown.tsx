import { chains } from "@/utils/constants";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

export default function ChooseChainDropdown({
  options,
  setOption,
  selectedOption,
}: {
  options: string[];
  setOption: (option: string) => void;
  selectedOption: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          className={`flex mx-2 mb-2 text-left py-2 px-2 rounded-lg
                 text-white w-full border border-[1px] border-[#5F5F5F] hover:border-[#a9a9a9]
              `}
          onClick={() => {
            toggleDropdown();
          }}
        >
          <Image
            src={`/chains/${selectedOption}.png`}
            height={35}
            width={35}
            alt="punk"
            className="rounded-lg "
          />
          <p className="flex-1 ml-3 font-semibold text-lg my-auto">
            {chains[selectedOption]}
          </p>
          <div className="flex-1 flex my-auto justify-end px-4">
            <FontAwesomeIcon
              icon={isOpen ? faChevronUp : faChevronDown}
              className="text-white"
            />
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-left absolute left-0  w-full rounded-md shadow-lg bg-[#1E1A20] ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                className={`flex mx-2 mb-2 text-left py-2 px-2 rounded-lg
                 text-white w-full hover:bg-[#00A0BD] 
              `}
                onClick={() => {
                  setOption(option);
                  toggleDropdown();
                }}
              >
                <Image
                  src={`/chains/${option}.png`}
                  height={35}
                  width={35}
                  alt="punk"
                  className="rounded-lg "
                />
                <p className="flex-1 ml-3 font-semibold text-lg my-auto">
                  {chains[option]}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
