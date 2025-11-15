/**
 * Footer Type Definitions
 * Enterprise footer system using composable blocks
 */

import type { RootBlock } from "@/lib/blocks/types";
import type { BackgroundVariant, Spacing } from "@/lib/types";

/**
 * Footer layout templates
 * Determines column structure
 */
export type FooterTemplate =
  | "1-column" // Single column
  | "2-column" // Two equal columns
  | "3-column" // Three equal columns
  | "4-column" // Four equal columns
  | "complex"; // Custom widths

/**
 * Column width for complex layouts
 */
export type ColumnWidth = "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full";

/**
 * Footer column
 * Contains blocks just like page sections
 */
export type FooterColumn = {
  _key: string;
  width?: ColumnWidth; // Only used with "complex" template
  blocks: RootBlock[]; // Reuse existing block system
};

/**
 * Footer bottom bar (copyright, legal, social links)
 * Optional section below main footer columns
 */
export type FooterBottomBar = {
  left?: RootBlock[];
  center?: RootBlock[];
  right?: RootBlock[];
};

/**
 * Footer styling configuration
 */
export type FooterStylingConfig = {
  background?: BackgroundVariant;
  spacing?: Spacing;
  maxWidth?: "full" | "container" | "narrow";
  divider?: boolean; // Show divider between footer and bottom bar
};

/**
 * Complete footer configuration
 * Passed as prop to Footer component
 */
export type FooterConfig = {
  template: FooterTemplate;
  columns: FooterColumn[];
  bottomBar?: FooterBottomBar;
  styling?: FooterStylingConfig;
};
