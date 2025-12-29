/**
 * Button Block Component Schema
 *
 * Button blocks display interactive buttons with various styles and states.
 */

import type {
  SizeScaleKey,
  RadiusScaleKey,
  ShadowScaleKey,
  TextSizeScaleKey,
  WeightScaleKey,
} from "../semantic";
import type { VisibilityProperties, MarginProperties } from "./base-properties";

// =============================================================================
// Button-Specific Properties
// =============================================================================

export type ButtonVariant = "solid" | "outline" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonStyleProperties {
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size preset */
  size?: ButtonSize;
  /** Background color (for solid variant) */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Border color (for outline variant) */
  borderColor?: string;
  /** Border width */
  borderWidth?: "0" | "1" | "2" | "4";
  /** Border radius */
  borderRadius?: RadiusScaleKey;
  /** Box shadow */
  boxShadow?: ShadowScaleKey;
}

export interface ButtonTypographyProperties {
  /** Font size (overrides size preset) */
  fontSize?: TextSizeScaleKey;
  /** Font weight */
  fontWeight?: WeightScaleKey;
  /** Letter spacing */
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider";
  /** Text transform */
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
}

export interface ButtonSpacingProperties {
  /** Horizontal padding (overrides size preset) */
  paddingX?: SizeScaleKey;
  /** Vertical padding (overrides size preset) */
  paddingY?: SizeScaleKey;
}

export interface ButtonHoverProperties {
  /** Hover background color */
  hoverBackgroundColor?: string;
  /** Hover text color */
  hoverTextColor?: string;
  /** Hover border color */
  hoverBorderColor?: string;
  /** Hover shadow */
  hoverShadow?: ShadowScaleKey;
  /** Hover scale */
  hoverScale?: "none" | "95" | "100" | "105" | "110";
}

export interface ButtonIconProperties {
  /** Icon name (from icon library) */
  iconName?: string;
  /** Icon position relative to text */
  iconPosition?: "left" | "right";
  /** Icon size */
  iconSize?: "sm" | "md" | "lg";
  /** Show only icon (no text) */
  iconOnly?: boolean;
}

export interface ButtonInteractionProperties {
  /** Link URL */
  href?: string;
  /** Link target */
  target?: "_self" | "_blank" | "_parent" | "_top";
  /** Button type */
  type?: "button" | "submit" | "reset";
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

// =============================================================================
// Button Block Schema
// =============================================================================

export interface ButtonProperties
  extends VisibilityProperties,
    MarginProperties,
    ButtonStyleProperties,
    ButtonTypographyProperties,
    ButtonSpacingProperties,
    ButtonHoverProperties,
    ButtonIconProperties,
    ButtonInteractionProperties {
  /** Unique identifier */
  id: string;
  /** Button text content */
  content: string;
  /** Block name for display in editor */
  name?: string;
  /** Custom CSS classes */
  className?: string;
  /** Full width button */
  fullWidth?: boolean;
  /** Text alignment when full width */
  textAlign?: "left" | "center" | "right";
  /** Transition duration */
  transitionDuration?: "0" | "75" | "100" | "150" | "200" | "300" | "500";
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

// =============================================================================
// Button Size Presets
// =============================================================================

export const buttonSizePresets: Record<
  ButtonSize,
  { paddingX: SizeScaleKey; paddingY: SizeScaleKey; fontSize: TextSizeScaleKey }
> = {
  xs: { paddingX: "xs", paddingY: "xs", fontSize: "xs" },
  sm: { paddingX: "sm", paddingY: "xs", fontSize: "sm" },
  md: { paddingX: "md", paddingY: "sm", fontSize: "base" },
  lg: { paddingX: "lg", paddingY: "md", fontSize: "lg" },
  xl: { paddingX: "xl", paddingY: "lg", fontSize: "xl" },
};

// =============================================================================
// Button Default Values
// =============================================================================

export const buttonDefaults: Partial<ButtonProperties> = {
  variant: "solid",
  size: "md",
  fontWeight: "medium",
  letterSpacing: "normal",
  textTransform: "none",
  borderRadius: "md",
  boxShadow: "none",
  hoverScale: "none",
  iconPosition: "left",
  iconSize: "md",
  iconOnly: false,
  target: "_self",
  type: "button",
  disabled: false,
  loading: false,
  fullWidth: false,
  textAlign: "center",
  transitionDuration: "150",
  showOnMobile: true,
  showOnTablet: true,
  showOnDesktop: true,
};

// =============================================================================
// Button Property Groups (for UI organization)
// =============================================================================

export const buttonPropertyGroups = {
  content: ["content", "iconName", "iconPosition", "iconSize", "iconOnly"],
  style: [
    "variant",
    "size",
    "backgroundColor",
    "textColor",
    "borderColor",
    "borderWidth",
    "borderRadius",
    "boxShadow",
  ],
  typography: ["fontSize", "fontWeight", "letterSpacing", "textTransform"],
  spacing: ["paddingX", "paddingY"],
  hover: [
    "hoverBackgroundColor",
    "hoverTextColor",
    "hoverBorderColor",
    "hoverShadow",
    "hoverScale",
  ],
  layout: ["fullWidth", "textAlign", "marginY", "marginX"],
  interaction: ["href", "target", "type", "disabled", "loading", "ariaLabel"],
  visibility: ["showOnMobile", "showOnTablet", "showOnDesktop"],
  advanced: ["className", "transitionDuration"],
} as const;

// =============================================================================
// Button Property Labels (for UI display)
// =============================================================================

export const buttonPropertyLabels: Record<string, string> = {
  content: "Button Text",
  variant: "Variant",
  size: "Size",
  backgroundColor: "Background",
  textColor: "Text Color",
  borderColor: "Border Color",
  borderWidth: "Border Width",
  borderRadius: "Border Radius",
  boxShadow: "Shadow",
  fontSize: "Font Size",
  fontWeight: "Font Weight",
  letterSpacing: "Letter Spacing",
  textTransform: "Text Case",
  paddingX: "Horizontal Padding",
  paddingY: "Vertical Padding",
  hoverBackgroundColor: "Hover Background",
  hoverTextColor: "Hover Text Color",
  hoverBorderColor: "Hover Border",
  hoverShadow: "Hover Shadow",
  hoverScale: "Hover Scale",
  iconName: "Icon",
  iconPosition: "Icon Position",
  iconSize: "Icon Size",
  iconOnly: "Icon Only",
  fullWidth: "Full Width",
  textAlign: "Alignment",
  href: "Link URL",
  target: "Open In",
  type: "Button Type",
  disabled: "Disabled",
  loading: "Loading",
  ariaLabel: "ARIA Label",
  showOnMobile: "Mobile",
  showOnTablet: "Tablet",
  showOnDesktop: "Desktop",
};
