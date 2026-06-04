import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // CMS-served media (Payload). Tighten to the real CMS host in production.
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
