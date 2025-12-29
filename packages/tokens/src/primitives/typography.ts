/**
 * Tailwind CSS Typography Primitives
 *
 * Font sizes, weights, line heights, letter spacing from Tailwind CSS v3.4
 */

// =============================================================================
// Font Size
// =============================================================================

export const fontSize = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px
  "8xl": "6rem", // 96px
  "9xl": "8rem", // 128px
} as const;

export const fontSizeWithPx = {
  xs: { value: "0.75rem", px: 12 },
  sm: { value: "0.875rem", px: 14 },
  base: { value: "1rem", px: 16 },
  lg: { value: "1.125rem", px: 18 },
  xl: { value: "1.25rem", px: 20 },
  "2xl": { value: "1.5rem", px: 24 },
  "3xl": { value: "1.875rem", px: 30 },
  "4xl": { value: "2.25rem", px: 36 },
  "5xl": { value: "3rem", px: 48 },
  "6xl": { value: "3.75rem", px: 60 },
  "7xl": { value: "4.5rem", px: 72 },
  "8xl": { value: "6rem", px: 96 },
  "9xl": { value: "8rem", px: 128 },
} as const;

// =============================================================================
// Font Weight
// =============================================================================

export const fontWeight = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

// =============================================================================
// Line Height
// =============================================================================

export const lineHeight = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
  // Numeric line heights
  "3": "0.75rem", // 12px
  "4": "1rem", // 16px
  "5": "1.25rem", // 20px
  "6": "1.5rem", // 24px
  "7": "1.75rem", // 28px
  "8": "2rem", // 32px
  "9": "2.25rem", // 36px
  "10": "2.5rem", // 40px
} as const;

// =============================================================================
// Letter Spacing
// =============================================================================

export const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

// =============================================================================
// Font Family (Default Tailwind stacks)
// =============================================================================

export const fontFamily = {
  sans: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const;

// =============================================================================
// Text Decoration
// =============================================================================

export const textDecoration = {
  underline: "underline",
  overline: "overline",
  "line-through": "line-through",
  "no-underline": "none",
} as const;

export const textDecorationStyle = {
  solid: "solid",
  double: "double",
  dotted: "dotted",
  dashed: "dashed",
  wavy: "wavy",
} as const;

export const textDecorationThickness = {
  auto: "auto",
  "from-font": "from-font",
  "0": "0px",
  "1": "1px",
  "2": "2px",
  "4": "4px",
  "8": "8px",
} as const;

// =============================================================================
// Text Transform
// =============================================================================

export const textTransform = {
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
  "normal-case": "none",
} as const;

// =============================================================================
// Text Align
// =============================================================================

export const textAlign = {
  left: "left",
  center: "center",
  right: "right",
  justify: "justify",
  start: "start",
  end: "end",
} as const;

// =============================================================================
// Vertical Align
// =============================================================================

export const verticalAlign = {
  baseline: "baseline",
  top: "top",
  middle: "middle",
  bottom: "bottom",
  "text-top": "text-top",
  "text-bottom": "text-bottom",
  sub: "sub",
  super: "super",
} as const;

// =============================================================================
// Text Overflow
// =============================================================================

export const textOverflow = {
  truncate: "ellipsis",
  "text-ellipsis": "ellipsis",
  "text-clip": "clip",
} as const;

// =============================================================================
// Whitespace
// =============================================================================

export const whitespace = {
  normal: "normal",
  nowrap: "nowrap",
  pre: "pre",
  "pre-line": "pre-line",
  "pre-wrap": "pre-wrap",
  "break-spaces": "break-spaces",
} as const;

// =============================================================================
// Word Break
// =============================================================================

export const wordBreak = {
  normal: "normal",
  words: "break-word",
  all: "break-all",
  keep: "keep-all",
} as const;

// =============================================================================
// Types
// =============================================================================

export type FontSizeKey = keyof typeof fontSize;
export type FontWeightKey = keyof typeof fontWeight;
export type LineHeightKey = keyof typeof lineHeight;
export type LetterSpacingKey = keyof typeof letterSpacing;
export type FontFamilyKey = keyof typeof fontFamily;
export type TextAlignKey = keyof typeof textAlign;
export type TextTransformKey = keyof typeof textTransform;

// =============================================================================
// Combined Typography Config
// =============================================================================

export const typography = {
  fontSize,
  fontSizeWithPx,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontFamily,
  textDecoration,
  textDecorationStyle,
  textDecorationThickness,
  textTransform,
  textAlign,
  verticalAlign,
  textOverflow,
  whitespace,
  wordBreak,
} as const;
