/** Per-site knobs. The new-site script fills these in; tweak as needed. */
export const site = {
  /** Display name (titles, OG, schema). */
  name: "{{SITE_DISPLAY_NAME}}",
  /** Canonical production URL. */
  url: process.env.SITE_URL ?? "http://localhost:{{PORT}}",
  /** Tenant slug in the central CMS — scopes every CMS query to this site. */
  tenantSlug: "{{TENANT_SLUG}}",
  /** Central CMS base URL (Payload). */
  cmsUrl: process.env.CMS_URL ?? "{{CMS_URL}}",
} as const;

export type SiteConfig = typeof site;
