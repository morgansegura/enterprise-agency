import {
  HeadingBlock,
  type HeadingBlockData,
} from "@/components/block/heading-block";
import { TextBlock, type TextBlockData } from "@/components/block/text-block";
import { cn } from "@/lib/utils";
import type { Spacing } from "@/lib/types";
import "./block-renderer.css";

/**
 * Map of block types to their data shapes
 * This ensures type safety when rendering blocks
 */
type BlockDataMap = {
  "heading-block": HeadingBlockData;
  "text-block": TextBlockData;
  // Add more as you create blocks
  // 'image-block': ImageBlockData
};

/**
 * Discriminated union of all block types
 * TypeScript will narrow this automatically based on _type
 */
export type TypedBlock = {
  [K in keyof BlockDataMap]: {
    _type: K;
    _key: string;
    data: BlockDataMap[K];
  };
}[keyof BlockDataMap];

/**
 * BlockRenderer - Renders an array of blocks
 *
 * This component takes block data and renders the appropriate
 * block component for each one. It's the bridge between data
 * and visual components.
 */
type BlockRendererProps = {
  blocks: TypedBlock[];
  /** Gap between blocks */
  gap?: Spacing;
  className?: string;
};

/**
 * Render a single block with proper type narrowing
 */
function renderBlock(block: TypedBlock) {
  // TypeScript narrows the type based on _type
  switch (block._type) {
    case "heading-block":
      // block.data is HeadingBlockData here
      return <HeadingBlock key={block._key} {...block.data} />;

    case "text-block":
      // block.data is TextBlockData here
      return <TextBlock key={block._key} {...block.data} />;

    // Add more cases as you create blocks
    // case 'image-block':
    //   return <ImageBlock key={block._key} {...block.data} />

    default:
      // This will cause a TypeScript error if we forget to handle a block type
      // Exhaustive check - if we reach here, TypeScript knows all cases are handled
      block satisfies never;
      return null;
  }
}

export function BlockRenderer({
  blocks,
  gap = "md",
  className,
}: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className={className}>
        <p className="text-gray-500 text-center py-8">
          No content yet. Add some blocks to get started!
        </p>
      </div>
    );
  }

  return (
    <div className={cn("block-renderer", className)} data-gap={gap}>
      {blocks.map(renderBlock)}
    </div>
  );
}
