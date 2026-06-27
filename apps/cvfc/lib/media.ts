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
 * Find a CMS block by the editor-set "Block name" (Payload's built-in per-block
 * label) so a fixed screen section can pull just its own override — this keeps
 * sections that repeat a block type (e.g. several media-splits) addressable
 * without a schema change. Falls back to the first block of `type` when no name
 * matches, so a single un-named block still works.
 */
export function blockFor(
  page: Page | null,
  blockName: string,
  type?: string,
): PageBlock | null {
  const byName = page?.layout?.find(
    (b) => (b as { blockName?: string }).blockName === blockName,
  );
  if (byName) return byName;
  return type ? blockOf(page, type) : null;
}

/**
 * Overlay a CMS block's resolved fields onto hardcoded defaults. Blank CMS
 * values (undefined/null, empty string, empty array) are skipped, so the mock
 * default always shows when the client hasn't set that field — there's never an
 * empty section.
 */
export function cmsOverlay<T extends object>(
  defaults: T,
  override: object | null | undefined,
): T {
  if (!override) return defaults;
  const out = { ...defaults } as Record<string, unknown>;
  for (const [k, v] of Object.entries(override)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    // Skip an image-like object with no source, so the default image stays.
    if (
      typeof v === "object" &&
      !Array.isArray(v) &&
      "src" in v &&
      !(v as { src?: string }).src
    ) {
      continue;
    }
    out[k] = v;
  }
  return out as T;
}

/**
 * Absolute URL for a Payload upload value. Payload returns CMS-relative paths
 * (e.g. `/api/media/file/x.jpg`) for local storage and absolute URLs once R2
 * (the CDN) is configured — this normalizes both so the FE always gets a
 * loadable src.
 */
export function mediaUrl(value: MediaValue): string | undefined {
  let raw: string | undefined;
  if (typeof value === "string") {
    raw = value;
  } else if (value && typeof value === "object") {
    // Prefer a cropped size variant (Payload generates these honoring the crop
    // + focal point) so editor crops actually show; fall back to the original.
    const sizes = (
      value as { sizes?: Record<string, { url?: string | null } | null> }
    ).sizes;
    raw = sizes?.feature?.url ?? sizes?.card?.url ?? value.url ?? undefined;
  }
  if (!raw) return undefined;
  return raw.startsWith("http") ? raw : `${site.cmsUrl}${raw}`;
}

export function mediaAlt(value: MediaValue): string | undefined {
  return value && typeof value === "object" && typeof value.alt === "string"
    ? value.alt
    : undefined;
}
