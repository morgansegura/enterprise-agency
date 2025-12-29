/**
 * Section Component Schema
 *
 * Sections are the top-level layout units on a page.
 * They contain Containers, which in turn contain Blocks.
 */

import type { SectionSizeScaleKey, ContainerScaleKey } from "../semantic";
import type {
  VisibilityProperties,
  BackgroundProperties,
  BorderProperties,
  ShadowProperties,
  LayoutProperties,
} from "./base-properties";

// =============================================================================
// Section-Specific Properties
// =============================================================================

export interface SectionSpacingProperties {
  /** Padding on Y axis - uses extended section scale */
  paddingY?: SectionSizeScaleKey;
  /** Padding on X axis - uses extended section scale */
  paddingX?: SectionSizeScaleKey;
  /** Padding on top */
  paddingTop?: SectionSizeScaleKey;
  /** Padding on right */
  paddingRight?: SectionSizeScaleKey;
  /** Padding on bottom */
  paddingBottom?: SectionSizeScaleKey;
  /** Padding on left */
  paddingLeft?: SectionSizeScaleKey;
}

export interface SectionLayoutProperties {
  /** Whether section is full-width or contained */
  fullWidth?: boolean;
  /** Container max-width when not full-width */
  containerWidth?: ContainerScaleKey;
  /** Minimum height of section */
  minHeight?: "auto" | "screen" | "screen-50" | "screen-75";
  /** Vertical alignment of section content */
  contentAlign?: "start" | "center" | "end";
}

// =============================================================================
// Section Schema
// =============================================================================

export interface SectionProperties
  extends VisibilityProperties,
    SectionSpacingProperties,
    SectionLayoutProperties,
    BackgroundProperties,
    BorderProperties,
    ShadowProperties,
    Pick<LayoutProperties, "position" | "zIndex" | "overflow"> {
  /** Unique identifier */
  id: string;
  /** Section name for display in editor */
  name?: string;
  /** Custom CSS classes */
  className?: string;
  /** HTML tag to use (semantic) */
  tag?: "section" | "header" | "footer" | "main" | "aside" | "article" | "nav";
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

// =============================================================================
// Section Default Values
// =============================================================================

export const sectionDefaults: Partial<SectionProperties> = {
  paddingY: "xl",
  paddingX: "md",
  fullWidth: false,
  containerWidth: "7xl",
  minHeight: "auto",
  contentAlign: "center",
  backgroundType: "none",
  showOnMobile: true,
  showOnTablet: true,
  showOnDesktop: true,
  tag: "section",
};

// =============================================================================
// Section Property Groups (for UI organization)
// =============================================================================

export const sectionPropertyGroups = {
  layout: [
    "fullWidth",
    "containerWidth",
    "minHeight",
    "contentAlign",
    "paddingY",
    "paddingX",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
  ],
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
    "backgroundAttachment",
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
  ],
  effects: ["boxShadow", "shadowColor"],
  visibility: ["showOnMobile", "showOnTablet", "showOnDesktop"],
  advanced: ["position", "zIndex", "overflow", "className", "tag", "ariaLabel"],
} as const;

// =============================================================================
// Section Property Labels (for UI display)
// =============================================================================

export const sectionPropertyLabels: Record<string, string> = {
  paddingY: "Vertical Padding",
  paddingX: "Horizontal Padding",
  fullWidth: "Full Width",
  containerWidth: "Container Width",
  minHeight: "Minimum Height",
  contentAlign: "Content Alignment",
  backgroundType: "Background Type",
  backgroundColor: "Background Color",
  gradientDirection: "Gradient Direction",
  gradientFrom: "From Color",
  gradientVia: "Via Color",
  gradientTo: "To Color",
  backgroundImage: "Background Image",
  backgroundSize: "Background Size",
  backgroundPosition: "Background Position",
  borderStyle: "Border Style",
  borderWidth: "Border Width",
  borderColor: "Border Color",
  borderRadius: "Border Radius",
  boxShadow: "Shadow",
  showOnMobile: "Show on Mobile",
  showOnTablet: "Show on Tablet",
  showOnDesktop: "Show on Desktop",
};
