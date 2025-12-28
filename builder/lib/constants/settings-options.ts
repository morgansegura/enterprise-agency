/**
 * Shared Settings Options
 *
 * Centralized constants for all settings popovers and panels.
 * These map to Tailwind token values used throughout the builder.
 */

// =============================================================================
// Types
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
}

// =============================================================================
// Spacing Options
// =============================================================================

/** Standard spacing scale (none through 3xl) */
export const SPACING_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
];

/** Extended spacing scale (includes 4xl through 7xl for large padding) */
export const EXTENDED_SPACING_OPTIONS: SelectOption[] = [
  ...SPACING_OPTIONS,
  { value: "4xl", label: "4XL" },
  { value: "5xl", label: "5XL" },
  { value: "6xl", label: "6XL" },
  { value: "7xl", label: "7XL" },
];

/** Gap options (typically fewer options than full spacing) */
export const GAP_OPTIONS: SelectOption[] = SPACING_OPTIONS.slice(0, 7); // none through xl

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
export const BORDER_STYLE_OPTIONS: SelectOption[] = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
];

/** Border radius options */
export const BORDER_RADIUS_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "SM" },
  { value: "md", label: "MD" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "full", label: "Full" },
];

// =============================================================================
// Shadow Options
// =============================================================================

export const SHADOW_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "X-Large" },
  { value: "inner", label: "Inner" },
];

// =============================================================================
// Layout Options
// =============================================================================

/** Max width presets for sections */
export const SECTION_WIDTH_OPTIONS: SelectOption[] = [
  { value: "narrow", label: "Narrow (768px)" },
  { value: "container", label: "Container (1280px)" },
  { value: "wide", label: "Wide (1536px)" },
  { value: "full", label: "Full Width" },
];

/** Max width presets for containers */
export const CONTAINER_WIDTH_OPTIONS: SelectOption[] = [
  { value: "none", label: "None" },
  { value: "xs", label: "XS (480px)" },
  { value: "sm", label: "SM (640px)" },
  { value: "md", label: "MD (768px)" },
  { value: "lg", label: "LG (1024px)" },
  { value: "xl", label: "XL (1280px)" },
  { value: "full", label: "Full Width" },
];

/** Min height options for sections */
export const SECTION_MIN_HEIGHT_OPTIONS: SelectOption[] = [
  { value: "none", label: "Auto" },
  { value: "sm", label: "Small (300px)" },
  { value: "md", label: "Medium (400px)" },
  { value: "lg", label: "Large (500px)" },
  { value: "xl", label: "X-Large (600px)" },
  { value: "screen", label: "Full Screen (100vh)" },
];

/** Min height options for containers */
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

/** Background preset options (for quick selection) */
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
// Typography Options (for blocks)
// =============================================================================

/** Heading levels */
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
export const FONT_SIZE_OPTIONS: SelectOption[] = [
  { value: "xs", label: "XS" },
  { value: "sm", label: "SM" },
  { value: "base", label: "Base" },
  { value: "lg", label: "LG" },
  { value: "xl", label: "XL" },
  { value: "2xl", label: "2XL" },
  { value: "3xl", label: "3XL" },
  { value: "4xl", label: "4XL" },
  { value: "5xl", label: "5XL" },
];

/** Font weight options */
export const FONT_WEIGHT_OPTIONS: SelectOption[] = [
  { value: "thin", label: "Thin" },
  { value: "light", label: "Light" },
  { value: "normal", label: "Normal" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
  { value: "extrabold", label: "Extra Bold" },
  { value: "black", label: "Black" },
];
