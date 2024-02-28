/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cloudflare-ipfs.com",
      "otvzzmqknnjthpuwmrpb.supabase.co",
      "amber-accessible-porpoise-584.mypinata.cloud",
      "cdn.midjourney.com",
    ],
  },
};

module.exports = nextConfig;
