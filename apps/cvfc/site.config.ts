/**
 * Normalize a URL env var: ensure an absolute URL (default https:// if the
 * scheme is missing) and strip any trailing slash. Keeps a bare host like
 * "site.vercel.app" from crashing `new URL()` at build time.
 */
function siteUrl(value: string | undefined, fallback: string): string {
  const raw = (value ?? fallback).trim();
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withScheme.replace(/\/+$/, "");
}

/** Per-site knobs. The new-site script fills these in; tweak as needed. */
export const site = {
  /** Display name (titles, OG, schema). */
  name: "Chula Vista Futbol Club",
  /** Canonical production URL. */
  url: siteUrl(process.env.SITE_URL, "http://localhost:4011"),
  /** Tenant slug in the central CMS — scopes every CMS query to this site. */
  tenantSlug: "cvfc",
  /** Central CMS base URL (Payload). */
  cmsUrl: siteUrl(process.env.CMS_URL, "http://localhost:4010"),
} as const;

export type SiteConfig = typeof site;
