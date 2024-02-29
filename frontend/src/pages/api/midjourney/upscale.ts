import { MIDJOURNEY_BASE_URL } from "@/utils/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { task_id, index } = JSON.parse(req.body);
  console.log(task_id);
  console.log(task_id, index);
  const imageRes = await fetch(`${MIDJOURNEY_BASE_URL}/upscale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": `${process.env.NEXT_PUBLIC_MIDJOURNEY_API_KEY}`,
    },
    body: JSON.stringify({
      origin_task_id: task_id,
      index,
    }),
  });

  const imageResponseData = await imageRes.json();
  console.log("\n=====================");
  console.log("IMAGE UPSCALE MESSAGE DATA");
  console.log(imageResponseData);
  console.log("=====================");

  res.status(200).send(imageResponseData);
}
