"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";

import type { Page } from "@/lib/cms";
import { site } from "@/site.config";

import { BlockList } from "./blocks";

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
  // Our blocks carry inline data (imageUrl text, not upload relationships), so
  // there's nothing to populate — and it avoids the failing populate query.
  const { data } = useLivePreview<Page>({
    initialData,
    serverURL: site.cmsUrl,
    depth: 0,
  });
  return <BlockList layout={data?.layout} only={only} />;
}
