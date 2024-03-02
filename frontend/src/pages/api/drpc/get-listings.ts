import { DRPC_BASE_URL } from "@/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(`${DRPC_BASE_URL}/api/listings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  console.log("\n=====================");
  console.log("GET ALL LISTINGS DATA");
  console.log(responseData);
  console.log("=====================");

  res.status(200).send(responseData);
}
