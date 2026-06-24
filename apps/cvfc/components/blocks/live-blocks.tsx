"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";

import type { Page } from "@/lib/cms";
import { site } from "@/site.config";

import { BlockList } from "./blocks";

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
  return <BlockList layout={data?.layout} only={only} />;
}
