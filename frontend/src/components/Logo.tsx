import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"} className="flex cursor-pointer">
      <Image
        src="/logo.png"
        width={35}
        height={35}
        alt="logo"
        className="my-auto  mr-2"
      />
      <p className="font-noun font-logo font-light text-white text-3xl tracking-wider ml-1 my-auto mr-14">
        Venus
      </p>
    </Link>
  );
}
