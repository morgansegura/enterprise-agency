import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@enterprise/tokens",
    "@enterprise/ui",
    "@enterprise/blocks",
  ],
};

export default nextConfig;
