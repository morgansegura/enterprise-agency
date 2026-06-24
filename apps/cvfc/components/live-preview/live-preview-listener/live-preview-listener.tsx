"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

import { site } from "@/site.config";

/**
 * Mounted only when Next draft mode is on (i.e. inside the CMS Live Preview
 * iframe). Listens for the editor's save/autosave postMessages and refreshes the
 * server-rendered route so the preview reflects the latest draft — keeping the
 * published site fully server-rendered (no client cost for real visitors).
 */
export function LivePreviewListener() {
  const router = useRouter();
  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={site.cmsUrl}
    />
  );
}
