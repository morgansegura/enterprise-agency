/**
 * Block System Type Definitions
 *
 * This file defines the complete block architecture supporting:
 * - Content blocks (leaf nodes): heading, text, image, etc.
 * - Container blocks (composable): grid, flex, stack
 * - 3-4 level nesting maximum
 * - Type-safe composition
 */

import type { Spacing } from "@/lib/types";

// ========================================
// Responsive Configuration
// ========================================

/** Responsive column configuration */
export type ResponsiveColumns = {
  /** Mobile devices (default) */
  mobile?: 1 | 2;
  /** Tablet devices (md breakpoint) */
  tablet?: 1 | 2 | 3 | 4;
  /** Desktop devices (lg breakpoint) */
  desktop?: 1 | 2 | 3 | 4 | 5 | 6;
};

/** Alignment options for flex/grid */
export type AlignItems = "start" | "center" | "end" | "stretch" | "baseline";

/** Justify content options */
export type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

// ========================================
// Content Block Data Types (Leaf Nodes)
// ========================================

/** Heading block data */
export type HeadingBlockData = {
  text: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
};

/** Text block data */
export type TextBlockData = {
  content: string;
  size?: "sm" | "base" | "lg";
  align?: "left" | "center" | "right" | "justify";
  variant?: "default" | "muted" | "lead" | "subtle";
};

/** Image block data */
export type ImageBlockData = {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  objectFit?: "contain" | "cover" | "fill" | "none";
};

/** Button block data */
export type ButtonBlockData = {
  text: string;
  href?: string;
  onClick?: string; // Action identifier
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

/** Card block data */
export type CardBlockData = {
  title?: string;
  description?: string;
  image?: ImageBlockData;
  imagePosition?: "top" | "left" | "background";
  actions?: ButtonBlockData[];
  variant?: "default" | "elevated" | "outlined";
};

// ========================================
// Container Block Data Types
// ========================================

/** Grid layout configuration */
export type GridLayoutData = {
  columns: ResponsiveColumns | number;
  gap?: Spacing;
  align?: AlignItems;
  justify?: JustifyContent;
};

/** Flex layout configuration */
export type FlexLayoutData = {
  direction?: "row" | "col";
  wrap?: boolean;
  gap?: Spacing;
  align?: AlignItems;
  justify?: JustifyContent;
};

/** Stack layout configuration (vertical flex) */
export type StackLayoutData = {
  gap?: Spacing;
  align?: AlignItems;
};

// ========================================
// Nesting Levels
// ========================================

/**
 * Level 4 - Content Blocks Only (Leaf Nodes)
 * These blocks cannot have children
 */
export type ContentBlock =
  | { _type: "heading-block"; _key: string; data: HeadingBlockData }
  | { _type: "text-block"; _key: string; data: TextBlockData }
  | { _type: "image-block"; _key: string; data: ImageBlockData }
  | { _type: "button-block"; _key: string; data: ButtonBlockData }
  | { _type: "card-block"; _key: string; data: CardBlockData };

/**
 * Level 3 - Shallow Container Blocks
 * Can contain ONLY ContentBlocks (one level of nesting)
 */
export type ShallowContainerBlock =
  | {
      _type: "grid-block";
      _key: string;
      data: GridLayoutData;
      blocks: ContentBlock[];
    }
  | {
      _type: "flex-block";
      _key: string;
      data: FlexLayoutData;
      blocks: ContentBlock[];
    }
  | {
      _type: "stack-block";
      _key: string;
      data: StackLayoutData;
      blocks: ContentBlock[];
    };

/**
 * Level 2 - Deep Container Blocks
 * Can contain ContentBlocks OR ShallowContainerBlocks (two levels of nesting)
 */
export type DeepContainerBlock =
  | {
      _type: "grid-block";
      _key: string;
      data: GridLayoutData;
      blocks: (ContentBlock | ShallowContainerBlock)[];
    }
  | {
      _type: "flex-block";
      _key: string;
      data: FlexLayoutData;
      blocks: (ContentBlock | ShallowContainerBlock)[];
    }
  | {
      _type: "stack-block";
      _key: string;
      data: StackLayoutData;
      blocks: (ContentBlock | ShallowContainerBlock)[];
    };

/**
 * Level 1 - Root Blocks (Section Level)
 * Can contain any block type, creating maximum 4 levels of nesting:
 * Section > DeepContainer > ShallowContainer > Content
 */
export type RootBlock =
  | ContentBlock
  | ShallowContainerBlock
  | DeepContainerBlock;

/**
 * Type guard to check if a block is a container block
 */
export function isContainerBlock(
  block: RootBlock,
): block is ShallowContainerBlock | DeepContainerBlock {
  return "blocks" in block;
}

/**
 * Type guard to check if a block is a content block
 */
export function isContentBlock(block: RootBlock): block is ContentBlock {
  return !("blocks" in block);
}
