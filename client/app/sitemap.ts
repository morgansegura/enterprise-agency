import { MetadataRoute } from "next";
import { createPublicApiClient } from "@/lib/public-api-client";

/**
 * Dynamic Sitemap Generation
 *
 * Generates sitemap.xml with:
 * - Static pages (home, about, etc.)
 * - Dynamic pages from CMS
 * - Blog posts (when available)
 *
 * Best practices:
 * - Priority based on page importance
 * - changeFrequency based on update patterns
 * - lastModified from actual content dates
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";
  const api = await createPublicApiClient();
  const tenantSlug = api.getSlug();
  const baseUrl = `${siteUrl}/${tenantSlug}`;

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Fetch dynamic pages from API
  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const { pages } = await api.listPages();

    dynamicPages = pages
      .filter((page) => !["home", "about"].includes(page.slug)) // Exclude static pages
      .map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    // API unavailable during build, continue with static pages only
    console.warn("[Sitemap] Could not fetch dynamic pages from API");
  }

  return [...staticPages, ...dynamicPages];
}
