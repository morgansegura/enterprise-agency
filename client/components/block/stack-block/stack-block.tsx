import type {
  ContentBlock,
  ShallowContainerBlock,
  StackLayoutData,
} from "@/lib/blocks";
import "./stack-block.css";

type StackBlockProps = {
  data: StackLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

/**
 * StackBlock - Simplified vertical stacking (flex column)
 * Container block - can hold content blocks or shallow container blocks
 */
export function StackBlock({ data, blocks, renderBlock }: StackBlockProps) {
  const { gap = "md", align = "stretch" } = data;

  return (
    <div data-slot="stack-block" data-gap={gap} data-align={align}>
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}
