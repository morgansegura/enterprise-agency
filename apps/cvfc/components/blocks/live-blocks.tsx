"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";

import type { Page } from "@/lib/cms";
import { site } from "@/site.config";

import { BlockList } from "./blocks";

/**
 * The CMS origin that drives Live Preview. useLivePreview validates incoming
 * postMessages against this origin, so it MUST equal the CMS admin's origin or
 * every keystroke is ignored and the preview freezes on the initial draft.
 *
 * Derive it from the iframe's parent — the preview iframe's parent IS the CMS
 * admin — instead of trusting an env var (CMS_URL). Robust across local/prod and
 * any tenant domain, with site.cmsUrl as a last resort. Returns site.cmsUrl on
 * the server; the client value is what matters (postMessages are client-side).
 */
function resolveCmsOrigin(): string {
  if (typeof window === "undefined") return site.cmsUrl;
  const ancestors = window.location.ancestorOrigins;
  if (ancestors && ancestors.length > 0) return ancestors[0];
  if (document.referrer) {
    try {
      return new URL(document.referrer).origin;
    } catch {
      // fall through to the configured CMS URL
    }
  }
  return site.cmsUrl;
}

/**
 * Live Preview path — subscribes to the editor's in-progress form data and
 * re-renders the blocks on every keystroke (no save, no refresh). Rendered only
 * inside the CMS preview iframe; real visitors get the server-rendered BlockList.
 */
export function LiveBlocks({
  initialData,
  only,
}: {
  initialData: Page;
  only?: string[];
}) {
  // depth 0 → use the editor's raw form data directly, no server populate fetch.
  const { data } = useLivePreview<Page>({
    initialData,
    serverURL: resolveCmsOrigin(),
    depth: 0,
  });
  return <BlockList layout={data?.layout} only={only} />;
}
