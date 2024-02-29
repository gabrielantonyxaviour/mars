// components/Navbar.tsx

import Link from "next/link";
import Logo from "../Logo";
import NavItems from "./NavItems";
import { useState } from "react";
import NavItem from "./NavItem";
import { faHammer, faList } from "@fortawesome/free-solid-svg-icons";
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
          content={"Listings"}
          link={"/listings"}
          icon={faList}
          isDropdown={false}
        />
      </div>
      <NavItems />
    </div>
  );
};

export default Navbar;
