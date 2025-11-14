import type {
  ContentBlock,
  ShallowContainerBlock,
  FlexLayoutData,
} from "@/lib/blocks";
import "./flex-block.css";

type FlexBlockProps = {
  data: FlexLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

/**
 * FlexBlock - Arranges child blocks using flexbox
 * Container block - can hold content blocks or shallow container blocks
 */
export function FlexBlock({ data, blocks, renderBlock }: FlexBlockProps) {
  const { direction = "row", wrap = false, gap = "md", align, justify } = data;

  return (
    <div
      data-slot="flex-block"
      data-direction={direction}
      data-wrap={wrap ? "wrap" : "nowrap"}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
    >
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}
