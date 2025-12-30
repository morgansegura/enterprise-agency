/**
 * Heading Block Component Schema
 *
 * Heading blocks display titles and section headings (H1-H6).
 */

import type {
  HeadingSizeScaleKey,
  WeightScaleKey,
  LeadingScaleKey,
  SizeScaleKey,
} from "../semantic";
import type { VisibilityProperties, MarginProperties } from "./base-properties";

// =============================================================================
// Heading-Specific Properties
// =============================================================================

/** Numeric heading level (1-6) for component properties */
export type HeadingLevelNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingTypographyProperties {
  /** Heading level (H1-H6) */
  level?: HeadingLevelNumber;
  /** Font size (can override default for level) */
  fontSize?: HeadingSizeScaleKey;
  /** Font weight */
  fontWeight?: WeightScaleKey;
  /** Line height */
  lineHeight?: LeadingScaleKey;
  /** Letter spacing */
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  /** Font family */
  fontFamily?: "sans" | "serif" | "mono" | string;
  /** Text color (Tailwind class) */
  textColor?: string;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Text decoration */
  textDecoration?: "none" | "underline" | "line-through";
  /** Text transform */
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
}

export interface HeadingLayoutProperties {
  /** Maximum width */
  maxWidth?:
    | "none"
    | "prose"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "full";
  /** Text wrapping behavior */
  whiteSpace?: "normal" | "nowrap";
  /** Balance text for better line breaks */
  textWrap?: "wrap" | "nowrap" | "balance" | "pretty";
}

// =============================================================================
// Heading Block Schema
// =============================================================================

export interface HeadingProperties
  extends VisibilityProperties,
    MarginProperties,
    HeadingTypographyProperties,
    HeadingLayoutProperties {
  /** Unique identifier */
  id: string;
  /** The heading text content */
  content: string;
  /** Block name for display in editor */
  name?: string;
  /** Custom CSS classes */
  className?: string;
}

// =============================================================================
// Default Font Size by Heading Level
// =============================================================================

export const headingLevelDefaults: Record<
  HeadingLevelNumber,
  HeadingSizeScaleKey
> = {
  1: "4xl",
  2: "3xl",
  3: "2xl",
  4: "xl",
  5: "lg",
  6: "md",
};

// =============================================================================
// Heading Default Values
// =============================================================================

export const headingDefaults: Partial<HeadingProperties> = {
  level: 2,
  fontSize: "3xl",
  fontWeight: "bold",
  lineHeight: "tight",
  letterSpacing: "tight",
  fontFamily: "sans",
  textAlign: "left",
  textDecoration: "none",
  textTransform: "none",
  maxWidth: "none",
  whiteSpace: "normal",
  textWrap: "balance",
  showOnMobile: true,
  showOnTablet: true,
  showOnDesktop: true,
};

// =============================================================================
// Heading Property Groups (for UI organization)
// =============================================================================

export const headingPropertyGroups = {
  level: ["level"],
  typography: [
    "fontSize",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "fontFamily",
    "textColor",
  ],
  alignment: ["textAlign", "textDecoration", "textTransform", "textWrap"],
  layout: ["maxWidth", "whiteSpace"],
  spacing: [
    "marginY",
    "marginX",
    "marginTop",
    "marginBottom",
    "marginLeft",
    "marginRight",
  ],
  visibility: ["showOnMobile", "showOnTablet", "showOnDesktop"],
  advanced: ["className"],
} as const;

// =============================================================================
// Heading Property Labels (for UI display)
// =============================================================================

export const headingPropertyLabels: Record<string, string> = {
  level: "Heading Level",
  fontSize: "Font Size",
  fontWeight: "Font Weight",
  lineHeight: "Line Height",
  letterSpacing: "Letter Spacing",
  fontFamily: "Font Family",
  textColor: "Text Color",
  textAlign: "Alignment",
  textDecoration: "Decoration",
  textTransform: "Transform",
  textWrap: "Text Wrap",
  maxWidth: "Max Width",
  whiteSpace: "White Space",
  marginY: "Vertical Margin",
  marginX: "Horizontal Margin",
  showOnMobile: "Mobile",
  showOnTablet: "Tablet",
  showOnDesktop: "Desktop",
};
