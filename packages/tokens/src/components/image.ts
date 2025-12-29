/**
 * Image Block Component Schema
 *
 * Image blocks display images with various sizing, positioning, and effect options.
 */

import type { SizeScaleKey, RadiusScaleKey, ShadowScaleKey } from "../semantic";
import type {
  VisibilityProperties,
  MarginProperties,
  BorderProperties,
} from "./base-properties";

// =============================================================================
// Image-Specific Properties
// =============================================================================

export type ImageObjectFit =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";
export type ImageObjectPosition =
  | "center"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

export interface ImageSourceProperties {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Source set for responsive images */
  srcSet?: string;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Placeholder image while loading */
  placeholder?: string;
  /** Blur placeholder data URL */
  blurDataUrl?: string;
}

export interface ImageSizeProperties {
  /** Width */
  width?:
    | "auto"
    | "full"
    | "1/2"
    | "1/3"
    | "2/3"
    | "1/4"
    | "3/4"
    | "screen"
    | string;
  /** Height */
  height?: "auto" | "full" | "screen" | "64" | "80" | "96" | string;
  /** Aspect ratio */
  aspectRatio?:
    | "auto"
    | "square"
    | "video"
    | "4/3"
    | "3/2"
    | "16/9"
    | "21/9"
    | string;
  /** Max width */
  maxWidth?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  /** Max height */
  maxHeight?: "none" | "screen" | "64" | "80" | "96" | string;
  /** Min width */
  minWidth?: string;
  /** Min height */
  minHeight?: string;
}

export interface ImageFitProperties {
  /** Object fit */
  objectFit?: ImageObjectFit;
  /** Object position */
  objectPosition?: ImageObjectPosition;
}

export interface ImageEffectsProperties {
  /** Border radius */
  borderRadius?: RadiusScaleKey;
  /** Box shadow */
  boxShadow?: ShadowScaleKey;
  /** Opacity (0-100) */
  opacity?: number;
  /** Grayscale filter (0 = none, 100 = full) */
  grayscale?: 0 | 100;
  /** Blur amount */
  blur?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  /** Brightness (0-200, 100 = normal) */
  brightness?: number;
  /** Contrast (0-200, 100 = normal) */
  contrast?: number;
  /** Saturate (0-200, 100 = normal) */
  saturate?: number;
}

export interface ImageHoverProperties {
  /** Hover opacity */
  hoverOpacity?: number;
  /** Hover scale */
  hoverScale?: "none" | "95" | "100" | "105" | "110" | "125";
  /** Hover grayscale */
  hoverGrayscale?: 0 | 100;
  /** Hover blur */
  hoverBlur?: "none" | "sm" | "md" | "lg";
  /** Hover brightness */
  hoverBrightness?: number;
}

export interface ImageLoadingProperties {
  /** Loading strategy */
  loading?: "lazy" | "eager";
  /** Decoding strategy */
  decoding?: "async" | "auto" | "sync";
  /** Priority hint */
  fetchPriority?: "auto" | "high" | "low";
}

export interface ImageLayoutProperties {
  /** Display type */
  display?: "inline" | "block";
  /** Alignment within container */
  align?: "left" | "center" | "right";
}

// =============================================================================
// Image Block Schema
// =============================================================================

export interface ImageProperties
  extends VisibilityProperties,
    MarginProperties,
    ImageSourceProperties,
    ImageSizeProperties,
    ImageFitProperties,
    ImageEffectsProperties,
    ImageHoverProperties,
    ImageLoadingProperties,
    ImageLayoutProperties,
    Pick<BorderProperties, "borderStyle" | "borderWidth" | "borderColor"> {
  /** Unique identifier */
  id: string;
  /** Block name for display in editor */
  name?: string;
  /** Custom CSS classes */
  className?: string;
  /** Caption text */
  caption?: string;
  /** Caption position */
  captionPosition?: "below" | "overlay-bottom" | "overlay-top";
  /** Link URL (makes image clickable) */
  href?: string;
  /** Link target */
  target?: "_self" | "_blank";
  /** Transition duration for hover effects */
  transitionDuration?: "0" | "75" | "100" | "150" | "200" | "300" | "500";
  /** Title attribute (for tooltip) */
  title?: string;
}

// =============================================================================
// Image Default Values
// =============================================================================

export const imageDefaults: Partial<ImageProperties> = {
  width: "full",
  height: "auto",
  aspectRatio: "auto",
  maxWidth: "full",
  objectFit: "cover",
  objectPosition: "center",
  borderRadius: "none",
  boxShadow: "none",
  opacity: 100,
  grayscale: 0,
  blur: "none",
  brightness: 100,
  contrast: 100,
  saturate: 100,
  hoverScale: "none",
  loading: "lazy",
  decoding: "async",
  fetchPriority: "auto",
  display: "block",
  align: "center",
  captionPosition: "below",
  target: "_self",
  transitionDuration: "300",
  showOnMobile: true,
  showOnTablet: true,
  showOnDesktop: true,
};

// =============================================================================
// Image Property Groups (for UI organization)
// =============================================================================

export const imagePropertyGroups = {
  source: ["src", "alt", "srcSet", "sizes", "placeholder", "blurDataUrl"],
  size: [
    "width",
    "height",
    "aspectRatio",
    "maxWidth",
    "maxHeight",
    "minWidth",
    "minHeight",
  ],
  fit: ["objectFit", "objectPosition"],
  effects: [
    "borderRadius",
    "boxShadow",
    "opacity",
    "grayscale",
    "blur",
    "brightness",
    "contrast",
    "saturate",
  ],
  hover: [
    "hoverOpacity",
    "hoverScale",
    "hoverGrayscale",
    "hoverBlur",
    "hoverBrightness",
  ],
  border: ["borderStyle", "borderWidth", "borderColor"],
  layout: ["display", "align", "marginY", "marginX"],
  caption: ["caption", "captionPosition"],
  link: ["href", "target", "title"],
  loading: ["loading", "decoding", "fetchPriority"],
  visibility: ["showOnMobile", "showOnTablet", "showOnDesktop"],
  advanced: ["className", "transitionDuration"],
} as const;

// =============================================================================
// Image Property Labels (for UI display)
// =============================================================================

export const imagePropertyLabels: Record<string, string> = {
  src: "Image URL",
  alt: "Alt Text",
  srcSet: "Source Set",
  sizes: "Sizes",
  placeholder: "Placeholder",
  blurDataUrl: "Blur Placeholder",
  width: "Width",
  height: "Height",
  aspectRatio: "Aspect Ratio",
  maxWidth: "Max Width",
  maxHeight: "Max Height",
  objectFit: "Object Fit",
  objectPosition: "Object Position",
  borderRadius: "Border Radius",
  boxShadow: "Shadow",
  opacity: "Opacity",
  grayscale: "Grayscale",
  blur: "Blur",
  brightness: "Brightness",
  contrast: "Contrast",
  saturate: "Saturation",
  hoverOpacity: "Hover Opacity",
  hoverScale: "Hover Scale",
  hoverGrayscale: "Hover Grayscale",
  hoverBlur: "Hover Blur",
  hoverBrightness: "Hover Brightness",
  borderStyle: "Border Style",
  borderWidth: "Border Width",
  borderColor: "Border Color",
  display: "Display",
  align: "Alignment",
  caption: "Caption",
  captionPosition: "Caption Position",
  href: "Link URL",
  target: "Open In",
  title: "Tooltip",
  loading: "Loading",
  decoding: "Decoding",
  fetchPriority: "Priority",
  marginY: "Vertical Margin",
  marginX: "Horizontal Margin",
  showOnMobile: "Mobile",
  showOnTablet: "Tablet",
  showOnDesktop: "Desktop",
};
