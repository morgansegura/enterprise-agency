import type {
  ContentBlock,
  ShallowContainerBlock,
} from "@/lib/blocks";
import "./container-block.css";

type ContainerBlockProps = {
  data: Record<string, unknown>;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

/**
 * ContainerBlock (Box) — clean output.
 * All styling from generated CSS via .e-{key} wrapper.
 */
export function ContainerBlock({
  blocks,
  renderBlock,
}: ContainerBlockProps) {
  return (
    <div data-slot="container-block">
      {blocks?.map((block) => renderBlock(block))}
    </div>
  );
}
