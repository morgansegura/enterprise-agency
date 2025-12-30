/**
 * Architecture Type Definitions
 *
 * These types define the Section → Container → Block architecture.
 * This is the single source of truth for the page builder structure.
 *
 * @see /docs/architecture/page-structure.md
 */

// =============================================================================
// Spacing & Size Types
// =============================================================================

/** Base spacing scale */
export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Extended spacing scale including larger values */
export type ExtendedSpacing = Spacing | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";

/** Border thickness options */
export type BorderSize = "none" | "thin" | "medium" | "thick";

/** Border radius options */
export type BorderRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/** Shadow options */
export type ShadowSize = "none" | "sm" | "md" | "lg" | "xl" | "inner";

/** Min height options */
export type MinHeight = "none" | "sm" | "md" | "lg" | "xl" | "screen";

/** Overflow options */
export type Overflow = "visible" | "hidden" | "scroll" | "auto";

/** Container max width options */
export type ContainerMaxWidth =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

/** Section width options */
export type SectionWidth = "narrow" | "container" | "wide" | "full";

/** Width options */
export type Width = "full" | "wide" | "auto";

// =============================================================================
// Alignment Types
// =============================================================================

/** Horizontal alignment */
export type HorizontalAlign = "left" | "center" | "right";

/** Vertical alignment */
export type VerticalAlign = "top" | "center" | "bottom";

/** Flex/Grid justify options */
export type JustifyContent =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

/** Flex/Grid align items options */
export type AlignItems = "start" | "center" | "end" | "stretch" | "baseline";

/** Text alignment */
export type TextAlign = "left" | "center" | "right" | "justify";

// =============================================================================
// Background Types
// =============================================================================

/** Background preset variants */
export type BackgroundVariant =
  | "none"
  | "white"
  | "gray"
  | "dark"
  | "primary"
  | "secondary"
  | "muted"
  | "accent";

/** Gradient stop for gradient backgrounds */
export type GradientStop = {
  color: string;
  position: number;
};

/** Legacy CSS gradient configuration */
export type GradientConfig = {
  type: "linear" | "radial";
  angle?: number;
  stops: GradientStop[];
};

/** Tailwind-native gradient configuration */
export type TailwindGradientConfig = {
  direction: string; // 'to-t', 'to-r', 'to-b', 'to-l', 'to-tr', 'to-br', 'to-bl', 'to-tl'
  from: string; // Tailwind color like 'blue-500'
  via?: string; // Optional middle color
  to: string; // Tailwind color like 'pink-500'
};

/** Image background configuration */
export type ImageBackgroundConfig = {
  src: string;
  alt?: string;
  position?: string;
  size?: "cover" | "contain" | "auto";
  repeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  overlay?: string;
};

/**
 * Section background configuration - supports solid, gradient, and image
 *
 * Note: This uses a flat structure with optional properties for easier
 * manipulation in the builder. The `type` field determines which properties
 * are relevant.
 */
export interface SectionBackground {
  type: "none" | "color" | "gradient" | "image";
  /** Color value (when type is "color") */
  color?: string;
  /** Gradient configuration (when type is "gradient") - supports both legacy CSS and Tailwind formats */
  gradient?: GradientConfig | TailwindGradientConfig;
  /** Image configuration (when type is "image") */
  image?: ImageBackgroundConfig;
}

// =============================================================================
// Visibility Types
// =============================================================================

/** Breakpoint visibility settings */
export type BreakpointVisibility = {
  desktop?: boolean;
  tablet?: boolean;
  mobile?: boolean;
};

// =============================================================================
// Container Layout Types
// =============================================================================

/** Container layout type options */
export type LayoutType = "stack" | "flex" | "grid";

/** Flex direction options */
export type FlexDirection = "row" | "column";

/** Container layout configuration */
export type ContainerLayout = {
  type: LayoutType;
  direction?: FlexDirection;
  wrap?: boolean;
  justify?: JustifyContent;
  align?: AlignItems;
  columns?: number | string;
  rows?: number | string;
  gap?: Spacing;
};

// =============================================================================
// Block Type
// =============================================================================

/** Base block structure */
export interface Block {
  _type: string;
  _key: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

// =============================================================================
// Container Type
// =============================================================================

/**
 * Container - Layout wrapper inside Section
 *
 * Containers handle layout arrangement and contain blocks.
 * Structure: Section → Container[] → Block[]
 */
export interface Container<TBlock = Block> {
  _type: "container";
  _key: string;
  /** Layout mode configuration */
  layout: ContainerLayout;
  /** Max width constraint */
  maxWidth?: ContainerMaxWidth;
  /** Min height */
  minHeight?: "none" | "sm" | "md" | "lg" | "xl";
  /** Background (color, gradient, or image) */
  background?: string | SectionBackground;
  /** Horizontal padding */
  paddingX?: Spacing;
  /** Vertical padding */
  paddingY?: Spacing;
  /** All borders */
  border?: BorderSize;
  /** Individual border sides */
  borderTop?: BorderSize;
  borderBottom?: BorderSize;
  borderLeft?: BorderSize;
  borderRight?: BorderSize;
  /** Border style */
  borderStyle?: "solid" | "dashed" | "dotted" | "double";
  /** Border color */
  borderColor?: string;
  /** Border radius */
  borderRadius?: BorderRadius;
  /** Box shadow */
  shadow?: ShadowSize;
  /** Content horizontal alignment */
  align?: HorizontalAlign;
  /** Content vertical alignment */
  verticalAlign?: VerticalAlign;
  /** Overflow behavior */
  overflow?: Overflow;
  /** Responsive visibility */
  hideOn?: BreakpointVisibility;
  /** Custom CSS classes */
  customClasses?: string;
  /** Responsive overrides */
  _responsive?: {
    tablet?: Partial<
      Omit<Container<TBlock>, "_type" | "_key" | "blocks" | "_responsive">
    >;
    mobile?: Partial<
      Omit<Container<TBlock>, "_type" | "_key" | "blocks" | "_responsive">
    >;
  };
  /** Content blocks */
  blocks: TBlock[];
}

// =============================================================================
// Section Type
// =============================================================================

/** Semantic HTML element options for sections */
export type SectionElement =
  | "section"
  | "div"
  | "article"
  | "aside"
  | "header"
  | "footer";

/**
 * Section - Semantic wrapper for page content
 *
 * Sections are the top-level containers in the page structure.
 * They handle section-level styling (background, padding, borders)
 * and contain one or more containers.
 *
 * Structure: Page → Section[] → Container[] → Block[]
 */
export interface Section<TBlock = Block> {
  _type: "section";
  _key: string;
  /** Semantic HTML element */
  as?: SectionElement;
  /** Background (preset, color, gradient, or image) */
  background?: string | SectionBackground;
  /** Vertical padding (shorthand) */
  paddingY?: ExtendedSpacing;
  /** Individual padding top */
  paddingTop?: ExtendedSpacing;
  /** Individual padding bottom */
  paddingBottom?: ExtendedSpacing;
  /** Margin top */
  marginTop?: Spacing | "none";
  /** Margin bottom */
  marginBottom?: Spacing | "none";
  /** Gap between containers */
  gapY?: Spacing | "none";
  /** Legacy spacing (maps to paddingY) */
  spacing?: Spacing;
  /** Section width constraint */
  width?: SectionWidth;
  /** Border sides */
  borderTop?: BorderSize;
  borderBottom?: BorderSize;
  borderLeft?: BorderSize;
  borderRight?: BorderSize;
  /** Border style */
  borderStyle?: "solid" | "dashed" | "dotted" | "double";
  /** Border color */
  borderColor?: string;
  /** Border radius */
  borderRadius?: BorderRadius;
  /** Box shadow */
  shadow?: ShadowSize;
  /** Min height (for hero sections) */
  minHeight?: MinHeight;
  /** Content horizontal alignment */
  align?: HorizontalAlign;
  /** Content vertical alignment (when minHeight is set) */
  verticalAlign?: VerticalAlign;
  /** Overflow X */
  overflowX?: Overflow;
  /** Overflow Y */
  overflowY?: Overflow;
  /** Overflow (legacy, combined) */
  overflow?: Overflow;
  /** Anchor ID for in-page navigation */
  anchorId?: string;
  /** Responsive visibility */
  hideOn?: BreakpointVisibility;
  /** Custom CSS classes */
  customClasses?: string;
  /** Responsive overrides */
  _responsive?: {
    tablet?: Partial<
      Omit<Section<TBlock>, "_type" | "_key" | "containers" | "_responsive">
    >;
    mobile?: Partial<
      Omit<Section<TBlock>, "_type" | "_key" | "containers" | "_responsive">
    >;
  };
  /** Child containers */
  containers: Container<TBlock>[];
}

// =============================================================================
// Typography Types
// =============================================================================

/** Text size scale (complete Tailwind scale) */
export type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

/** Heading size (alias to TextSize for clarity) */
export type HeadingSize = TextSize;

/** Font weight options */
export type FontWeight =
  | "thin"
  | "extralight"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

/** Heading level (h1-h6) */
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/** Text content variant */
export type TextVariant = "default" | "muted" | "accent";

/** Heading variant */
export type HeadingVariant = "default" | "hero" | "display";

// =============================================================================
// Type Guards & Utilities
// =============================================================================

/**
 * Check if a value is a SectionBackground object
 */
export function isSectionBackgroundObject(
  value: unknown,
): value is SectionBackground {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    ["none", "color", "gradient", "image"].includes(
      (value as SectionBackground).type,
    )
  );
}

/**
 * Normalize background to SectionBackground object
 */
export function normalizeBackground(
  background?: string | SectionBackground,
): SectionBackground {
  if (!background) return { type: "none" };
  if (isSectionBackgroundObject(background)) return background;
  if (background === "none") return { type: "none" };
  return { type: "color", color: background };
}

/**
 * Get background value for data attribute (preset or "none")
 */
export function getBackgroundDataValue(
  background?: string | SectionBackground,
): BackgroundVariant {
  if (!background) return "none";
  if (typeof background === "string") {
    const presets: BackgroundVariant[] = [
      "none",
      "white",
      "gray",
      "dark",
      "primary",
      "secondary",
      "muted",
      "accent",
    ];
    return presets.includes(background as BackgroundVariant)
      ? (background as BackgroundVariant)
      : "none";
  }
  if (background.type === "color" && background.color) {
    const presets: BackgroundVariant[] = [
      "none",
      "white",
      "gray",
      "dark",
      "primary",
      "secondary",
      "muted",
      "accent",
    ];
    return presets.includes(background.color as BackgroundVariant)
      ? (background.color as BackgroundVariant)
      : "none";
  }
  return "none";
}
