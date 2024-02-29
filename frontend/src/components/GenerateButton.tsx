import React from "react";

export default function GenerateButton({
  setCount,
  setMessageId,
  messageId,
  setFetchTime,
  index,
  setChooseImage,
  setTxHash,
}: {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setMessageId: React.Dispatch<React.SetStateAction<string>>;
  messageId: string;
  setFetchTime: React.Dispatch<React.SetStateAction<number>>;
  index: string;
  setChooseImage: React.Dispatch<React.SetStateAction<string>>;
  setTxHash: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <button
      className="bg-[#25272b] mx-2 my-2 py-2 px-6 rounded-lg"
      onClick={async () => {
        setCount(3);

        const res = await fetch("/api/midjourney/upscale", {
          method: "POST",
          body: JSON.stringify({
            task_id: messageId,
            index,
          }),
        });
        const { task_id } = await res.json();
        setMessageId(task_id);
        let fetchedImage: any = {
          status: "pending",
          process_time: 0,
        };

        while (fetchedImage.status != "finished") {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const res = await fetch("/api/midjourney/fetch", {
            method: "POST",
            body: JSON.stringify({
              task_id,
            }),
          });
          fetchedImage = await res.json();
          setFetchTime(fetchedImage.process_time);
        }
        setChooseImage(fetchedImage.task_result.image_url);
        setCount(4);
        setMessageId("");
        setTxHash(
          "0x463df055eb7059b3e742ffc0d0e4c3daacdfead5b0a7dac4bdc3fa9da339cad5"
        );
      }}
    >
      <p>
        {index == "1" ? "↖️" : index == "2" ? "↗️" : index == "3" ? "↙️" : "↘️"}
      </p>
    </button>
  );
}
