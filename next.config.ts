import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "hkpep.cc" },
      { protocol: "https", hostname: "yryqnzdiexvynkjusvjr.supabase.co" },
    ],
  },
};

export default nextConfig;
