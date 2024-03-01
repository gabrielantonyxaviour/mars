import Dropdown from "@/components/Dropdown";
import Layout from "@/components/Layout";
import ListingCard from "@/components/ListingCard";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

export default function ListingPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(true);
  const [nfts, setNfts] = useState([]);
  const { chain } = useNetwork();

  return (
    <Layout>
      <div className="min-h-[90vh] mt-20">
        <div className="flex font-theme ">
          <div className="flex w-full">
            <button
              className={`${
                filters
                  ? "bg-[#d0d1d1] text-black"
                  : "bg-[#25272b] text-[#d0d1d1] hover:bg-[#303238]"
              } flex p-3 rounded-lg  `}
              onClick={async () => {
                setFilters(!filters);
              }}
            >
              <FontAwesomeIcon
                icon={faFilter}
                className="my-auto"
              ></FontAwesomeIcon>
              <p className="font-semibold pl-3">Filters</p>
            </button>
            <input
              type="text"
              placeholder={"Search by NFTs"}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="font-theme mx-5 placeholder:font-black font-bold placeholder:text-[#6c6f70] text-md  placeholder:text-md bg-[#25272b] pl-6 text-white  rounded-lg focus:outline-none  focus:border-black w-[50%] flex-1 "
            />
          </div>
        </div>

        <div className="flex justify-between mt-10">
          {filters && (
            <div className="w-[30%]">
              <Dropdown
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
                originCount={{
                  venus: 10,
                  imported: 10,
                }}
              />
            </div>
          )}
          <div>
            <div
              className={`grid ${
                filters
                  ? "grid-cols-4 desktop:grid-cols-5"
                  : "grid-cols-5 desktop:grid-cols-6"
              } gap-3 mx-8`}
            >
              <ListingCard
                key={1}
                image={
                  "https://img.midjourneyapi.xyz/mj/9be0aacb-8978-4c82-88fb-495dee1efe41.png"
                }
                listingId="1"
                createdAt="2024-02-28 15:45:36.180961+00"
                validity={900000}
                price="21"
                chainId="80001"
                mode={"create 🪄"}
                size={300}
              />
              <ListingCard
                key={2}
                image={
                  "https://img.midjourneyapi.xyz/mj/9be0aacb-8978-4c82-88fb-495dee1efe41.png"
                }
                listingId="2"
                createdAt="2024-02-28 15:45:36.180961+00"
                validity={900000}
                price="3"
                chainId="421614"
                mode={"external 🌐"}
                size={300}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
