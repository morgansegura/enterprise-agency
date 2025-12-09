/**
 * Block utilities
 */

import type { RootBlock } from "./types";

/**
 * Type guard to check if a block is a grid block
 */
export function isGridBlock(
  block: RootBlock,
): block is Extract<RootBlock, { _type: "grid-block" }> {
  return block._type === "grid-block";
}

/**
 * Type guard to check if a block is a flex block
 */
export function isFlexBlock(
  block: RootBlock,
): block is Extract<RootBlock, { _type: "flex-block" }> {
  return block._type === "flex-block";
}

/**
 * Type guard to check if a block is a stack block
 */
export function isStackBlock(
  block: RootBlock,
): block is Extract<RootBlock, { _type: "stack-block" }> {
  return block._type === "stack-block";
}

/**
 * Get responsive column classes for grid layouts
 */
export function getColumnClasses(
  columns: number | { mobile?: number; tablet?: number; desktop?: number },
): string {
  if (typeof columns === "number") {
    return `grid-cols-${columns}`;
  }

  const classes: string[] = [];

  if (columns.mobile) {
    classes.push(`grid-cols-${columns.mobile}`);
  }
  if (columns.tablet) {
    classes.push(`md:grid-cols-${columns.tablet}`);
  }
  if (columns.desktop) {
    classes.push(`lg:grid-cols-${columns.desktop}`);
  }

  return classes.join(" ");
}
