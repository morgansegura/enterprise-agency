/**
 * Container Component Schema
 *
 * Containers live inside Sections and hold Blocks.
 * They provide layout structure for their child blocks.
 */

import type {
  SizeScaleKey,
  RadiusScaleKey,
  ShadowScaleKey,
  GapScaleKey,
} from "../semantic";
import type {
  VisibilityProperties,
  PaddingProperties,
  BackgroundProperties,
  BorderProperties,
  ShadowProperties,
} from "./base-properties";

// =============================================================================
// Container-Specific Properties
// =============================================================================

export type ContainerLayoutType = "stack" | "row" | "grid";

export interface ContainerLayoutProperties {
  /** Layout type for child blocks */
  layout?: ContainerLayoutType;
  /** Flex direction (when layout is stack or row) */
  direction?: "column" | "row" | "column-reverse" | "row-reverse";
  /** Justify content */
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** Align items */
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Flex wrap */
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  /** Gap between children */
  gap?: GapScaleKey;
  /** Horizontal gap */
  gapX?: GapScaleKey;
  /** Vertical gap */
  gapY?: GapScaleKey;
  /** Grid columns (when layout is grid) */
  gridColumns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  /** Grid column span */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | "full";
}

export interface ContainerSizeProperties {
  /** Width */
  width?: "auto" | "full" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4";
  /** Min width */
  minWidth?: string;
  /** Max width */
  maxWidth?: string;
  /** Height */
  height?: "auto" | "full" | "screen" | "min" | "max" | "fit";
  /** Min height */
  minHeight?: string;
  /** Max height */
  maxHeight?: string;
}

// =============================================================================
// Container Schema
// =============================================================================

export interface ContainerProperties
  extends VisibilityProperties,
    PaddingProperties,
    ContainerLayoutProperties,
    ContainerSizeProperties,
    BackgroundProperties,
    BorderProperties,
    ShadowProperties {
  /** Unique identifier */
  id: string;
  /** Container name for display in editor */
  name?: string;
  /** Custom CSS classes */
  className?: string;
  /** HTML tag to use */
  tag?:
    | "div"
    | "article"
    | "aside"
    | "figure"
    | "figcaption"
    | "nav"
    | "ul"
    | "ol"
    | "li";
  /** Position within parent */
  position?: "static" | "relative" | "absolute" | "sticky";
  /** Z-index */
  zIndex?: string;
  /** Overflow behavior */
  overflow?: "visible" | "hidden" | "scroll" | "auto";
}

// =============================================================================
// Container Default Values
// =============================================================================

export const containerDefaults: Partial<ContainerProperties> = {
  layout: "stack",
  direction: "column",
  justifyContent: "start",
  alignItems: "stretch",
  wrap: "nowrap",
  gap: "md",
  paddingY: "md",
  paddingX: "md",
  width: "full",
  height: "auto",
  backgroundType: "none",
  borderStyle: "none",
  boxShadow: "none",
  showOnMobile: true,
  showOnTablet: true,
  showOnDesktop: true,
  tag: "div",
  position: "static",
  overflow: "visible",
};

// =============================================================================
// Container Property Groups (for UI organization)
// =============================================================================

export const containerPropertyGroups = {
  layout: [
    "layout",
    "direction",
    "justifyContent",
    "alignItems",
    "wrap",
    "gap",
    "gapX",
    "gapY",
    "gridColumns",
    "colSpan",
  ],
  spacing: [
    "paddingY",
    "paddingX",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
  ],
  size: ["width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight"],
  background: [
    "backgroundType",
    "backgroundColor",
    "gradientDirection",
    "gradientFrom",
    "gradientVia",
    "gradientTo",
    "backgroundImage",
    "backgroundSize",
    "backgroundPosition",
    "backgroundRepeat",
    "backgroundOpacity",
  ],
  border: [
    "borderStyle",
    "borderWidth",
    "borderColor",
    "borderRadius",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderTopLeftRadius",
    "borderTopRightRadius",
    "borderBottomRightRadius",
    "borderBottomLeftRadius",
  ],
  effects: ["boxShadow", "shadowColor"],
  visibility: ["showOnMobile", "showOnTablet", "showOnDesktop"],
  advanced: ["position", "zIndex", "overflow", "className", "tag"],
} as const;

// =============================================================================
// Container Property Labels (for UI display)
// =============================================================================

export const containerPropertyLabels: Record<string, string> = {
  layout: "Layout Type",
  direction: "Direction",
  justifyContent: "Justify Content",
  alignItems: "Align Items",
  wrap: "Flex Wrap",
  gap: "Gap",
  gapX: "Horizontal Gap",
  gapY: "Vertical Gap",
  gridColumns: "Grid Columns",
  colSpan: "Column Span",
  paddingY: "Vertical Padding",
  paddingX: "Horizontal Padding",
  width: "Width",
  maxWidth: "Max Width",
  height: "Height",
  backgroundType: "Background",
  backgroundColor: "Background Color",
  borderStyle: "Border Style",
  borderWidth: "Border Width",
  borderColor: "Border Color",
  borderRadius: "Border Radius",
  boxShadow: "Shadow",
  showOnMobile: "Mobile",
  showOnTablet: "Tablet",
  showOnDesktop: "Desktop",
};
