// components/Navbar.tsx

import Link from "next/link";
import Logo from "../Logo";
import NavItems from "./NavItems";
import { useState } from "react";
import NavItem from "./NavItem";
import {
  faBars,
  faBoltLightning,
  faChevronDown,
  faChevronUp,
  faHammer,
  faHeart,
  faImage,
  faTree,
} from "@fortawesome/free-solid-svg-icons";
import useWindowSize from "@/hooks/useWindowSize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Navbar: React.FC = () => {
  const { width, height } = useWindowSize();
  const [search, setSearch] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const options = ["Option 1", "Option 2", "Option 3"];

  return (
    <div className="w-full flex justify-between ">
      <div className="flex">
        <Logo />
        <input
          type="text"
          placeholder={
            width > 1860
              ? "Search for NFTs, Relationships and Family Trees"
              : "Search"
          }
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="font-theme font-semibold placeholder:text-[#6c6f70] text-md placeholder:text-sm bg-[#25272b] my-1 pl-6 text-white p-2 rounded-xl focus:outline-none  focus:border-black w-[30%] desktop:w-[50%]  flex-shrink-0 mr-2"
        />
        <NavItem
          content={"Create"}
          link={"/create"}
          icon={faHammer}
          isDropdown={false}
        />
        <NavItem
          content={"NFTs"}
          link={"/nfts"}
          icon={faImage}
          isDropdown={false}
        />
        <NavItem
          content={"Relationships"}
          link={"/relations"}
          icon={faHeart}
          isDropdown={false}
        />

        <NavItem
          content={"Trees"}
          link={"/trees"}
          icon={faTree}
          isDropdown={false}
        />

        <NavItem
          content={"Powerups"}
          link={"/powerups"}
          icon={faBoltLightning}
          isDropdown={false}
        />
        <button
          className="flex desktop:hidden  items-center justify-center rounded-lg  px-3 mx-2 my-1 py-1 relative z-10"
          onClick={() => {
            setDropdown(dropdown ? false : true);
          }}
        >
          <FontAwesomeIcon
            icon={faBars}
            className=" text-[#9c9e9e] text-md font-bold mr-2"
          />
          <p className="font-theme text-[#9c9e9e] text-md font-bold">
            {"Menu"}
          </p>
          <FontAwesomeIcon
            icon={dropdown ? faChevronUp : faChevronDown}
            className=" text-[#9c9e9e] text-md font-bold mx-2 "
          />
          {dropdown && (
            <div className="absolute right-0 mt-2 top-10  w-56 rounded-md shadow-lg bg-[#25272b] ring-1 ring-black ring-opacity-5  z-20 ">
              <div className="py-1">
                <NavItem
                  content={"Create"}
                  link={"/create"}
                  icon={faHammer}
                  isDropdown={true}
                />
                <NavItem
                  content={"NFTs"}
                  link={"/nfts"}
                  icon={faImage}
                  isDropdown={true}
                />
                <NavItem
                  content={"Relationships"}
                  link={"/relations"}
                  icon={faHeart}
                  isDropdown={true}
                />

                <NavItem
                  content={"Trees"}
                  link={"/trees"}
                  icon={faTree}
                  isDropdown={true}
                />
                <NavItem
                  content={"Powerups"}
                  link={"/powerups"}
                  icon={faBoltLightning}
                  isDropdown={true}
                />
              </div>
            </div>
          )}
        </button>
      </div>
      <NavItems />
    </div>
  );
};

export default Navbar;
