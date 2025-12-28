/**
 * Section & Container Type Definitions
 *
 * These types define the Section → Container → Block architecture.
 * This is the single source of truth for section/container structure.
 *
 * @see /docs/architecture/page-structure.md
 */

import type { RootBlock } from "@/lib/blocks";
import type { Spacing, Width, TextAlign, BackgroundVariant } from "@/lib/types";

// Re-export Spacing from base types for convenience
export type { Spacing };

// =============================================================================
// Spacing & Size Types
// =============================================================================

/** Extended spacing scale including larger values */
export type ExtendedSpacing =
  | Spacing
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl";

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
export type ContainerMaxWidth = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";

/** Section width options */
export type SectionWidth = Width | "container" | "narrow";

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

// =============================================================================
// Background Types
// =============================================================================

/** Gradient stop for gradient backgrounds */
export type GradientStop = {
  color: string;
  position: number;
};

/** Gradient configuration */
export type GradientConfig = {
  type: "linear" | "radial";
  angle?: number;
  stops: GradientStop[];
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

/** Section background configuration - supports solid, gradient, and image */
export type SectionBackground =
  | { type: "none" }
  | { type: "color"; color: string }
  | { type: "gradient"; gradient: GradientConfig }
  | { type: "image"; image: ImageBackgroundConfig };

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
// Container Type
// =============================================================================

/**
 * Container - Layout wrapper inside Section
 *
 * Containers handle layout arrangement and contain blocks.
 * Structure: Section → Container[] → Block[]
 */
export type Container = {
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
    tablet?: Partial<Omit<Container, "_type" | "_key" | "blocks" | "_responsive">>;
    mobile?: Partial<Omit<Container, "_type" | "_key" | "blocks" | "_responsive">>;
  };
  /** Content blocks */
  blocks: RootBlock[];
};

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
export type Section = {
  _type: "section";
  _key: string;
  /** Semantic HTML element */
  as?: SectionElement;
  /** Background (preset, color, gradient, or image) */
  background?: BackgroundVariant | string | SectionBackground;
  /** Vertical padding (shorthand) */
  paddingY?: ExtendedSpacing;
  /** Individual padding top */
  paddingTop?: ExtendedSpacing;
  /** Individual padding bottom */
  paddingBottom?: ExtendedSpacing;
  /** Margin top */
  marginTop?: Spacing | "2xl" | "none";
  /** Margin bottom */
  marginBottom?: Spacing | "2xl" | "none";
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
  /** Border color */
  borderColor?: string;
  /** Border radius */
  borderRadius?: BorderRadius;
  /** Box shadow */
  shadow?: ShadowSize;
  /** Min height (for hero sections) */
  minHeight?: MinHeight;
  /** Content horizontal alignment */
  align?: Exclude<TextAlign, "justify">;
  /** Content vertical alignment (when minHeight is set) */
  verticalAlign?: VerticalAlign;
  /** Overflow X */
  overflowX?: Overflow;
  /** Overflow Y */
  overflowY?: Overflow;
  /** Anchor ID for in-page navigation */
  anchorId?: string;
  /** Responsive visibility */
  hideOn?: BreakpointVisibility;
  /** Custom CSS classes */
  customClasses?: string;
  /** Responsive overrides */
  _responsive?: {
    tablet?: Partial<Omit<Section, "_type" | "_key" | "containers" | "_responsive">>;
    mobile?: Partial<Omit<Section, "_type" | "_key" | "containers" | "_responsive">>;
  };
  /** Child containers */
  containers: Container[];
};

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Check if a value is a SectionBackground object
 */
export function isSectionBackgroundObject(
  value: unknown
): value is SectionBackground {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    ["none", "color", "gradient", "image"].includes(
      (value as SectionBackground).type
    )
  );
}

/**
 * Normalize background to SectionBackground object
 */
export function normalizeBackground(
  background?: BackgroundVariant | string | SectionBackground
): SectionBackground {
  if (!background) return { type: "none" };
  if (isSectionBackgroundObject(background)) return background;
  if (background === "none") return { type: "none" };
  return { type: "color", color: background };
}
