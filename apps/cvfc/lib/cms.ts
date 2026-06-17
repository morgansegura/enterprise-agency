import { cache } from "react";
import { draftMode } from "next/headers";

import type { TMenuItem } from "@/lib/menu";
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
    const res = await fetch(`${site.cmsUrl}/api${path}`, {
      // Draft/preview reads must always be fresh; published reads cache 60s.
      ...(draft
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60 } }),
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
export type Page = {
  id: string | number;
  title?: string;
  slug?: string;
  layout?: PageBlock[];
};

/**
 * A page for this tenant by slug, with its layout blocks. Reads draft mode
 * itself — when the editor preview is active, returns the latest draft; for
 * everyone else, the published version. Callers never thread a preview flag.
 */
export const getPage = cache(async (slug: string): Promise<Page | null> => {
  const { isEnabled: draft } = await draftMode();
  const draftParam = draft ? "&draft=true" : "";
  const pages = await cmsFind<Page>(
    "pages",
    `where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1${draftParam}`,
    draft,
  );
  return pages[0] ?? null;
});

/** Pull the first block of a given type out of a page's layout. */
export function blockOf(page: Page | null, type: string): PageBlock | null {
  return page?.layout?.find((b) => b.blockType === type) ?? null;
}

/** A Payload `upload` field value: a populated media doc, a URL string, an id, or null. */
export type MediaValue =
  | { url?: string | null; alt?: string | null }
  | string
  | number
  | null
  | undefined;

/**
 * Absolute URL for a Payload upload value. Payload returns CMS-relative paths
 * (e.g. `/api/media/file/x.jpg`) for local storage and absolute URLs once R2
 * (the CDN) is configured — this normalizes both so the FE always gets a
 * loadable src.
 */
export function mediaUrl(value: MediaValue): string | undefined {
  const raw =
    typeof value === "string"
      ? value
      : value && typeof value === "object"
        ? (value.url ?? undefined)
        : undefined;
  if (!raw) return undefined;
  return raw.startsWith("http") ? raw : `${site.cmsUrl}${raw}`;
}

/** Alt text carried on a populated media doc, if any. */
export function mediaAlt(value: MediaValue): string | undefined {
  return value && typeof value === "object" && typeof value.alt === "string"
    ? value.alt
    : undefined;
}

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
};

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
