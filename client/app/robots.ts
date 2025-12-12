import { MetadataRoute } from "next";

/**
 * Dynamic robots.txt Generation
 *
 * Controls search engine crawling:
 * - Allow crawling of public pages
 * - Block admin/preview routes
 * - Point to sitemap location
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4002";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/preview/", "/draft/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
