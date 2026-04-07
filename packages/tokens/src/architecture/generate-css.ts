/**
 * Page CSS Generator
 *
 * Converts a page's sections array into a CSS stylesheet string.
 * Each element (section, container, block) gets a class-based rule
 * keyed by its `_key`. Visual properties become CSS declarations —
 * no inline styles, no --b-* variable indirection.
 *
 * Data attributes remain for structural/layout concerns (padding scale,
 * width, layout type, grid columns) — the finite enum stuff they're
 * perfect for.
 *
 * Usage:
 *   const css = generatePageCSS(page.sections);
 *   // → ".e-abc123 { background-color: #ffffff; font-size: 48px; }"
 *
 * Used by:
 *   - Builder canvas: <style id="page-styles">{css}</style>
 *   - Client RSC: inlined in HTML response during SSR
 */

import type { ElementStyles, Section, Container, Block } from "./types";

// ---------------------------------------------------------------------------
// Mapping: camelCase ElementStyles key → kebab-case CSS property
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// CSS class prefix — all generated selectors use this
// ---------------------------------------------------------------------------

const CLASS_PREFIX = "e-";

// ---------------------------------------------------------------------------
// Breakpoint media queries (matches Tailwind defaults)
// ---------------------------------------------------------------------------

const TABLET_QUERY = "@media (max-width: 1024px)";
const MOBILE_QUERY = "@media (max-width: 640px)";

// ---------------------------------------------------------------------------
// Core: ElementStyles → CSS declarations string
// ---------------------------------------------------------------------------

function stylesToDeclarations(styles: ElementStyles): string {
  const declarations: string[] = [];

  for (const [key, value] of Object.entries(styles)) {
    if (value === undefined || value === "") continue;
    if (key === "content") continue; // handled by pseudo-element
    if (key === "_responsive") continue;

    const cssProp = STYLE_TO_CSS[key];
    if (cssProp) {
      declarations.push(`  ${cssProp}: ${value};`);
    }
  }

  return declarations.join("\n");
}

/**
 * Build a CSS rule for an element.
 * Returns empty string if there are no declarations.
 */
function buildRule(key: string, styles?: ElementStyles): string {
  if (!styles) return "";
  const decls = stylesToDeclarations(styles);
  if (!decls) return "";
  return `.${CLASS_PREFIX}${key} {\n${decls}\n}`;
}

/**
 * Build a ::before or ::after pseudo-element rule.
 */
function buildPseudoRule(
  key: string,
  pseudo: "before" | "after",
  styles?: ElementStyles & { content?: string },
): string {
  if (!styles) return "";

  const decls: string[] = [];
  const contentValue = styles.content ?? '""';
  decls.push(`  content: ${contentValue};`);

  for (const [k, value] of Object.entries(styles)) {
    if (value === undefined || value === "") continue;
    if (k === "content" || k === "_responsive") continue;
    const cssProp = STYLE_TO_CSS[k];
    if (cssProp) {
      decls.push(`  ${cssProp}: ${value};`);
    }
  }

  if (decls.length <= 1 && contentValue === '""') return "";
  return `.${CLASS_PREFIX}${key}::${pseudo} {\n${decls.join("\n")}\n}`;
}

// ---------------------------------------------------------------------------
// Responsive: generate tablet/mobile overrides
// ---------------------------------------------------------------------------

interface ResponsiveElement {
  _key: string;
  _responsive?: {
    tablet?: { styles?: ElementStyles; [k: string]: unknown };
    mobile?: { styles?: ElementStyles; [k: string]: unknown };
  };
}

function buildResponsiveRules(element: ResponsiveElement): {
  tablet: string;
  mobile: string;
} {
  const tablet = buildRule(
    element._key,
    element._responsive?.tablet?.styles,
  );
  const mobile = buildRule(
    element._key,
    element._responsive?.mobile?.styles,
  );
  return { tablet, mobile };
}

// ---------------------------------------------------------------------------
// Section background preset → CSS declaration
// ---------------------------------------------------------------------------

const BACKGROUND_PRESET_MAP: Record<string, string> = {
  none: "transparent",
  white: "#ffffff",
  gray: "var(--section-bg-gray)",
  dark: "var(--section-bg-dark)",
  primary: "var(--section-bg-primary)",
  secondary: "var(--section-bg-secondary)",
  muted: "var(--section-bg-muted)",
  accent: "var(--section-bg-accent)",
};

const BACKGROUND_COLOR_MAP: Record<string, string> = {
  dark: "white",
  primary: "var(--primary-foreground, white)",
  secondary: "var(--secondary-foreground, white)",
};

/**
 * Generate background declarations from section.background.
 * Returns CSS declarations string (without the selector).
 */
function backgroundToDeclarations(
  background?: string | Record<string, unknown>,
): string {
  if (!background) return "";

  // String preset: "primary", "dark", etc.
  if (typeof background === "string") {
    const bg = BACKGROUND_PRESET_MAP[background];
    if (!bg) return `  background-color: ${background};`;
    const decls = [`  background-color: ${bg};`];
    const color = BACKGROUND_COLOR_MAP[background];
    if (color) decls.push(`  color: ${color};`);
    return decls.join("\n");
  }

  // Object format: { type: "color" | "gradient" | "image", ... }
  const type = background.type as string;

  if (type === "color") {
    const color = background.color as string | undefined;
    if (!color) return "";
    const preset = BACKGROUND_PRESET_MAP[color];
    if (preset) {
      const decls = [`  background-color: ${preset};`];
      const textColor = BACKGROUND_COLOR_MAP[color];
      if (textColor) decls.push(`  color: ${textColor};`);
      return decls.join("\n");
    }
    return `  background-color: ${color};`;
  }

  if (type === "gradient" && background.gradient) {
    const gradient = background.gradient as Record<string, unknown>;
    // Legacy format: { type, angle, stops }
    if (Array.isArray(gradient.stops)) {
      const stops = (
        gradient.stops as Array<{ color: string; position: number }>
      )
        .map((s) => `${s.color} ${s.position}%`)
        .join(", ");
      const gradientType = gradient.type as string;
      const angle = (gradient.angle as number) || 180;
      const css =
        gradientType === "linear"
          ? `linear-gradient(${angle}deg, ${stops})`
          : `radial-gradient(circle, ${stops})`;
      return `  background: ${css};`;
    }
    // Tailwind format: { direction, from, via?, to }
    if (gradient.direction) {
      const dirMap: Record<string, string> = {
        "to-t": "0deg",
        "to-tr": "45deg",
        "to-r": "90deg",
        "to-br": "135deg",
        "to-b": "180deg",
        "to-bl": "225deg",
        "to-l": "270deg",
        "to-tl": "315deg",
      };
      const angle = dirMap[gradient.direction as string] || "180deg";
      const from = `var(--color-${gradient.from})`;
      const to = `var(--color-${gradient.to})`;
      const via = gradient.via
        ? `, var(--color-${gradient.via})`
        : "";
      return `  background: linear-gradient(${angle}, ${from}${via}, ${to});`;
    }
  }

  if (type === "image" && background.image) {
    const image = background.image as Record<string, string>;
    if (!image.src) return "";
    const decls = [
      `  background-image: url(${image.src});`,
      `  background-size: ${image.size || "cover"};`,
      `  background-position: ${image.position || "center"};`,
      `  background-repeat: ${image.repeat || "no-repeat"};`,
    ];
    return decls.join("\n");
  }

  return "";
}

// ---------------------------------------------------------------------------
// Walk the page tree and collect CSS rules
// ---------------------------------------------------------------------------

interface CSSCollector {
  desktop: string[];
  tablet: string[];
  mobile: string[];
}

function collectBlockRules(
  block: Block,
  collector: CSSCollector,
): void {
  // Main element styles
  const rule = buildRule(block._key, block.styles);
  if (rule) collector.desktop.push(rule);

  // Pseudo-elements
  const before = buildPseudoRule(block._key, "before", block.stylesBefore);
  if (before) collector.desktop.push(before);

  const after = buildPseudoRule(block._key, "after", block.stylesAfter);
  if (after) collector.desktop.push(after);

  // Responsive overrides
  const responsive = buildResponsiveRules(
    block as unknown as ResponsiveElement,
  );
  if (responsive.tablet) collector.tablet.push(responsive.tablet);
  if (responsive.mobile) collector.mobile.push(responsive.mobile);
}

function collectContainerRules(
  container: Container,
  collector: CSSCollector,
): void {
  const rule = buildRule(container._key, container.styles);
  if (rule) collector.desktop.push(rule);

  // Pseudo-elements
  const containerWithPseudo = container as Container & {
    stylesBefore?: ElementStyles & { content?: string };
    stylesAfter?: ElementStyles & { content?: string };
  };
  const before = buildPseudoRule(
    container._key,
    "before",
    containerWithPseudo.stylesBefore,
  );
  if (before) collector.desktop.push(before);
  const after = buildPseudoRule(
    container._key,
    "after",
    containerWithPseudo.stylesAfter,
  );
  if (after) collector.desktop.push(after);

  // Responsive
  const responsive = buildResponsiveRules(
    container as unknown as ResponsiveElement,
  );
  if (responsive.tablet) collector.tablet.push(responsive.tablet);
  if (responsive.mobile) collector.mobile.push(responsive.mobile);

  // Walk blocks
  if (container.blocks) {
    for (const block of container.blocks as Block[]) {
      collectBlockRules(block, collector);
    }
  }
}

function collectSectionRules(
  section: Section,
  collector: CSSCollector,
): void {
  // Section background (from preset or object)
  const bgDecls = backgroundToDeclarations(
    section.background as string | Record<string, unknown> | undefined,
  );

  // Section element styles
  const styleDecls = section.styles
    ? stylesToDeclarations(section.styles)
    : "";

  // Merge background + element styles into one rule
  const allDecls = [bgDecls, styleDecls].filter(Boolean).join("\n");
  if (allDecls) {
    collector.desktop.push(
      `.${CLASS_PREFIX}${section._key} {\n${allDecls}\n}`,
    );
  }

  // Pseudo-elements on sections
  const sectionWithPseudo = section as Section & {
    stylesBefore?: ElementStyles & { content?: string };
    stylesAfter?: ElementStyles & { content?: string };
  };
  const before = buildPseudoRule(
    section._key,
    "before",
    sectionWithPseudo.stylesBefore,
  );
  if (before) collector.desktop.push(before);
  const after = buildPseudoRule(
    section._key,
    "after",
    sectionWithPseudo.stylesAfter,
  );
  if (after) collector.desktop.push(after);

  // Responsive
  const responsive = buildResponsiveRules(
    section as unknown as ResponsiveElement,
  );
  if (responsive.tablet) collector.tablet.push(responsive.tablet);
  if (responsive.mobile) collector.mobile.push(responsive.mobile);

  // Walk containers
  if (section.containers) {
    for (const container of section.containers) {
      collectContainerRules(container, collector);
    }
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a complete CSS stylesheet for a page's sections.
 *
 * Walks sections → containers → blocks, converting `styles` objects
 * to class-based CSS rules keyed by `_key`. Includes responsive
 * breakpoint overrides via @media queries.
 *
 * @example
 * ```tsx
 * // Server Component (client app)
 * const css = generatePageCSS(page.sections);
 * return (
 *   <>
 *     <style dangerouslySetInnerHTML={{ __html: css }} />
 *     <SectionRenderer sections={page.sections} />
 *   </>
 * );
 *
 * // Builder canvas
 * <style id="page-styles">{generatePageCSS(sections)}</style>
 * ```
 */
export function generatePageCSS(sections: Section[]): string {
  if (!sections || sections.length === 0) return "";

  const collector: CSSCollector = {
    desktop: [],
    tablet: [],
    mobile: [],
  };

  for (const section of sections) {
    collectSectionRules(section, collector);
  }

  const parts: string[] = [];

  // Desktop rules (no media query wrapper)
  if (collector.desktop.length > 0) {
    parts.push(collector.desktop.join("\n\n"));
  }

  // Tablet overrides
  if (collector.tablet.length > 0) {
    parts.push(
      `${TABLET_QUERY} {\n${collector.tablet.join("\n\n")}\n}`,
    );
  }

  // Mobile overrides
  if (collector.mobile.length > 0) {
    parts.push(
      `${MOBILE_QUERY} {\n${collector.mobile.join("\n\n")}\n}`,
    );
  }

  return parts.join("\n\n");
}

/**
 * Generate CSS for a single element (section, container, or block).
 * Useful for live preview updates in the builder — regenerate only
 * the changed element's rule instead of the entire page.
 */
export function generateElementCSS(
  key: string,
  styles?: ElementStyles,
  stylesBefore?: ElementStyles & { content?: string },
  stylesAfter?: ElementStyles & { content?: string },
): string {
  const parts: string[] = [];

  const rule = buildRule(key, styles);
  if (rule) parts.push(rule);

  const before = buildPseudoRule(key, "before", stylesBefore);
  if (before) parts.push(before);

  const after = buildPseudoRule(key, "after", stylesAfter);
  if (after) parts.push(after);

  return parts.join("\n\n");
}

/**
 * Get the CSS class name for an element key.
 * Use this to add the class to the rendered element.
 */
export function getElementClass(key: string): string {
  return `${CLASS_PREFIX}${key}`;
}

/**
 * The class prefix used by the generator.
 * Exported for consumers that need to build selectors.
 */
export { CLASS_PREFIX };
