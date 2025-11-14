import type { RootBlock } from "@/lib/blocks";
import { isContainerBlock } from "@/lib/blocks";

// Content blocks
import { HeadingBlock } from "@/components/block/heading-block";
import { TextBlock } from "@/components/block/text-block";
import { ImageBlock } from "@/components/block/image-block";
import { ButtonBlock } from "@/components/block/button-block";
import { CardBlock } from "@/components/block/card-block";

// Container blocks
import { GridBlock } from "@/components/block/grid-block";
import { FlexBlock } from "@/components/block/flex-block";
import { StackBlock } from "@/components/block/stack-block";

/**
 * BlockRenderer - Renders an array of blocks recursively
 *
 * This component takes block data and renders the appropriate
 * block component for each one. Container blocks recursively
 * render their children through this same component.
 */
type BlockRendererProps = {
  blocks: RootBlock[];
};

/**
 * Render a single block with proper type narrowing and recursive handling
 */
function renderBlock(block: RootBlock): React.ReactNode {
  // Container blocks - handle recursively
  if (isContainerBlock(block)) {
    switch (block._type) {
      case "grid-block":
        return (
          <GridBlock
            key={block._key}
            data={block.data}
            blocks={block.blocks}
            renderBlock={renderBlock}
          />
        );

      case "flex-block":
        return (
          <FlexBlock
            key={block._key}
            data={block.data}
            blocks={block.blocks}
            renderBlock={renderBlock}
          />
        );

      case "stack-block":
        return (
          <StackBlock
            key={block._key}
            data={block.data}
            blocks={block.blocks}
            renderBlock={renderBlock}
          />
        );
    }
  }

  // Content blocks - leaf nodes
  switch (block._type) {
    case "heading-block":
      return <HeadingBlock key={block._key} data={block.data} />;

    case "text-block":
      return <TextBlock key={block._key} data={block.data} />;

    case "image-block":
      return <ImageBlock key={block._key} data={block.data} />;

    case "button-block":
      return <ButtonBlock key={block._key} data={block.data} />;

    case "card-block":
      return <CardBlock key={block._key} data={block.data} />;

    default:
      // Exhaustive check - TypeScript will error if we miss a block type
      block satisfies never;
      return null;
  }
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return <>{blocks.map(renderBlock)}</>;
}
