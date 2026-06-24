import { site } from "@/site.config";

import type { Page, PageBlock } from "@/lib/cms";

/**
 * Client-safe CMS helpers. Split out of `lib/cms` (which imports `next/headers`)
 * so the block renderer can run in the Live Preview client path without dragging
 * server-only modules into the client bundle. `lib/cms` re-exports these.
 */

export type MediaValue =
  | { url?: string | null; alt?: string | null }
  | string
  | number
  | null
  | undefined;

export function blockOf(page: Page | null, type: string): PageBlock | null {
  return page?.layout?.find((b) => b.blockType === type) ?? null;
}

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

export function mediaAlt(value: MediaValue): string | undefined {
  return value && typeof value === "object" && typeof value.alt === "string"
    ? value.alt
    : undefined;
}
