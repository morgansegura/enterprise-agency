/**
 * Semantic Token Scales
 *
 * These scales provide a semantic abstraction over Tailwind primitives.
 * Components use these scales via data attributes, which map to CSS variables.
 *
 * Example: data-padding-y="lg" → --padding-y: var(--spacing-6)
 */

import {
  spacing,
  spacingWithPx,
  fontSize,
  fontSizeWithPx,
  fontWeight,
  lineHeight,
  borderRadius,
  borderRadiusWithPx,
  boxShadowNamed,
  maxWidth,
  gap,
} from "../primitives";

// =============================================================================
// Size Scales (for padding, margin, gap)
// =============================================================================

/**
 * Standard size scale used across components
 * Maps semantic sizes to Tailwind spacing values
 */
export const sizeScale = {
  none: { key: "0", value: spacing["0"], px: spacingWithPx["0"].px },
  xs: { key: "1", value: spacing["1"], px: spacingWithPx["1"].px },
  sm: { key: "2", value: spacing["2"], px: spacingWithPx["2"].px },
  md: { key: "4", value: spacing["4"], px: spacingWithPx["4"].px },
  lg: { key: "6", value: spacing["6"], px: spacingWithPx["6"].px },
  xl: { key: "8", value: spacing["8"], px: spacingWithPx["8"].px },
  "2xl": { key: "12", value: spacing["12"], px: spacingWithPx["12"].px },
  "3xl": { key: "16", value: spacing["16"], px: spacingWithPx["16"].px },
  "4xl": { key: "20", value: spacing["20"], px: spacingWithPx["20"].px },
  "5xl": { key: "24", value: spacing["24"], px: spacingWithPx["24"].px },
} as const;

export type SizeScaleKey = keyof typeof sizeScale;

/**
 * Extended size scale for section-level spacing
 */
export const sectionSizeScale = {
  ...sizeScale,
  "6xl": { key: "32", value: spacing["32"], px: spacingWithPx["32"].px },
  "7xl": { key: "40", value: spacing["40"], px: spacingWithPx["40"].px },
  "8xl": { key: "48", value: spacing["48"], px: spacingWithPx["48"].px },
  "9xl": { key: "64", value: spacing["64"], px: spacingWithPx["64"].px },
  "10xl": { key: "80", value: spacing["80"], px: spacingWithPx["80"].px },
  "11xl": { key: "96", value: spacing["96"], px: spacingWithPx["96"].px },
} as const;

export type SectionSizeScaleKey = keyof typeof sectionSizeScale;

// =============================================================================
// Typography Scales
// =============================================================================

/**
 * Text size scale for body text and general content
 */
export const textSizeScale = {
  xs: { key: "xs", value: fontSize["xs"], px: fontSizeWithPx["xs"].px },
  sm: { key: "sm", value: fontSize["sm"], px: fontSizeWithPx["sm"].px },
  base: { key: "base", value: fontSize["base"], px: fontSizeWithPx["base"].px },
  lg: { key: "lg", value: fontSize["lg"], px: fontSizeWithPx["lg"].px },
  xl: { key: "xl", value: fontSize["xl"], px: fontSizeWithPx["xl"].px },
} as const;

export type TextSizeScaleKey = keyof typeof textSizeScale;

/**
 * Heading size scale for headings H1-H6
 */
export const headingSizeScale = {
  xs: { key: "lg", value: fontSize["lg"], px: fontSizeWithPx["lg"].px },
  sm: { key: "xl", value: fontSize["xl"], px: fontSizeWithPx["xl"].px },
  md: { key: "2xl", value: fontSize["2xl"], px: fontSizeWithPx["2xl"].px },
  lg: { key: "3xl", value: fontSize["3xl"], px: fontSizeWithPx["3xl"].px },
  xl: { key: "4xl", value: fontSize["4xl"], px: fontSizeWithPx["4xl"].px },
  "2xl": { key: "5xl", value: fontSize["5xl"], px: fontSizeWithPx["5xl"].px },
  "3xl": { key: "6xl", value: fontSize["6xl"], px: fontSizeWithPx["6xl"].px },
  "4xl": { key: "7xl", value: fontSize["7xl"], px: fontSizeWithPx["7xl"].px },
  "5xl": { key: "8xl", value: fontSize["8xl"], px: fontSizeWithPx["8xl"].px },
  "6xl": { key: "9xl", value: fontSize["9xl"], px: fontSizeWithPx["9xl"].px },
} as const;

export type HeadingSizeScaleKey = keyof typeof headingSizeScale;

/**
 * Font weight scale
 */
export const weightScale = {
  thin: { key: "thin", value: fontWeight["thin"], numeric: 100 },
  extralight: {
    key: "extralight",
    value: fontWeight["extralight"],
    numeric: 200,
  },
  light: { key: "light", value: fontWeight["light"], numeric: 300 },
  normal: { key: "normal", value: fontWeight["normal"], numeric: 400 },
  medium: { key: "medium", value: fontWeight["medium"], numeric: 500 },
  semibold: { key: "semibold", value: fontWeight["semibold"], numeric: 600 },
  bold: { key: "bold", value: fontWeight["bold"], numeric: 700 },
  extrabold: { key: "extrabold", value: fontWeight["extrabold"], numeric: 800 },
  black: { key: "black", value: fontWeight["black"], numeric: 900 },
} as const;

export type WeightScaleKey = keyof typeof weightScale;

/**
 * Line height scale
 */
export const leadingScale = {
  none: { key: "none", value: lineHeight["none"], multiplier: 1 },
  tight: { key: "tight", value: lineHeight["tight"], multiplier: 1.25 },
  snug: { key: "snug", value: lineHeight["snug"], multiplier: 1.375 },
  normal: { key: "normal", value: lineHeight["normal"], multiplier: 1.5 },
  relaxed: { key: "relaxed", value: lineHeight["relaxed"], multiplier: 1.625 },
  loose: { key: "loose", value: lineHeight["loose"], multiplier: 2 },
} as const;

export type LeadingScaleKey = keyof typeof leadingScale;

// =============================================================================
// Border Scales
// =============================================================================

/**
 * Border radius scale
 */
export const radiusScale = {
  none: {
    key: "none",
    value: borderRadius["none"],
    px: borderRadiusWithPx["none"].px,
  },
  sm: { key: "sm", value: borderRadius["sm"], px: borderRadiusWithPx["sm"].px },
  default: {
    key: "",
    value: borderRadius[""],
    px: borderRadiusWithPx["DEFAULT"].px,
  },
  md: { key: "md", value: borderRadius["md"], px: borderRadiusWithPx["md"].px },
  lg: { key: "lg", value: borderRadius["lg"], px: borderRadiusWithPx["lg"].px },
  xl: { key: "xl", value: borderRadius["xl"], px: borderRadiusWithPx["xl"].px },
  "2xl": {
    key: "2xl",
    value: borderRadius["2xl"],
    px: borderRadiusWithPx["2xl"].px,
  },
  "3xl": {
    key: "3xl",
    value: borderRadius["3xl"],
    px: borderRadiusWithPx["3xl"].px,
  },
  full: {
    key: "full",
    value: borderRadius["full"],
    px: borderRadiusWithPx["full"].px,
  },
} as const;

export type RadiusScaleKey = keyof typeof radiusScale;

// =============================================================================
// Shadow Scales
// =============================================================================

/**
 * Box shadow scale
 */
export const shadowScale = {
  none: { key: "none", value: boxShadowNamed["none"] },
  sm: { key: "sm", value: boxShadowNamed["sm"] },
  default: { key: "default", value: boxShadowNamed["default"] },
  md: { key: "md", value: boxShadowNamed["md"] },
  lg: { key: "lg", value: boxShadowNamed["lg"] },
  xl: { key: "xl", value: boxShadowNamed["xl"] },
  "2xl": { key: "2xl", value: boxShadowNamed["2xl"] },
  inner: { key: "inner", value: boxShadowNamed["inner"] },
} as const;

export type ShadowScaleKey = keyof typeof shadowScale;

// =============================================================================
// Container Width Scales
// =============================================================================

/**
 * Container max-width scale
 */
export const containerScale = {
  xs: { key: "xs", value: maxWidth["xs"] },
  sm: { key: "sm", value: maxWidth["sm"] },
  md: { key: "md", value: maxWidth["md"] },
  lg: { key: "lg", value: maxWidth["lg"] },
  xl: { key: "xl", value: maxWidth["xl"] },
  "2xl": { key: "2xl", value: maxWidth["2xl"] },
  "3xl": { key: "3xl", value: maxWidth["3xl"] },
  "4xl": { key: "4xl", value: maxWidth["4xl"] },
  "5xl": { key: "5xl", value: maxWidth["5xl"] },
  "6xl": { key: "6xl", value: maxWidth["6xl"] },
  "7xl": { key: "7xl", value: maxWidth["7xl"] },
  full: { key: "full", value: maxWidth["full"] },
  prose: { key: "prose", value: maxWidth["prose"] },
  "screen-sm": { key: "screen-sm", value: maxWidth["screen-sm"] },
  "screen-md": { key: "screen-md", value: maxWidth["screen-md"] },
  "screen-lg": { key: "screen-lg", value: maxWidth["screen-lg"] },
  "screen-xl": { key: "screen-xl", value: maxWidth["screen-xl"] },
  "screen-2xl": { key: "screen-2xl", value: maxWidth["screen-2xl"] },
} as const;

export type ContainerScaleKey = keyof typeof containerScale;

// =============================================================================
// Gap Scales
// =============================================================================

/**
 * Gap scale for flex/grid layouts
 */
export const gapScale = {
  none: { key: "0", value: gap["0"], px: 0 },
  xs: { key: "1", value: gap["1"], px: 4 },
  sm: { key: "2", value: gap["2"], px: 8 },
  md: { key: "4", value: gap["4"], px: 16 },
  lg: { key: "6", value: gap["6"], px: 24 },
  xl: { key: "8", value: gap["8"], px: 32 },
  "2xl": { key: "12", value: gap["12"], px: 48 },
  "3xl": { key: "16", value: gap["16"], px: 64 },
} as const;

export type GapScaleKey = keyof typeof gapScale;

// =============================================================================
// Combined Scales Export
// =============================================================================

export const scales = {
  size: sizeScale,
  sectionSize: sectionSizeScale,
  textSize: textSizeScale,
  headingSize: headingSizeScale,
  weight: weightScale,
  leading: leadingScale,
  radius: radiusScale,
  shadow: shadowScale,
  container: containerScale,
  gap: gapScale,
} as const;
