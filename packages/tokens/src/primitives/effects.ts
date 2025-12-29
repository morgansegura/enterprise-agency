/**
 * Tailwind CSS Effects Primitives
 *
 * Box shadows, opacity, blur, and other effects from Tailwind CSS v3.4
 */

// =============================================================================
// Box Shadow
// =============================================================================

export const boxShadow = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  "": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "0 0 #0000",
} as const;

// Named shadows for semantic usage
export const boxShadowNamed = {
  none: "none",
  sm: boxShadow["sm"],
  default: boxShadow[""],
  md: boxShadow["md"],
  lg: boxShadow["lg"],
  xl: boxShadow["xl"],
  "2xl": boxShadow["2xl"],
  inner: boxShadow["inner"],
} as const;

// =============================================================================
// Drop Shadow (for filter)
// =============================================================================

export const dropShadow = {
  sm: "drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))",
  "": "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))",
  md: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
  lg: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
  xl: "drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))",
  "2xl": "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
  none: "drop-shadow(0 0 #0000)",
} as const;

// =============================================================================
// Opacity
// =============================================================================

export const opacity = {
  "0": "0",
  "5": "0.05",
  "10": "0.1",
  "15": "0.15",
  "20": "0.2",
  "25": "0.25",
  "30": "0.3",
  "35": "0.35",
  "40": "0.4",
  "45": "0.45",
  "50": "0.5",
  "55": "0.55",
  "60": "0.6",
  "65": "0.65",
  "70": "0.7",
  "75": "0.75",
  "80": "0.8",
  "85": "0.85",
  "90": "0.9",
  "95": "0.95",
  "100": "1",
} as const;

// =============================================================================
// Blur
// =============================================================================

export const blur = {
  none: "0",
  sm: "4px",
  "": "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "40px",
  "3xl": "64px",
} as const;

// =============================================================================
// Backdrop Blur
// =============================================================================

export const backdropBlur = blur;

// =============================================================================
// Brightness
// =============================================================================

export const brightness = {
  "0": "0",
  "50": ".5",
  "75": ".75",
  "90": ".9",
  "95": ".95",
  "100": "1",
  "105": "1.05",
  "110": "1.1",
  "125": "1.25",
  "150": "1.5",
  "200": "2",
} as const;

// =============================================================================
// Contrast
// =============================================================================

export const contrast = {
  "0": "0",
  "50": ".5",
  "75": ".75",
  "100": "1",
  "125": "1.25",
  "150": "1.5",
  "200": "2",
} as const;

// =============================================================================
// Grayscale
// =============================================================================

export const grayscale = {
  "0": "0",
  "": "100%",
} as const;

// =============================================================================
// Hue Rotate
// =============================================================================

export const hueRotate = {
  "0": "0deg",
  "15": "15deg",
  "30": "30deg",
  "60": "60deg",
  "90": "90deg",
  "180": "180deg",
} as const;

// =============================================================================
// Invert
// =============================================================================

export const invert = {
  "0": "0",
  "": "100%",
} as const;

// =============================================================================
// Saturate
// =============================================================================

export const saturate = {
  "0": "0",
  "50": ".5",
  "100": "1",
  "150": "1.5",
  "200": "2",
} as const;

// =============================================================================
// Sepia
// =============================================================================

export const sepia = {
  "0": "0",
  "": "100%",
} as const;

// =============================================================================
// Mix Blend Mode
// =============================================================================

export const mixBlendMode = {
  normal: "normal",
  multiply: "multiply",
  screen: "screen",
  overlay: "overlay",
  darken: "darken",
  lighten: "lighten",
  "color-dodge": "color-dodge",
  "color-burn": "color-burn",
  "hard-light": "hard-light",
  "soft-light": "soft-light",
  difference: "difference",
  exclusion: "exclusion",
  hue: "hue",
  saturation: "saturation",
  color: "color",
  luminosity: "luminosity",
  "plus-lighter": "plus-lighter",
} as const;

// =============================================================================
// Background Blend Mode
// =============================================================================

export const backgroundBlendMode = mixBlendMode;

// =============================================================================
// Types
// =============================================================================

export type BoxShadowKey = keyof typeof boxShadow;
export type BoxShadowNamedKey = keyof typeof boxShadowNamed;
export type OpacityKey = keyof typeof opacity;
export type BlurKey = keyof typeof blur;
export type MixBlendModeKey = keyof typeof mixBlendMode;

// =============================================================================
// Combined Effects Config
// =============================================================================

export const effects = {
  boxShadow,
  boxShadowNamed,
  dropShadow,
  opacity,
  blur,
  backdropBlur,
  brightness,
  contrast,
  grayscale,
  hueRotate,
  invert,
  saturate,
  sepia,
  mixBlendMode,
  backgroundBlendMode,
} as const;
