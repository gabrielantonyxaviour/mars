import { DRPC_BASE_URL } from "@/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { orderId } = req.body;
  const response = await fetch(`${DRPC_BASE_URL}/api/order/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();
  console.log("\n=====================");
  console.log("GET CREATE TX DATA");
  console.log(responseData.data);
  console.log("=====================");

  res.status(200).send(responseData.data);
}
