/**
 * Shared types for block renderers
 */

import type { Block, Breakpoint } from "@enterprise/tokens";

/**
 * Block Renderer Component Props Interface
 * All block renderers receive these props
 */
export interface BlockRendererProps<T extends Block = Block> {
  block: T;
  /** Current breakpoint for responsive rendering */
  breakpoint?: Breakpoint;
  /** Optional render function for nested blocks */
  renderBlock?: (block: Block, index: number) => React.ReactNode;
}

/**
 * Container block data with child blocks
 */
export interface ContainerBlockData {
  blocks?: Block[];
  [key: string]: unknown;
}

// Re-export Block type from tokens
export type { Block, Breakpoint };
