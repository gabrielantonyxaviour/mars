import Layout from "@/components/Layout";
import Profile from "@/components/Profile";
import { useAccount } from "wagmi";

export default function ProfilePage() {
  const { address } = useAccount();

  return (
    <Layout>
      <Profile address={address == undefined ? "error" : (address as string)} />
    </Layout>
  );
}
