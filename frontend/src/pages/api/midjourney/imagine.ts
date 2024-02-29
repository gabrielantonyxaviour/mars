import { MIDJOURNEY_BASE_URL } from "@/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { prompt } = JSON.parse(req.body);
  const imageRes = await fetch(`${MIDJOURNEY_BASE_URL}/imagine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": `${process.env.NEXT_PUBLIC_MIDJOURNEY_API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      process_mode: "relax",
    }),
  });

  const { task_id } = await imageRes.json();
  console.log("\n=====================");
  console.log("IMAGE GENERATION MESSAGE DATA");
  console.log(task_id);
  console.log("=====================");

  res.status(200).send({
    task_id,
  });
}
