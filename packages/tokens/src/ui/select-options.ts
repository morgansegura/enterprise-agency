/**
 * Select Option Generators
 *
 * Utilities to generate SelectOption arrays from token scales.
 * These are used by the builder UI components.
 */

import {
  sizeScale,
  sectionSizeScale,
  radiusScale,
  shadowScale,
  gapScale,
  weightScale,
  textSizeScale,
  headingSizeScale,
} from "../semantic/scales";

import {
  borderStyle,
  borderWidthNamed,
  textAlign,
  fontSize,
  fontWeight,
  justifyContent,
  alignItems,
  flexDirection,
  overflow,
  gridTemplateColumns,
} from "../primitives";

// =============================================================================
// Types
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

// =============================================================================
// Generator Functions
// =============================================================================

/**
 * Generate SelectOption array from a scale object
 */
export function generateOptionsFromScale<
  T extends Record<string, { value: string; px?: number }>,
>(
  scale: T,
  formatLabel?: (key: string, data: T[keyof T]) => string,
): SelectOption[] {
  return Object.entries(scale).map(([key, data]) => ({
    value: key,
    label: formatLabel
      ? formatLabel(key, data as T[keyof T])
      : key.toUpperCase(),
    description: "px" in data ? `${data.px}px` : undefined,
  }));
}

/**
 * Generate SelectOption array from a simple key-value object
 */
export function generateOptionsFromObject(
  obj: Record<string, string>,
  formatLabel?: (key: string) => string,
): SelectOption[] {
  return Object.keys(obj)
    .filter((key) => key !== "") // Skip empty default keys
    .map((key) => ({
      value: key,
      label: formatLabel ? formatLabel(key) : capitalize(key),
    }));
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format size key to label (xs -> XS, 2xl -> 2XL)
 */
function formatSizeLabel(key: string): string {
  if (key === "none") return "None";
  return key.toUpperCase();
}

// =============================================================================
// Spacing Options
// =============================================================================

/** Standard spacing scale (none through 3xl) */
export const SPACING_OPTIONS: SelectOption[] = Object.entries(sizeScale).map(
  ([key, data]) => ({
    value: key,
    label: formatSizeLabel(key),
    description: `${data.px}px`,
  }),
);

/** Extended spacing scale (includes larger sizes for sections) */
export const EXTENDED_SPACING_OPTIONS: SelectOption[] = Object.entries(
  sectionSizeScale,
).map(([key, data]) => ({
  value: key,
  label: formatSizeLabel(key),
  description: `${data.px}px`,
}));

/** Gap options (same as spacing) */
export const GAP_OPTIONS: SelectOption[] = Object.entries(gapScale).map(
  ([key, data]) => ({
    value: key,
    label: formatSizeLabel(key),
    description: `${data.px}px`,
  }),
);

// =============================================================================
// Border Options
// =============================================================================

/** Border width options */
export const BORDER_WIDTH_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "thin", label: "Thin (1px)" },
  { value: "medium", label: "Medium (2px)" },
  { value: "thick", label: "Thick (4px)" },
];

/** Border style options */
export const BORDER_STYLE_OPTIONS: SelectOption[] = Object.keys(borderStyle)
  .filter((key) => key !== "hidden" && key !== "none")
  .map((key) => ({
    value: key,
    label: capitalize(key),
  }));

/** Border radius options */
export const BORDER_RADIUS_OPTIONS: SelectOption[] = Object.entries(radiusScale)
  .filter(([key]) => key !== "default")
  .map(([key, data]) => ({
    value: key,
    label: formatSizeLabel(key),
    description: key !== "full" ? `${data.px}px` : undefined,
  }));

// =============================================================================
// Shadow Options
// =============================================================================

export const SHADOW_OPTIONS: SelectOption[] = Object.entries(shadowScale).map(
  ([key]) => ({
    value: key,
    label:
      key === "none" ? "None" : key === "inner" ? "Inner" : capitalize(key),
  }),
);

// =============================================================================
// Layout Options
// =============================================================================

/** Section width presets */
export const SECTION_WIDTH_OPTIONS: SelectOption[] = [
  { value: "narrow", label: "Narrow (768px)" },
  { value: "container", label: "Container (1280px)" },
  { value: "wide", label: "Wide (1536px)" },
  { value: "full", label: "Full Width" },
];

/** Container max-width options */
export const CONTAINER_WIDTH_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "xs", label: "XS (480px)" },
  { value: "sm", label: "SM (640px)" },
  { value: "md", label: "MD (768px)" },
  { value: "lg", label: "LG (1024px)" },
  { value: "xl", label: "XL (1280px)" },
  { value: "full", label: "Full Width" },
];

/** Section min-height options */
export const SECTION_MIN_HEIGHT_OPTIONS: SelectOption[] = [
  { value: "none", label: "Auto" },
  { value: "sm", label: "Small (300px)" },
  { value: "md", label: "Medium (400px)" },
  { value: "lg", label: "Large (500px)" },
  { value: "xl", label: "X-Large (600px)" },
  { value: "screen", label: "Full Screen (100vh)" },
];

/** Container min-height options */
export const CONTAINER_MIN_HEIGHT_OPTIONS: SelectOption[] = [
  { value: "none", label: "Auto" },
  { value: "sm", label: "Small (200px)" },
  { value: "md", label: "Medium (300px)" },
  { value: "lg", label: "Large (400px)" },
  { value: "xl", label: "Extra Large (500px)" },
];

/** Overflow options */
export const OVERFLOW_OPTIONS: SelectOption[] = [
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
  { value: "scroll", label: "Scroll" },
  { value: "auto", label: "Auto" },
];

// =============================================================================
// Flex/Grid Layout Options
// =============================================================================

/** Flex direction options */
export const DIRECTION_OPTIONS: SelectOption[] = [
  { value: "column", label: "Vertical" },
  { value: "row", label: "Horizontal" },
];

/** Justify content options */
export const JUSTIFY_OPTIONS: SelectOption[] = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
  { value: "between", label: "Space Between" },
  { value: "around", label: "Space Around" },
  { value: "evenly", label: "Space Evenly" },
];

/** Align items options */
export const ALIGN_OPTIONS: SelectOption[] = [
  { value: "start", label: "Start" },
  { value: "center", label: "Center" },
  { value: "end", label: "End" },
  { value: "stretch", label: "Stretch" },
  { value: "baseline", label: "Baseline" },
];

/** Grid columns options */
export const GRID_COLUMNS_OPTIONS: SelectOption[] = [
  { value: "1", label: "1 Column" },
  { value: "2", label: "2 Columns" },
  { value: "3", label: "3 Columns" },
  { value: "4", label: "4 Columns" },
  { value: "auto", label: "Auto-fit" },
];

// =============================================================================
// Background Options
// =============================================================================

/** Background type options */
export const BACKGROUND_TYPE_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "color", label: "Color" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
];

/** Background preset options */
export const BACKGROUND_PRESET_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "white", label: "White" },
  { value: "gray", label: "Gray" },
  { value: "dark", label: "Dark" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "muted", label: "Muted" },
  { value: "accent", label: "Accent" },
];

/** Gradient type options */
export const GRADIENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
];

/** Background size options */
export const BACKGROUND_SIZE_OPTIONS: SelectOption[] = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "auto", label: "Auto" },
];

/** Background position options */
export const BACKGROUND_POSITION_OPTIONS: SelectOption[] = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
  { value: "bottom", label: "Bottom" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

// =============================================================================
// Typography Options
// =============================================================================

/** Heading level options */
export const HEADING_LEVEL_OPTIONS: SelectOption[] = [
  { value: "h1", label: "H1" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
];

/** Text alignment options */
export const TEXT_ALIGN_OPTIONS: SelectOption[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" },
];

/** Font size options */
export const FONT_SIZE_OPTIONS: SelectOption[] = Object.entries(fontSize).map(
  ([key]) => ({
    value: key,
    label: formatSizeLabel(key),
  }),
);

/** Font weight options */
export const FONT_WEIGHT_OPTIONS: SelectOption[] = Object.entries(
  weightScale,
).map(([key, data]) => ({
  value: key,
  label: capitalize(key),
  description: `${data.numeric}`,
}));
