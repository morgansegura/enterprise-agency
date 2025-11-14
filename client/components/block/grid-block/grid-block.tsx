import type {
  ContentBlock,
  ShallowContainerBlock,
  GridLayoutData,
} from "@/lib/blocks";
import { getColumnClasses } from "@/lib/blocks";
import "./grid-block.css";

type GridBlockProps = {
  data: GridLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

/**
 * GridBlock - Arranges child blocks in a responsive CSS grid
 * Container block - can hold content blocks or shallow container blocks
 */
export function GridBlock({ data, blocks, renderBlock }: GridBlockProps) {
  const { columns, gap = "md", align, justify } = data;

  return (
    <div
      data-slot="grid-block"
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      className={getColumnClasses(columns)}
    >
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}
