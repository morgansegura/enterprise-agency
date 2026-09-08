import type { MetadataRoute } from "next";

import { AREAS } from "@/data/areas";
import { NEWS_POSTS, getActiveNews } from "@/data/news";
import { getCmsPosts } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/** Static routes. Dynamic news posts are appended below. */
const ROUTES: Array<{ path: string; priority: number; changeFrequency: Freq }> =
  [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about/who-we-are", priority: 0.7, changeFrequency: "monthly" },
    {
      path: "/about/coaching-staff",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/about/administrators",
      priority: 0.6,
      changeFrequency: "monthly",
    },
    { path: "/about/facilities", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about/testimonials", priority: 0.6, changeFrequency: "monthly" },
    { path: "/programs", priority: 0.9, changeFrequency: "monthly" },
    {
      path: "/programs/foundations",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/programs/boys-competitive-pathway",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/programs/girls-competitive-pathway",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/programs/goalkeeper-pathway",
      priority: 0.7,
      changeFrequency: "monthly",
    },
    {
      path: "/programs/coaching-opportunities",
      priority: 0.6,
      changeFrequency: "monthly",
    },
    { path: "/areas", priority: 0.6, changeFrequency: "monthly" },
    { path: "/evaluations", priority: 0.9, changeFrequency: "monthly" },
    { path: "/news", priority: 0.7, changeFrequency: "weekly" },
    {
      path: "/guides/san-diego-youth-soccer-clubs",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    { path: "/support", priority: 0.7, changeFrequency: "monthly" },
    { path: "/sponsor", priority: 0.6, changeFrequency: "monthly" },
    { path: "/partnerships", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/brand", priority: 0.5, changeFrequency: "yearly" },
    { path: "/transparency", priority: 0.5, changeFrequency: "yearly" },
    { path: "/safeguarding", priority: 0.5, changeFrequency: "yearly" },
    { path: "/donor-privacy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
    { path: "/cookie-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/link-policy", priority: 0.3, changeFrequency: "yearly" },
  ];

function parseDate(value: string): Date | undefined {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticEntries: MetadataRoute.Sitemap = ROUTES.map((r) => ({
    url: `${base}${r.path === "/" ? "" : r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const areaEntries: MetadataRoute.Sitemap = AREAS.map((a) => ({
    url: `${base}/areas/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // CMS posts, then the hardcoded ones. Only the static list was here, so every
  // post published through the CMS was missing from the sitemap entirely.
  const cmsPosts = await getCmsPosts();
  const cmsEntries: MetadataRoute.Sitemap = cmsPosts
    // The editor's "hide from search engines" switch drops it, as the field's
    // own help text promises.
    .filter((p) => p.slug && !p.meta?.noindex)
    .map((p) => ({
      url: `${base}/news/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));

  const cmsSlugs = new Set(cmsPosts.map((p) => p.slug));
  const newsEntries: MetadataRoute.Sitemap = getActiveNews(NEWS_POSTS)
    // A story migrated into the CMS keeps its slug; listing both would be a
    // duplicate URL.
    .filter((p) => !cmsSlugs.has(p.slug))
    .map((p) => ({
      url: `${base}/news/${p.slug}`,
      lastModified: parseDate(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }));

  return [...staticEntries, ...areaEntries, ...cmsEntries, ...newsEntries];
}
