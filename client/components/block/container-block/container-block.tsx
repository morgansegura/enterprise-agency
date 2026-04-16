import type {
  ContentBlock,
  ShallowContainerBlock,
} from "@/lib/blocks";
import { cn } from "@/lib/utils";
import "./container-block.css";

type ContainerBlockProps = {
  data: Record<string, unknown>;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
  className?: string;
};

/**
 * ContainerBlock (Box) — accepts className from withStyles wrapper merge.
 */
export function ContainerBlock({
  blocks,
  renderBlock,
  className,
}: ContainerBlockProps) {
  return (
    <div className={cn(className)} data-slot="container-block">
      {blocks?.map((block) => renderBlock(block))}
    </div>
  );
}
