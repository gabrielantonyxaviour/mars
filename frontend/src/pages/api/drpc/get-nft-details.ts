import { DRPC_BASE_URL } from "@/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tokenAddress, tokenId } = req.body;
  console.log("\n=====================");
  const response = await fetch(
    `${DRPC_BASE_URL}/api/nft/${tokenAddress}/${tokenId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const responseData = await response.json();
  console.log("\n=====================");
  console.log("GET NFTS BY OWNER DATA");
  console.log(responseData);
  console.log("=====================");

  res.status(200).send(responseData);
}
