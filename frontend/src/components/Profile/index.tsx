import Image from "next/image";
import Dropdown from "../Dropdown";
import { shortenEthereumAddress } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import NFTCard from "../NFTCard";
import ListingCard from "../ListingCard";
import axios from "axios";

export default function Profile(props: { address: string }) {
  const { address } = props;
  const { chain } = useAccount();
  const [selected, setSelected] = useState(0);
  const [ownedNfts, setOwnedNfts] = useState([]);

  useEffect(() => {
    (async function () {
      console.log("FETCHING NFTS");
      console.log(address);
      const nfts = await axios.post(
        "/api/drpc/get-nfts-by-owner",
        JSON.stringify({
          owner: address,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(nfts.data.data);
      setOwnedNfts(nfts.data.data);
    })();
    console.log(address);
  }, [address]);
  return (
    <div className="flex flex-col justify-start min-h-[90vh]  ">
      <Image
        src={"/cover.gif"}
        width={1000}
        height={600}
        alt="cover"
        style={{
          backgroundImage: 'url("/cover.gif")',
          backgroundSize: "cover",
        }}
        className="bg-[#25272b] w-full h-[35vh] mt-10 rounded-2xl"
      />
      <div className="relative">
        <div className="absolute bottom-24 left-10 w-full h-full">
          <Image
            src={"/chains/1287.png"}
            width={150}
            height={150}
            alt="pfp"
            className="rounded-full bg-[#28385a] "
          ></Image>
        </div>
        <div className="mt-20 ml-10">
          <p className=" font-semibold text-4xl ">John Doe</p>
          <Link
            href={"https://etherscan.io/address/" + address}
            target="_blank"
            className="mt-1 ml-1 tracking-wide font-semibold text-[#9c9e9e]"
          >
            {shortenEthereumAddress(address)} &nbsp;
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </Link>
        </div>
      </div>
      <div className="flex mt-16">
        <button
          onClick={() => {
            setSelected(0);
          }}
          className={`mx-2  ${
            selected == 0
              ? "bg-[#d0d1d1] text-black"
              : "hover:bg-[#25272b] text-white "
          } p-2 rounded-md font-semibold `}
        >
          NFTs
        </button>
        <button
          onClick={() => {
            setSelected(1);
          }}
          className={`mx-2  ${
            selected == 1
              ? "bg-[#d0d1d1] text-black"
              : "hover:bg-[#25272b] text-white "
          } p-2 rounded-md font-semibold `}
        >
          Listings
        </button>
      </div>
      <div className="mx-6 h-[1px] bg-[#3c3f41] mt-6"></div>
      <div className="flex justify-between mt-10">
        <div className="w-[25%]">
          <Dropdown
            originCount={{
              venus: 10,
              imported: 10,
            }}
            chainCount={{
              1287: 10,
              11155111: 10,
              80001: 10,
              421614: 10,
              59140: 10,
              48899: 10,
              84532: 2,
              2424: 4,
            }}
          />
        </div>
        <div>
          <div className={`grid grid-cols-5 gap-3 mx-8`}>
            {selected == 0 &&
              ownedNfts != undefined &&
              ownedNfts.length > 0 &&
              ownedNfts.map((ownedNft: any) => (
                <NFTCard
                  tokenAddress={ownedNft.address}
                  tokenId={ownedNft.tokenId}
                  chainId={ownedNft.chainId}
                  mode={ownedNft.internal ? "create 🪄" : "external 🌐"}
                  size={300}
                />
              ))}
            {/* {selected == 1 && (
              <ListingCard
                image={
                  "https://img.midjourneyapi.xyz/mj/9be0aacb-8978-4c82-88fb-495dee1efe41.png"
                }
                listingId={"3"}
                chainId={"2424"}
                createdAt="2024-02-28 15:45:36.180961+00"
                validity={900000}
                price="21"
                mode={"create 🪄"}
                size={300}
              />
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

// nft1,
// nft2,
// relationship,
