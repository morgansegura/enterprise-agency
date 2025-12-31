/**
 * Block Renderer Registry
 *
 * Maps block types to their renderer components.
 * Used by BlockRenderer to render blocks by type.
 */

import type { ComponentType } from "react";
import type { BlockRendererProps, Block, Breakpoint } from "../types";

// Content blocks
import { HeadingBlock } from "../content-blocks/heading-block";
import { TextBlock } from "../content-blocks/text-block";
import { ButtonBlock } from "../content-blocks/button-block";
import { SpacerBlock } from "../content-blocks/spacer-block";
import { DividerBlock } from "../content-blocks/divider-block";
import { ImageBlock } from "../content-blocks/image-block";
import { QuoteBlock } from "../content-blocks/quote-block";
import { IconBlock } from "../content-blocks/icon-block";
import { RichTextBlock } from "../content-blocks/rich-text-block";
import { ListBlock } from "../content-blocks/list-block";

// Container blocks
import { ContainerBlock } from "../container-blocks/container-block";
import { GridBlock } from "../container-blocks/grid-block";
import { FlexBlock } from "../container-blocks/flex-block";
import { StackBlock } from "../container-blocks/stack-block";

/**
 * Map of block types to their renderer components
 */
export const blockRenderers: Record<
  string,
  ComponentType<BlockRendererProps>
> = {
  // Content blocks
  heading: HeadingBlock,
  text: TextBlock,
  button: ButtonBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
  image: ImageBlock,
  quote: QuoteBlock,
  icon: IconBlock,
  "rich-text": RichTextBlock,
  list: ListBlock,
  // Container blocks
  container: ContainerBlock,
  grid: GridBlock,
  flex: FlexBlock,
  stack: StackBlock,
};

/**
 * Container block types that can hold child blocks
 */
export const containerBlockTypes = new Set([
  "container",
  "grid",
  "flex",
  "stack",
  "columns",
]);

/**
 * Check if a block type is a container
 */
export function isContainerBlock(type: string): boolean {
  return containerBlockTypes.has(type);
}

/**
 * Get renderer component for a block type
 */
export function getBlockRenderer(
  type: string,
): ComponentType<BlockRendererProps> | null {
  return blockRenderers[type] || null;
}

export type { BlockRendererProps, Block, Breakpoint };
