/** Per-site knobs. The new-site script fills these in; tweak as needed. */
export const site = {
  /** Display name (titles, OG, schema). */
  name: "Emily Green",
  /** Canonical production URL. */
  url: process.env.SITE_URL ?? "http://localhost:4012",
  /** Tenant slug in the central CMS — scopes every CMS query to this site. */
  tenantSlug: "emily-green",
  /** Central CMS base URL (Payload). */
  cmsUrl: process.env.CMS_URL ?? "http://localhost:4010",
} as const;

export type SiteConfig = typeof site;
