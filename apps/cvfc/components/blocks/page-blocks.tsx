import { draftMode } from "next/headers";

import type { Page, PageBlock } from "@/lib/cms";

import { BlockList } from "./blocks";
import { LiveBlocks } from "./live-blocks";

/**
 * Renders a page's blocks. Inside the CMS Live Preview iframe (draft mode on),
 * swaps in the client LiveBlocks for real-time per-keystroke updates; for real
 * visitors the page stays fully server-rendered (no client cost).
 */
export async function Blocks({
  page,
  layout,
  only,
}: {
  page?: Page | null;
  layout?: PageBlock[] | null;
  only?: string[];
}) {
  const { isEnabled: isPreview } = await draftMode();
  if (isPreview) {
    const initialData = (page ?? { layout: layout ?? [] }) as Page;
    return <LiveBlocks initialData={initialData} only={only} />;
  }
  return <BlockList layout={layout ?? page?.layout} only={only} />;
}
