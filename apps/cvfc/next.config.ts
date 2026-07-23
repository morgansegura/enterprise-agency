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
  // Permanent (301/308) redirects from the legacy WordPress URLs to their new
  // homes. Preserves the SEO equity of pages already indexed by Google and stops
  // old search results / backlinks from landing on 404s during the reindex. Add
  // any stragglers from GSC → Indexing → Pages here.
  async redirects() {
    return [
      {
        source: "/join-our-club",
        destination: "/evaluations",
        permanent: true,
      },
      { source: "/tryouts", destination: "/evaluations", permanent: true },
      {
        source: "/mls-next",
        destination: "/programs/boys-competitive-pathway",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/about/who-we-are",
        permanent: true,
      },
      {
        source: "/our-story",
        destination: "/about/who-we-are",
        permanent: true,
      },
      {
        source: "/coaches",
        destination: "/about/coaching-staff",
        permanent: true,
      },
      {
        source: "/coaching-staff",
        destination: "/about/coaching-staff",
        permanent: true,
      },
      {
        source: "/administrators",
        destination: "/about/administrators",
        permanent: true,
      },
      {
        source: "/facilities",
        destination: "/about/facilities",
        permanent: true,
      },
      {
        source: "/testimonials",
        destination: "/about/testimonials",
        permanent: true,
      },
      {
        source: "/donate",
        destination: "/support#make-a-donation",
        permanent: true,
      },
      { source: "/contact", destination: "/support", permanent: true },
      { source: "/contact-us", destination: "/support", permanent: true },
      { source: "/events", destination: "/news", permanent: true },
      { source: "/upcoming-events", destination: "/news", permanent: true },
    ];
  },
};

export default nextConfig;
