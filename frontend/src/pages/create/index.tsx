import Layout from "@/components/Layout";
import Image from "next/image";
import { useRouter } from "next/router";
export default function Create() {
  const router = useRouter();

  return (
    <Layout>
      <div>
        <div className="flex justify-center h-[90vh] items-center ">
          <div className="w-[75%]">
            <p className="text-6xl font-bold mb-8">Create NFT</p>
            <p className="text-2xl font-bold text-[#9c9e9e]">
              Import to upload your image as an NFT.
            </p>
            <p className="text-2xl font-bold text-[#9c9e9e]">
              Generate to create NFT using AI prompt. 🪄
            </p>
            <div className="grid grid-cols-2 gap-3 mt-10">
              <button
                onClick={() => {
                  router.push(`/create/import`);
                }}
                className="border-[2px] border-[#3c3f41] flex flex-col justify-center items-center h-[300px] rounded-2xl"
              >
                <Image
                  src="/create/import.png"
                  width={60}
                  height={60}
                  alt="import"
                  className="bg-white p-2 rounded-xl"
                />
                <p className="text-white font-bold text-2xl mt-4">Import ⬇️</p>
              </button>
              <button
                onClick={() => {
                  router.push(`/create/generate`);
                }}
                className="border-[2px] border-[#3c3f41] flex flex-col justify-center items-center h-[300px] rounded-2xl"
              >
                <Image
                  src="/create/ai.png"
                  width={100}
                  height={100}
                  alt="import"
                  className="bg-white p-2 rounded-xl"
                />
                <p className="text-white font-bold text-2xl mt-4">
                  Generate 🪄
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
