/**
 * Element Styles — CSS Custom Properties Converter
 *
 * Converts ElementStyles objects to CSS custom property maps.
 * Used by both builder (canvas preview) and client (published sites)
 * to apply Webflow-level styling via CSS variables.
 *
 * Pattern:
 *   styles: { fontSize: "48px", color: "#1a1a2e" }
 *   → style={{ "--b-font-size": "48px", "--b-color": "#1a1a2e" }}
 *   → CSS: [data-block-key] { font-size: var(--b-font-size); }
 */

import type { ElementStyles } from "./types";

/**
 * CSS property name mapping: camelCase → kebab-case CSS property
 */
const STYLE_TO_CSS: Record<string, string> = {
  // Layout
  display: "display",
  flexDirection: "flex-direction",
  justifyContent: "justify-content",
  alignItems: "align-items",
  gap: "gap",
  // Spacing
  marginTop: "margin-top",
  marginRight: "margin-right",
  marginBottom: "margin-bottom",
  marginLeft: "margin-left",
  paddingTop: "padding-top",
  paddingRight: "padding-right",
  paddingBottom: "padding-bottom",
  paddingLeft: "padding-left",
  // Size
  width: "width",
  height: "height",
  minWidth: "min-width",
  maxWidth: "max-width",
  minHeight: "min-height",
  maxHeight: "max-height",
  // Position
  position: "position",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  zIndex: "z-index",
  overflow: "overflow",
  // Typography
  fontFamily: "font-family",
  fontSize: "font-size",
  fontWeight: "font-weight",
  lineHeight: "line-height",
  letterSpacing: "letter-spacing",
  textAlign: "text-align",
  textTransform: "text-transform",
  textDecoration: "text-decoration",
  color: "color",
  // Backgrounds
  backgroundColor: "background-color",
  backgroundImage: "background-image",
  backgroundSize: "background-size",
  backgroundPosition: "background-position",
  // Borders
  borderWidth: "border-width",
  borderStyle: "border-style",
  borderColor: "border-color",
  borderRadius: "border-radius",
  // Effects
  opacity: "opacity",
  boxShadow: "box-shadow",
};

/**
 * Convert ElementStyles to a CSS custom properties object.
 * Returns a React-compatible style object with --b-* variables.
 *
 * @example
 * stylesToCSSVars({ fontSize: "48px", color: "#1a1a2e" })
 * // → { "--b-font-size": "48px", "--b-color": "#1a1a2e" }
 */
export function stylesToCSSVars(
  styles?: ElementStyles,
): Record<string, string> {
  if (!styles) return {};

  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(styles)) {
    if (value === undefined || value === "") continue;

    const cssProperty = STYLE_TO_CSS[key];
    if (cssProperty) {
      vars[`--b-${cssProperty}`] = value;
    }
  }

  return vars;
}

/**
 * Check if an ElementStyles object has any values set.
 */
export function hasStyles(styles?: ElementStyles): boolean {
  if (!styles) return false;
  return Object.values(styles).some((v) => v !== undefined && v !== "");
}

/**
 * Merge two ElementStyles objects, with overrides taking precedence.
 */
export function mergeStyles(
  base?: ElementStyles,
  overrides?: ElementStyles,
): ElementStyles {
  if (!base) return overrides || {};
  if (!overrides) return base;
  const merged = { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined && value !== "") {
      merged[key] = value;
    }
  }
  return merged;
}
