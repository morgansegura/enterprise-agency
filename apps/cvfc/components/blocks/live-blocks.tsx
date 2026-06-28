"use client";

import * as React from "react";
import { useLivePreview } from "@payloadcms/live-preview-react";

import type { Page } from "@/lib/cms";
import { site } from "@/site.config";

import { BlockList } from "./blocks";

type Dict = Record<string, unknown>;

const isMediaDoc = (o: Dict): boolean =>
  o.id !== undefined &&
  (typeof o.url === "string" || !!o.sizes || typeof o.mimeType === "string");

/**
 * Index every populated upload (image/photo/logo/…) found in the server-rendered
 * preview data: `id → media doc`, plus the field names that held one. Live
 * Preview form data carries uploads as bare IDs (depth 0, no per-keystroke
 * fetch), so we use this index to restore the populated doc and keep editor
 * image swaps visible in the inline preview.
 */
function indexMedia(
  node: unknown,
  byId: Map<string, Dict>,
  keys: Set<string>,
  parentKey?: string,
): void {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((n) => indexMedia(n, byId, keys, parentKey));
    return;
  }
  const o = node as Dict;
  if (isMediaDoc(o)) {
    byId.set(String(o.id), o);
    if (parentKey) keys.add(parentKey);
  }
  for (const [k, v] of Object.entries(o)) indexMedia(v, byId, keys, k);
}

/** Replace bare upload IDs (under known media keys) with their populated doc. */
function repopulate(
  node: unknown,
  byId: Map<string, Dict>,
  keys: Set<string>,
): unknown {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map((n) => repopulate(n, byId, keys));
  const out: Dict = {};
  for (const [k, v] of Object.entries(node as Dict)) {
    if (
      keys.has(k) &&
      (typeof v === "number" || typeof v === "string") &&
      byId.has(String(v))
    ) {
      out[k] = byId.get(String(v));
    } else {
      out[k] = repopulate(v, byId, keys);
    }
  }
  return out;
}

/**
 * CMS origin that drives Live Preview. useLivePreview validates incoming
 * postMessages against this origin, so it MUST equal the CMS admin's origin or
 * every keystroke is ignored. Derive it from the iframe's parent (the preview
 * iframe's parent IS the CMS admin) — env-independent, works for any tenant
 * domain, with site.cmsUrl as a last resort.
 */
function resolveCmsOrigin(): string {
  if (typeof window === "undefined") return site.cmsUrl;
  const ancestors = window.location.ancestorOrigins;
  if (ancestors && ancestors.length > 0) return ancestors[0];
  if (document.referrer) {
    try {
      return new URL(document.referrer).origin;
    } catch {
      // fall through
    }
  }
  return site.cmsUrl;
}

/**
 * No-op populate handler: our blocks carry inline data (imageUrl text, not upload
 * relationships), so the editor's form data is already complete. Returning it
 * directly skips the per-keystroke cross-origin fetch to the CMS — which fails in
 * production (CORS / cross-domain auth cookie) and was freezing the inline
 * preview. This is what makes live typing work side-by-side in the admin.
 */
function returnIncoming(args: {
  data?: { data?: unknown };
}): Promise<Response> {
  return Promise.resolve(
    new Response(JSON.stringify(args?.data?.data ?? {}), {
      headers: { "Content-Type": "application/json" },
    }),
  );
}

/**
 * Live Preview path — subscribes to the editor's in-progress form data and
 * re-renders the blocks on every keystroke (no save, no refresh, no fetch).
 * Rendered only inside the CMS preview iframe; real visitors get server-rendered.
 */
export function LiveBlocks({
  initialData,
  only,
}: {
  initialData: Page;
  only?: string[];
}) {
  const { data } = useLivePreview<Page>({
    initialData,
    serverURL: resolveCmsOrigin(),
    depth: 0,
    requestHandler: returnIncoming,
  });

  // The live form data carries uploads as bare IDs; restore the populated media
  // docs from the server-rendered initialData so editor image swaps show.
  const mediaIndex = React.useMemo(() => {
    const byId = new Map<string, Dict>();
    const keys = new Set<string>();
    indexMedia(initialData, byId, keys);
    return { byId, keys };
  }, [initialData]);

  const layout = React.useMemo(
    () =>
      repopulate(data?.layout, mediaIndex.byId, mediaIndex.keys) as
        | Page["layout"]
        | undefined,
    [data, mediaIndex],
  );

  return <BlockList layout={layout} only={only} />;
}
