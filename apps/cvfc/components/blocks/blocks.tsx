import type { ReactNode } from "react";

import { MediaSplit } from "@/components/feature/media-split";
import { mediaSplitFromBlock } from "@/lib/cms-blocks";
import type { PageBlock } from "@/lib/cms";

/**
 * Renders CMS layout blocks in order via a registry — for repeating sections
 * (e.g. multiple media-splits) that block-type lookup can't handle. Each entry
 * maps a block to its bespoke FE feature. Unknown block types are skipped.
 */
const REGISTRY: Record<string, (block: PageBlock, key: string) => ReactNode> = {
  mediaSplit: (block, key) => (
    <MediaSplit key={key} {...mediaSplitFromBlock(block)} />
  ),
};

export function Blocks({
  layout,
  only,
}: {
  layout?: PageBlock[] | null;
  only?: string[];
}) {
  const blocks = (layout ?? []).filter(
    (b) =>
      b.blockType &&
      REGISTRY[b.blockType] &&
      (!only || only.includes(b.blockType)),
  );
  if (!blocks.length) return null;
  return (
    <>
      {blocks.map((b, i) =>
        REGISTRY[b.blockType as string](b, b.id ?? `${b.blockType}-${i}`),
      )}
    </>
  );
}
