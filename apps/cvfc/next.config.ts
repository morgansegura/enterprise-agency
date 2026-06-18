import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile the shared @wf/ui package's TS/CSS source as part of this app.
  transpilePackages: ["@wf/ui"],
  images: {
    // CMS-served media (Payload). Tighten to the real CMS host in production.
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
