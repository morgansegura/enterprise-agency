import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * 2026 AI-crawler posture: block training crawlers (they take content, send no
 * traffic), allow search-time bots that cite back. Non-production deploys
 * disallow everything so previews never get indexed.
 */
const TRAINING_BOTS = [
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

const SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-User",
  "Claude-SearchBot",
  "DuckAssistBot",
  "Applebot",
  "Bingbot",
];

const isProd = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProd) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
      ...TRAINING_BOTS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
