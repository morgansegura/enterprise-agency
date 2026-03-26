import type {
  ContentBlock,
  ShallowContainerBlock,
  ColumnsLayoutData,
} from "@/lib/blocks";
import "./columns-block.css";

type ColumnsBlockProps = {
  data: ColumnsLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

/**
 * ColumnsBlock - Arranges child blocks in equal-width columns
 * Container block - can hold content blocks or shallow container blocks
 *
 * Uses CSS grid for column layout with optional responsive stacking
 */
export function ColumnsBlock({ data, blocks, renderBlock }: ColumnsBlockProps) {
  const { count = "2", gap = "md", responsive = true } = data;

  return (
    <div
      data-slot="columns-block"
      data-count={count}
      data-gap={gap}
      data-responsive={responsive ? "true" : undefined}
    >
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}
