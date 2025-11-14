import type {
  ContentBlock,
  ShallowContainerBlock,
  ContainerLayoutData,
} from "@/lib/blocks";
import "./container-block.css";

type ContainerBlockProps = {
  data: ContainerLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

/**
 * ContainerBlock - Width constraint wrapper without layout logic
 * Container block - can hold content blocks or shallow container blocks
 */
export function ContainerBlock({
  data,
  blocks,
  renderBlock,
}: ContainerBlockProps) {
  const { width = "wide", spacing = "none" } = data;

  return (
    <div data-slot="container-block" data-width={width} data-spacing={spacing}>
      {blocks.map((block) => renderBlock(block))}
    </div>
  );
}
