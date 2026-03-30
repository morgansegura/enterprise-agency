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
  flexWrap: "flex-wrap",
  justifyContent: "justify-content",
  alignItems: "align-items",
  alignContent: "align-content",
  alignSelf: "align-self",
  justifySelf: "justify-self",
  gap: "gap",
  rowGap: "row-gap",
  columnGap: "column-gap",
  // Flex child
  flexGrow: "flex-grow",
  flexShrink: "flex-shrink",
  flexBasis: "flex-basis",
  order: "order",
  // Grid
  gridTemplateColumns: "grid-template-columns",
  gridTemplateRows: "grid-template-rows",
  gridColumn: "grid-column",
  gridRow: "grid-row",
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
  aspectRatio: "aspect-ratio",
  objectFit: "object-fit",
  objectPosition: "object-position",
  // Position
  position: "position",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  zIndex: "z-index",
  overflow: "overflow",
  overflowX: "overflow-x",
  overflowY: "overflow-y",
  float: "float",
  clear: "clear",
  // Typography
  fontFamily: "font-family",
  fontSize: "font-size",
  fontWeight: "font-weight",
  fontStyle: "font-style",
  lineHeight: "line-height",
  letterSpacing: "letter-spacing",
  wordSpacing: "word-spacing",
  textAlign: "text-align",
  textTransform: "text-transform",
  textDecoration: "text-decoration",
  textIndent: "text-indent",
  textShadow: "text-shadow",
  whiteSpace: "white-space",
  wordBreak: "word-break",
  color: "color",
  columns: "columns",
  columnGapText: "column-gap",
  // Backgrounds
  backgroundColor: "background-color",
  backgroundImage: "background-image",
  backgroundSize: "background-size",
  backgroundPosition: "background-position",
  backgroundRepeat: "background-repeat",
  backgroundAttachment: "background-attachment",
  // Borders
  borderWidth: "border-width",
  borderTopWidth: "border-top-width",
  borderRightWidth: "border-right-width",
  borderBottomWidth: "border-bottom-width",
  borderLeftWidth: "border-left-width",
  borderStyle: "border-style",
  borderColor: "border-color",
  borderTopColor: "border-top-color",
  borderRightColor: "border-right-color",
  borderBottomColor: "border-bottom-color",
  borderLeftColor: "border-left-color",
  borderRadius: "border-radius",
  borderTopLeftRadius: "border-top-left-radius",
  borderTopRightRadius: "border-top-right-radius",
  borderBottomRightRadius: "border-bottom-right-radius",
  borderBottomLeftRadius: "border-bottom-left-radius",
  // Effects
  opacity: "opacity",
  boxShadow: "box-shadow",
  // Transforms
  transform: "transform",
  transformOrigin: "transform-origin",
  // Transitions
  transition: "transition",
  transitionProperty: "transition-property",
  transitionDuration: "transition-duration",
  transitionTimingFunction: "transition-timing-function",
  transitionDelay: "transition-delay",
  // Filters
  filter: "filter",
  backdropFilter: "backdrop-filter",
  // Blend & cursor
  mixBlendMode: "mix-blend-mode",
  cursor: "cursor",
  pointerEvents: "pointer-events",
  userSelect: "user-select",
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
  prefix: string = "--b-",
): Record<string, string> {
  if (!styles) return {};

  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(styles)) {
    if (value === undefined || value === "") continue;

    if (key === "content") {
      vars[`${prefix}content`] = value;
      continue;
    }

    const cssProperty = STYLE_TO_CSS[key];
    if (cssProperty) {
      vars[`${prefix}${cssProperty}`] = value;
    }
  }

  return vars;
}

/**
 * Convert element styles including ::before and ::after pseudo-elements.
 * Merges all into a single CSS vars object.
 */
export function allStylesToCSSVars(
  styles?: ElementStyles,
  stylesBefore?: ElementStyles & { content?: string },
  stylesAfter?: ElementStyles & { content?: string },
): Record<string, string> {
  return {
    ...stylesToCSSVars(styles, "--b-"),
    ...stylesToCSSVars(stylesBefore, "--b-before-"),
    ...stylesToCSSVars(stylesAfter, "--b-after-"),
  };
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
