/**
 * Text Block Component Schema
 *
 * Text blocks display body text content with rich formatting options.
 */

import type {
  TextSizeScaleKey,
  WeightScaleKey,
  LeadingScaleKey,
  SizeScaleKey,
} from "../semantic";
import type { VisibilityProperties, MarginProperties } from "./base-properties";

// =============================================================================
// Text-Specific Properties
// =============================================================================

export interface TextTypographyProperties {
  /** Font size */
  fontSize?: TextSizeScaleKey;
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
  textAlign?: "left" | "center" | "right" | "justify";
  /** Text decoration */
  textDecoration?: "none" | "underline" | "line-through";
  /** Text transform */
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
}

export interface TextLayoutProperties {
  /** Maximum width for text (for readability) */
  maxWidth?: "none" | "prose" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Text wrapping behavior */
  whiteSpace?: "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap";
  /** Word break behavior */
  wordBreak?: "normal" | "break-all" | "keep-all" | "break-word";
  /** Text overflow */
  overflow?: "visible" | "hidden" | "ellipsis";
  /** Number of lines to clamp (0 = no clamp) */
  lineClamp?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

// =============================================================================
// Text Block Schema
// =============================================================================

export interface TextProperties
  extends VisibilityProperties,
    MarginProperties,
    TextTypographyProperties,
    TextLayoutProperties {
  /** Unique identifier */
  id: string;
  /** The text content (can include HTML) */
  content: string;
  /** Block name for display in editor */
  name?: string;
  /** Custom CSS classes */
  className?: string;
  /** HTML tag to use */
  tag?: "p" | "span" | "div" | "blockquote" | "pre" | "code";
}

// =============================================================================
// Text Default Values
// =============================================================================

export const textDefaults: Partial<TextProperties> = {
  fontSize: "base",
  fontWeight: "normal",
  lineHeight: "normal",
  letterSpacing: "normal",
  fontFamily: "sans",
  textAlign: "left",
  textDecoration: "none",
  textTransform: "none",
  maxWidth: "prose",
  whiteSpace: "normal",
  wordBreak: "normal",
  overflow: "visible",
  lineClamp: 0,
  showOnMobile: true,
  showOnTablet: true,
  showOnDesktop: true,
  tag: "p",
};

// =============================================================================
// Text Property Groups (for UI organization)
// =============================================================================

export const textPropertyGroups = {
  typography: [
    "fontSize",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "fontFamily",
    "textColor",
  ],
  alignment: ["textAlign", "textDecoration", "textTransform"],
  layout: ["maxWidth", "whiteSpace", "wordBreak", "overflow", "lineClamp"],
  spacing: [
    "marginY",
    "marginX",
    "marginTop",
    "marginBottom",
    "marginLeft",
    "marginRight",
  ],
  visibility: ["showOnMobile", "showOnTablet", "showOnDesktop"],
  advanced: ["className", "tag"],
} as const;

// =============================================================================
// Text Property Labels (for UI display)
// =============================================================================

export const textPropertyLabels: Record<string, string> = {
  fontSize: "Font Size",
  fontWeight: "Font Weight",
  lineHeight: "Line Height",
  letterSpacing: "Letter Spacing",
  fontFamily: "Font Family",
  textColor: "Text Color",
  textAlign: "Alignment",
  textDecoration: "Decoration",
  textTransform: "Transform",
  maxWidth: "Max Width",
  whiteSpace: "White Space",
  wordBreak: "Word Break",
  overflow: "Overflow",
  lineClamp: "Line Clamp",
  marginY: "Vertical Margin",
  marginX: "Horizontal Margin",
  showOnMobile: "Mobile",
  showOnTablet: "Tablet",
  showOnDesktop: "Desktop",
};
