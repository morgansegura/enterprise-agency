import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile the shared @wf/ui package's TS/CSS source as part of this app.
  transpilePackages: ["@wf/ui"],
  images: {
    // Modern formats first — smaller payloads, better LCP.
    formats: ["image/avif", "image/webp"],
    // CMS-served media (Payload) + external sources. Tighten to real hosts later.
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
