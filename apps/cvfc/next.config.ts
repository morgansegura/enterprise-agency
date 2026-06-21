import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compile the shared @wf/ui package's TS/CSS source as part of this app.
  transpilePackages: ["@wf/ui"],
  experimental: {
    // Inline route CSS into <style> in the document head instead of emitting
    // ~13 render-blocking <link> chunks. Removes the critical-path CSS requests
    // (and the fonts chained behind them) that were delaying mobile LCP paint.
    inlineCss: true,
  },
  images: {
    // Modern formats first — smaller payloads, better LCP.
    formats: ["image/avif", "image/webp"],
    // Allow-listed image hosts (don't expose the optimizer as an open proxy):
    // CMS media (R2 CDN + the Payload host) + the legacy WordPress source.
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "webandfunnel.onrender.com" },
      { protocol: "https", hostname: "chulavistafc.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
