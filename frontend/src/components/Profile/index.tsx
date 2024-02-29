import Image from "next/image";
import Dropdown from "../Dropdown";
import { shortenEthereumAddress } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
// import NFTCard from "./NFTCard";
// import getNftsByOwner from "@/utils/supabase/get-nfts-by-owner";
// import resolveRarity from "@/utils/resolveRarity";
// import getRelationshipsByCreator from "@/utils/supabase/get-relationships-by-creator";
// import RelationshipCard from "./RelationshipCard";
import { useNetwork } from "wagmi";
// import getNft from "@/utils/supabase/get-nft";
// import TreeCard from "./TreeCard";

export default function Profile(props: { address: string }) {
  const { address } = props;
  const { chain } = useNetwork();
  const [selected, setSelected] = useState(0);
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [relationships, setRelationships] = useState([]);
  // const [familyTrees, setFamilyTrees] = useState([]);
  // const [powerups, setPowerups] = useState([]);

  const sampleProfile = {
    wallet: address,
    name: "Bob",
    image: "https://picsum.photos/500/500",
    cover: "https://picsum.photos/800/300",
    description: "Hey there! I'm new to ZexCraft!",
  };

  //   useEffect(() => {}, []);

  //   useEffect(() => {
  //     (async function () {
  //       console.log(chain?.id);
  //       const nfts = await getNftsByOwner({
  //         address: address,
  //         chainId: (chain?.id as number).toString(),
  //       });
  //       console.log(nfts.response);
  //       setOwnedNfts(nfts.response as any);
  //     })();
  //     console.log("Owned NFTs");
  //     console.log(ownedNfts);

  //     (async function () {
  //       let rels = await getRelationshipsByCreator({
  //         chainId: (chain?.id as number).toString(),
  //         actual_parent: address,
  //       });
  //       if (rels.response != null) {
  //         for (let i = 0; i < rels.response.length; i++) {
  //           const parent1 = await getNft({
  //             address: rels.response[i].parent1,
  //             chainId: (chain?.id as number).toString(),
  //           });
  //           const parent2 = await getNft({
  //             address: rels.response[i].parent2,
  //             chainId: (chain?.id as number).toString(),
  //           });
  //           rels.response[i].parent1 = parent1.response;
  //           rels.response[i].parent2 = parent2.response;
  //         }
  //         setRelationships(rels.response as any);
  //       }
  //     })();
  //   }, [address]);
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
            src={"/chains/moonbeam.png"}
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
        <button
          onClick={() => {
            setSelected(2);
          }}
          className={`mx-2  ${
            selected == 2
              ? "bg-[#d0d1d1] text-black"
              : "hover:bg-[#25272b] text-white "
          } p-2 rounded-md font-semibold `}
        >
          Orders
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
              moonbeam: 10,
              ethereum: 10,
              polygon: 10,
              arbitrum: 10,
              linea: 10,
              zircuit: 10,
            }}
          />
        </div>
        {/* <div>
          <div className={`grid grid-cols-5 gap-3 mx-8`}>
            {selected == 0 &&
              ownedNfts.length > 0 &&
              ownedNfts.map((nft: any) => {
                return (
                  <NFTCard
                    image={nft.image}
                    imageAlt={nft.image_alt}
                    owner={nft.parent}
                    address={nft.contract_address}
                    rarity={resolveRarity(nft.rarity)}
                    tokenId={nft.token_id}
                    mode={nft.type == 0 ? "create ✨" : "breed ❤️"}
                    size={300}
                  />
                );
              })}
            {selected == 1 &&
              relationships &&
              relationships.length > 0 &&
              relationships.map((rel: any) => {
                return (
                  <RelationshipCard
                    nft1={{
                      image: rel.parent1.image,
                      rarity: rel.parent1.rarity,
                      mode: rel.parent1.type == 0 ? "create ✨" : "breed ❤️",
                      tokenId: rel.parent1.token_id,
                    }}
                    nft2={{
                      image: rel.parent2.image,
                      rarity: rel.parent2.rarity,
                      mode: rel.parent2.type == 0 ? "create ✨" : "breed ❤️",
                      tokenId: rel.parent2.token_id,
                    }}
                    relationship={rel.relationship}
                  />
                );
              })}
            {selected == 2 &&
              relationships &&
              relationships.length > 0 &&
              relationships.map((rel: any) => {
                return (
                  <TreeCard
                    nft1={rel.parent1.image}
                    family="Bored Ape"
                    race="BAYC/PUNK"
                    count="1"
                    nft2={rel.parent2.image}
                  />
                );
              })}
          </div>
        </div> */}
      </div>
    </div>
  );
}

// nft1,
// nft2,
// relationship,
