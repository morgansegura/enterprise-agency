import { cache } from "react";

import { site } from "@/site.config";

/**
 * Thin typed client to the central Payload CMS over HTTP. Every call is scoped
 * to this site's tenant. Returns null/[] on failure so the FE renders gracefully
 * when the CMS is offline. Cached per-request via React `cache`.
 */
async function cmsFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${site.cmsUrl}/api${path}`, {
      next: { revalidate: 60 },
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
export async function cmsFind<T>(collection: string, query = ""): Promise<T[]> {
  const tenant = await getTenant();
  const scope = tenant ? `where[tenant][equals]=${tenant.id}` : "";
  const params = [scope, query].filter(Boolean).join("&");
  const data = await cmsFetch<{ docs?: T[] }>(`/${collection}?${params}`);
  return data?.docs ?? [];
}
