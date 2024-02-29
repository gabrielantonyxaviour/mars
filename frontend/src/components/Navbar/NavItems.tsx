import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavItem from "./NavItem";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import useWindowSize from "@/hooks/useWindowSize";
const NavItems: React.FC = () => {
  const { width } = useWindowSize();
  return (
    <div className="flex ">
      <ConnectButton />
      <Link
        href={"/profile"}
        className=" rounded-full bg-[#1a1a1e] flex justify-center items-center my-auto ml-3 p-3"
      >
        <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
      </Link>
    </div>
  );
};

export default NavItems;
