import { cache } from "react";
import { draftMode } from "next/headers";

import type { TMenuItem } from "@/lib/menu";
import { blockOf, mediaUrl, mediaAlt, type MediaValue } from "@/lib/media";
import { site } from "@/site.config";

const cmsStr = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v : undefined;

/**
 * Thin typed client to the central Payload CMS over HTTP. Every call is scoped
 * to this site's tenant. Returns null/[] on failure so the FE renders gracefully
 * when the CMS is offline. Cached per-request via React `cache`.
 */
async function cmsFetch<T>(path: string, draft = false): Promise<T | null> {
  try {
    // This site's per-tenant read key scopes public reads to our tenant; the
    // preview secret additionally unlocks drafts. Server-side only.
    const headers: Record<string, string> = {};
    if (process.env.CMS_TENANT_KEY)
      headers["X-Tenant-Key"] = process.env.CMS_TENANT_KEY;
    if (draft && process.env.PREVIEW_SECRET)
      headers["X-Preview-Secret"] = process.env.PREVIEW_SECRET;

    const res = await fetch(`${site.cmsUrl}/api${path}`, {
      // Draft/preview reads must always be fresh; published reads cache 60s.
      ...(draft
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60 } }),
      ...(Object.keys(headers).length ? { headers } : {}),
      // Fail fast: if the CMS is slow or wedged, abort and let callers fall
      // back rather than hanging on undici's multi-minute default timeout.
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type Tenant = {
  id: string | number;
  name?: string;
  domain?: string | null;
  theme?: Record<string, unknown>;
};

/** The CMS tenant record for this site (by slug). */
export const getTenant = cache(async (): Promise<Tenant | null> => {
  const q = `slug][equals]=${encodeURIComponent(site.tenantSlug)}`;
  const data = await cmsFetch<{ docs?: Tenant[] }>(
    `/tenants?where[${q}&limit=1`,
  );
  return data?.docs?.[0] ?? null;
});

/** Generic tenant-scoped collection query. `query` is extra REST params. */
export async function cmsFind<T>(
  collection: string,
  query = "",
  draft = false,
): Promise<T[]> {
  const tenant = await getTenant();
  const scope = tenant ? `where[tenant][equals]=${tenant.id}` : "";
  const params = [scope, query].filter(Boolean).join("&");
  const data = await cmsFetch<{ docs?: T[] }>(
    `/${collection}?${params}`,
    draft,
  );
  return data?.docs ?? [];
}

export type PageBlock = { id?: string; blockType?: string } & Record<
  string,
  unknown
>;
export type PageMeta = {
  title?: string | null;
  description?: string | null;
  image?: MediaValue;
  noindex?: boolean | null;
};
export type Page = {
  id: string | number;
  title?: string;
  slug?: string;
  layout?: PageBlock[];
  meta?: PageMeta | null;
};

/**
 * A page for this tenant by slug, with its layout blocks. Reads draft mode
 * itself — when the editor preview is active, returns the latest draft; for
 * everyone else, the published version. Callers never thread a preview flag.
 */
export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { isEnabled: draft } = await draftMode();
  // Preview (draft mode) → latest draft. Everyone else → ONLY published, so
  // autosaved drafts never leak to the live site until "Publish changes".
  const statusParam = draft
    ? "&draft=true"
    : "&where[_status][equals]=published";
  const pages = await cmsFind<Page>(
    "pages",
    `where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1${statusParam}`,
    draft,
  );
  return pages[0] ?? null;
});

/**
 * Latest DRAFT of a page by slug — for the secret-gated `/preview` route. The
 * preview iframe is cross-site (admin vs FE), where browsers block the draft
 * cookie, so cookie-free Live Preview carries state in the URL and fetches the
 * draft explicitly here (never used on the public site).
 */
export const getPageDraft = cache(
  async (slug: string): Promise<Page | null> => {
    const pages = await cmsFind<Page>(
      "pages",
      `where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1&draft=true`,
      true,
    );
    return pages[0] ?? null;
  },
);

// Client-safe helpers live in lib/media (kept out of this server-only module so
// the block renderer can run in the Live Preview client path). Re-exported here
// for back-compat so server consumers can keep importing from "@/lib/cms".
export { blockOf, mediaUrl, mediaAlt, type MediaValue };

/** A person in the Staff collection (coaches + administrators). */
export type StaffDoc = {
  id: string | number;
  key?: string | null;
  name?: string;
  title?: string | null;
  group?: string | null;
  department?: string | null;
  pathway?: string[] | null;
  programs?: string[] | null;
  team?: string | null;
  credentials?: string[] | null;
  achievements?: string[] | null;
  bio?: string | null;
  photo?: MediaValue;
  imageUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  isFeatured?: boolean | null;
  joinedYear?: number | null;
  status?: string | null;
  order?: number | null;
};

/** People for this tenant, optionally filtered by `group`, sorted by `order`. */
export const getStaff = cache(async (group?: string): Promise<StaffDoc[]> => {
  const groupParam = group
    ? `&where[group][equals]=${encodeURIComponent(group)}`
    : "";
  return cmsFind<StaffDoc>(
    "staff",
    `depth=1&limit=200&sort=order${groupParam}`,
  );
});

/** A blog post in the Posts collection. */
export type PostDoc = {
  id: string | number;
  slug?: string;
  title?: string;
  excerpt?: string | null;
  coverImage?: MediaValue;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  author?: string | null;
  content?: unknown;
};

/** All published posts for this tenant, newest first. */
export const getCmsPosts = cache(async (): Promise<PostDoc[]> => {
  return cmsFind<PostDoc>("posts", "depth=1&limit=200&sort=-publishedAt");
});

/** A single post by slug (or null). */
export const getCmsPostBySlug = cache(
  async (slug: string): Promise<PostDoc | null> => {
    const { isEnabled: draft } = await draftMode();
    // Preview → latest draft; everyone else → only the published version.
    const statusParam = draft
      ? "&draft=true"
      : "&where[_status][equals]=published";
    const docs = await cmsFind<PostDoc>(
      "posts",
      `where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1${statusParam}`,
      draft,
    );
    return docs[0] ?? null;
  },
);

/** A testimonial in the Testimonials collection. */
export type TestimonialDoc = {
  id: string | number;
  key?: string | null;
  quote?: string;
  author?: string;
  role?: string | null;
  context?: string | null;
  longform?: string | null;
  featured?: boolean | null;
  photo?: MediaValue;
  imageUrl?: string | null;
  status?: string | null;
  order?: number | null;
};

/** All testimonials for this tenant, sorted by `order`. */
export const getTestimonials = cache(async (): Promise<TestimonialDoc[]> => {
  return cmsFind<TestimonialDoc>(
    "testimonials",
    "depth=1&limit=200&sort=order",
  );
});

/** A facility in the Facilities collection. */
export type FacilityDoc = {
  id: string | number;
  key?: string | null;
  name?: string;
  tier?: string | null;
  role?: string | null;
  roleLabel?: string | null;
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  } | null;
  description?: string | null;
  uses?: string[] | null;
  features?: string[] | null;
  photo?: MediaValue;
  imageUrl?: string | null;
  mapsUrl?: string | null;
  status?: string | null;
  order?: number | null;
};

/** All facilities for this tenant, sorted by `order`. */
export const getFacilities = cache(async (): Promise<FacilityDoc[]> => {
  return cmsFind<FacilityDoc>("facilities", "depth=1&limit=200&sort=order");
});

export type MenuDoc = { name?: string; items?: Array<Record<string, unknown>> };

export type SiteSettings = {
  headerMenu?: MenuDoc | number | null;
  footerMenu?: MenuDoc | number | null;
  footer?: {
    tagline?: string | null;
    values?: Array<{ value?: string | null }> | null;
    copyrightName?: string | null;
    social?: Array<{ platform?: string | null; url?: string | null }> | null;
  } | null;
  /** Comma/newline-separated club-admin emails notified on each new signup. */
  signupNotifyEmails?: string | null;
};

/** Parsed club-admin notification emails from Site Settings (deduped). */
export const getSignupNotifyEmails = cache(async (): Promise<string[]> => {
  const settings = await getSiteSettings();
  const raw = settings?.signupNotifyEmails ?? "";
  const emails = raw
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));
  return [...new Set(emails)];
});

/** This tenant's SiteSettings, with header/footer menus populated (depth=2). */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const docs = await cmsFind<SiteSettings>("siteSettings", "depth=2&limit=1");
  return docs[0] ?? null;
});

/** Map a populated CMS menu into the FE `TMenuItem[]` shape (or undefined). */
export function toMenuItems(menu: unknown): TMenuItem[] | undefined {
  const rows = (menu as MenuDoc | null | undefined)?.items;
  if (!Array.isArray(rows) || rows.length === 0) return undefined;
  return rows.map((r): TMenuItem => {
    const children = r.children as Array<Record<string, unknown>> | undefined;
    return {
      label: cmsStr(r.label),
      heading: cmsStr(r.heading),
      description: cmsStr(r.description),
      href: cmsStr(r.href),
      target: cmsStr(r.target),
      items:
        Array.isArray(children) && children.length > 0
          ? children.map((c) => ({
              label: cmsStr(c.label),
              href: cmsStr(c.href),
              description: cmsStr(c.description),
              target: cmsStr(c.target),
            }))
          : undefined,
    };
  });
}
