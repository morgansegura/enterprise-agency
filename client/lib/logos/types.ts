/**
 * Logo Type Definitions
 * Reusable logo system supporting both image and SVG
 */

/**
 * Image-based logo configuration
 */
export type ImageLogoConfig = {
  type: "image";
  src: string;
  srcDark?: string; // Optional dark mode image
  alt: string;
  width: number;
  height: number;
  link?: string; // Optional link (defaults to "/")
};

/**
 * SVG-based logo configuration
 * Preferred for builder - better control, theming, no HTTP requests
 */
export type SvgLogoConfig = {
  type: "svg";
  svg: string; // Raw SVG markup
  svgDark?: string; // Optional dark mode SVG
  alt: string;
  width?: string; // "180px" or token reference
  height?: string; // "60px" or token reference
  link?: string; // Optional link (defaults to "/")
};

/**
 * Combined logo configuration type
 */
export type LogoConfig = ImageLogoConfig | SvgLogoConfig;

/**
 * Logo sizing presets for consistent sizing
 */
export type LogoSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Logo alignment options
 */
export type LogoAlignment = "left" | "center" | "right";

/**
 * Type guard to check if logo is SVG-based
 */
export function isSvgLogo(logo: LogoConfig): logo is SvgLogoConfig {
  return logo.type === "svg";
}

/**
 * Type guard to check if logo is image-based
 */
export function isImageLogo(logo: LogoConfig): logo is ImageLogoConfig {
  return logo.type === "image";
}
