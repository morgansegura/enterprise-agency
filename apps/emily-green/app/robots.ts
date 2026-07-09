import type { MetadataRoute } from "next";

import { site } from "@/site.config";

// AI-crawler discrimination: block training corpora, allow search bots that cite back.
const BLOCK_TRAINING = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
  "Amazonbot",
  "Applebot-Extended",
  "FacebookBot",
  "Diffbot",
  "Omgilibot",
];

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV === "production";

  if (!isProd) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...BLOCK_TRAINING.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
