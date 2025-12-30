/**
 * Base Component Properties
 *
 * Common property definitions shared across multiple components.
 * These form the foundation for component-specific schemas.
 */

import type {
  SizeScaleKey,
  SectionSizeScaleKey,
  RadiusScaleKey,
  ShadowScaleKey,
  GapScaleKey,
} from "../semantic";

import type {
  FlexDirectionKey,
  JustifyContentKey,
  AlignItemsKey,
  PositionKey,
  DisplayKey,
  OverflowKey,
} from "../primitives/layout";

import type { BorderStyleKey, BorderWidthKey } from "../primitives/borders";
import type {
  TextAlignKey,
  FontWeightKey,
  LineHeightKey,
} from "../primitives/typography";

// =============================================================================
// Visibility Properties
// =============================================================================

export interface VisibilityProperties {
  /** Show on mobile devices */
  showOnMobile?: boolean;
  /** Show on tablet devices */
  showOnTablet?: boolean;
  /** Show on desktop devices */
  showOnDesktop?: boolean;
}

// =============================================================================
// Spacing Properties
// =============================================================================

export interface PaddingProperties {
  /** Padding on Y axis (top and bottom) */
  paddingY?: SizeScaleKey;
  /** Padding on X axis (left and right) */
  paddingX?: SizeScaleKey;
  /** Padding on top */
  paddingTop?: SizeScaleKey;
  /** Padding on right */
  paddingRight?: SizeScaleKey;
  /** Padding on bottom */
  paddingBottom?: SizeScaleKey;
  /** Padding on left */
  paddingLeft?: SizeScaleKey;
}

export interface MarginProperties {
  /** Margin on Y axis (top and bottom) */
  marginY?: SizeScaleKey;
  /** Margin on X axis (left and right) */
  marginX?: SizeScaleKey;
  /** Margin on top */
  marginTop?: SizeScaleKey;
  /** Margin on right */
  marginRight?: SizeScaleKey;
  /** Margin on bottom */
  marginBottom?: SizeScaleKey;
  /** Margin on left */
  marginLeft?: SizeScaleKey;
}

export interface GapProperties {
  /** Gap between child elements */
  gap?: GapScaleKey;
  /** Horizontal gap (column-gap) */
  gapX?: GapScaleKey;
  /** Vertical gap (row-gap) */
  gapY?: GapScaleKey;
}

// =============================================================================
// Background Properties
// =============================================================================

export type BackgroundType = "none" | "color" | "gradient" | "image";

export type GradientDirection =
  | "to-t"
  | "to-tr"
  | "to-r"
  | "to-br"
  | "to-b"
  | "to-bl"
  | "to-l"
  | "to-tl";

/** Gradient stop with optional position (0-100) for component backgrounds */
export interface ComponentGradientStop {
  color: string;
  position?: number; // 0-100
}

export interface BackgroundProperties {
  /** Type of background */
  backgroundType?: BackgroundType;
  /** Solid background color (Tailwind class or hex) */
  backgroundColor?: string;
  /** Gradient direction */
  gradientDirection?: GradientDirection;
  /** Gradient from color */
  gradientFrom?: string;
  /** Gradient via color (optional middle stop) */
  gradientVia?: string;
  /** Gradient to color */
  gradientTo?: string;
  /** Background image URL */
  backgroundImage?: string;
  /** Background size */
  backgroundSize?: "cover" | "contain" | "auto";
  /** Background position */
  backgroundPosition?: string;
  /** Background repeat */
  backgroundRepeat?: "repeat" | "no-repeat" | "repeat-x" | "repeat-y";
  /** Background attachment */
  backgroundAttachment?: "fixed" | "local" | "scroll";
  /** Background opacity (0-100) */
  backgroundOpacity?: number;
}

// =============================================================================
// Border Properties
// =============================================================================

export interface BorderProperties {
  /** Border style */
  borderStyle?: BorderStyleKey;
  /** Border width (all sides) */
  borderWidth?: BorderWidthKey;
  /** Border color (Tailwind class) */
  borderColor?: string;
  /** Border radius */
  borderRadius?: RadiusScaleKey;
  /** Individual side widths */
  borderTopWidth?: BorderWidthKey;
  borderRightWidth?: BorderWidthKey;
  borderBottomWidth?: BorderWidthKey;
  borderLeftWidth?: BorderWidthKey;
  /** Individual side colors */
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  /** Individual corner radii */
  borderTopLeftRadius?: RadiusScaleKey;
  borderTopRightRadius?: RadiusScaleKey;
  borderBottomRightRadius?: RadiusScaleKey;
  borderBottomLeftRadius?: RadiusScaleKey;
}

// =============================================================================
// Shadow Properties
// =============================================================================

export interface ShadowProperties {
  /** Box shadow */
  boxShadow?: ShadowScaleKey;
  /** Shadow color (Tailwind class) */
  shadowColor?: string;
}

// =============================================================================
// Layout Properties
// =============================================================================

export interface LayoutProperties {
  /** Display type */
  display?: DisplayKey;
  /** Position type */
  position?: PositionKey;
  /** Flex direction */
  flexDirection?: FlexDirectionKey;
  /** Justify content */
  justifyContent?: JustifyContentKey;
  /** Align items */
  alignItems?: AlignItemsKey;
  /** Flex wrap */
  flexWrap?: "wrap" | "nowrap" | "wrap-reverse";
  /** Overflow behavior */
  overflow?: OverflowKey;
  /** Z-index */
  zIndex?: string;
}

// =============================================================================
// Size Properties
// =============================================================================

export interface SizeProperties {
  /** Width */
  width?: string;
  /** Min width */
  minWidth?: string;
  /** Max width */
  maxWidth?: string;
  /** Height */
  height?: string;
  /** Min height */
  minHeight?: string;
  /** Max height */
  maxHeight?: string;
}

// =============================================================================
// Typography Properties
// =============================================================================

export interface TypographyProperties {
  /** Font size */
  fontSize?: string;
  /** Font weight */
  fontWeight?: FontWeightKey;
  /** Font family */
  fontFamily?: string;
  /** Line height */
  lineHeight?: LineHeightKey;
  /** Letter spacing */
  letterSpacing?: string;
  /** Text color (Tailwind class) */
  textColor?: string;
  /** Text alignment */
  textAlign?: TextAlignKey;
  /** Text decoration */
  textDecoration?: "underline" | "overline" | "line-through" | "none";
  /** Text transform */
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
}

// =============================================================================
// Animation Properties
// =============================================================================

export interface AnimationProperties {
  /** Transition property */
  transition?: string;
  /** Transition duration */
  transitionDuration?: string;
  /** Transition timing function */
  transitionTimingFunction?: string;
  /** Animation name */
  animation?: string;
}

// =============================================================================
// Hover State Properties
// =============================================================================

export interface HoverProperties {
  /** Background color on hover */
  hoverBackgroundColor?: string;
  /** Text color on hover */
  hoverTextColor?: string;
  /** Border color on hover */
  hoverBorderColor?: string;
  /** Shadow on hover */
  hoverShadow?: ShadowScaleKey;
  /** Scale on hover */
  hoverScale?: string;
}

// =============================================================================
// Combined Base Properties
// =============================================================================

export interface BaseComponentProperties
  extends VisibilityProperties,
    PaddingProperties,
    MarginProperties {}

export interface BaseContainerProperties
  extends BaseComponentProperties,
    GapProperties,
    BackgroundProperties,
    BorderProperties,
    ShadowProperties,
    LayoutProperties,
    SizeProperties {}

export interface BaseTextProperties
  extends BaseComponentProperties,
    TypographyProperties {}
