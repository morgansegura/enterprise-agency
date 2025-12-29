/**
 * Tailwind CSS Border Primitives
 *
 * Border widths, radii, and styles from Tailwind CSS v3.4
 */

// =============================================================================
// Border Width
// =============================================================================

export const borderWidth = {
  "0": "0px",
  "": "1px", // Default (border without modifier)
  "2": "2px",
  "4": "4px",
  "8": "8px",
} as const;

// Named border widths for semantic usage
export const borderWidthNamed = {
  none: "0px",
  thin: "1px",
  medium: "2px",
  thick: "4px",
} as const;

// =============================================================================
// Border Radius
// =============================================================================

export const borderRadius = {
  none: "0px",
  sm: "0.125rem", // 2px
  "": "0.25rem", // 4px (default)
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
} as const;

export const borderRadiusWithPx = {
  none: { value: "0px", px: 0 },
  sm: { value: "0.125rem", px: 2 },
  DEFAULT: { value: "0.25rem", px: 4 },
  md: { value: "0.375rem", px: 6 },
  lg: { value: "0.5rem", px: 8 },
  xl: { value: "0.75rem", px: 12 },
  "2xl": { value: "1rem", px: 16 },
  "3xl": { value: "1.5rem", px: 24 },
  full: { value: "9999px", px: 9999 },
} as const;

// =============================================================================
// Border Style
// =============================================================================

export const borderStyle = {
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
  double: "double",
  hidden: "hidden",
  none: "none",
} as const;

// =============================================================================
// Outline Width
// =============================================================================

export const outlineWidth = {
  "0": "0px",
  "1": "1px",
  "2": "2px",
  "4": "4px",
  "8": "8px",
} as const;

// =============================================================================
// Outline Style
// =============================================================================

export const outlineStyle = {
  none: "none",
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
  double: "double",
} as const;

// =============================================================================
// Outline Offset
// =============================================================================

export const outlineOffset = {
  "0": "0px",
  "1": "1px",
  "2": "2px",
  "4": "4px",
  "8": "8px",
} as const;

// =============================================================================
// Ring Width (Focus rings)
// =============================================================================

export const ringWidth = {
  "0": "0px",
  "1": "1px",
  "2": "2px",
  "": "3px", // Default
  "4": "4px",
  "8": "8px",
} as const;

// =============================================================================
// Ring Offset Width
// =============================================================================

export const ringOffsetWidth = {
  "0": "0px",
  "1": "1px",
  "2": "2px",
  "4": "4px",
  "8": "8px",
} as const;

// =============================================================================
// Divide Width (Borders between children)
// =============================================================================

export const divideWidth = {
  "0": "0px",
  "": "1px", // Default
  "2": "2px",
  "4": "4px",
  "8": "8px",
  reverse: "0px", // Special value for reverse
} as const;

// =============================================================================
// Types
// =============================================================================

export type BorderWidthKey = keyof typeof borderWidth;
export type BorderWidthNamedKey = keyof typeof borderWidthNamed;
export type BorderRadiusKey = keyof typeof borderRadius;
export type BorderStyleKey = keyof typeof borderStyle;
export type RingWidthKey = keyof typeof ringWidth;

// =============================================================================
// Combined Borders Config
// =============================================================================

export const borders = {
  borderWidth,
  borderWidthNamed,
  borderRadius,
  borderRadiusWithPx,
  borderStyle,
  outlineWidth,
  outlineStyle,
  outlineOffset,
  ringWidth,
  ringOffsetWidth,
  divideWidth,
} as const;
