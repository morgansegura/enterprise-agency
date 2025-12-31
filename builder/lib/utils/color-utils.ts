/**
 * Color utilities for generating color scales and manipulating colors
 */

/**
 * Parse a hex color to RGB values
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Lighten a color by a percentage
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.min(100, hsl.l + percent);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Darken a color by a percentage
 */
export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.l = Math.max(0, hsl.l - percent);

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Adjust saturation of a color
 */
export function saturate(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.s = Math.min(100, Math.max(0, hsl.s + percent));

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Get luminance of a color (for contrast calculations)
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Get contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if text should be light or dark on a background color
 */
export function getContrastingTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.179 ? "#000000" : "#ffffff";
}

/**
 * Color scale configuration
 */
export interface ColorScaleConfig {
  50: number; // Lightness increase
  100: number;
  200: number;
  300: number;
  400: number;
  500: number; // Base (0)
  600: number;
  700: number;
  800: number;
  900: number;
  950: number; // Lightness decrease
}

/**
 * Default scale configuration (based on Tailwind's approach)
 */
const defaultScaleConfig: ColorScaleConfig = {
  50: 52,
  100: 44,
  200: 36,
  300: 26,
  400: 14,
  500: 0,
  600: -10,
  700: -20,
  800: -30,
  900: -40,
  950: -48,
};

/**
 * Generate a color scale from a base color
 * The base color becomes the 500 value
 */
export function generateColorScale(
  baseColor: string,
  config: ColorScaleConfig = defaultScaleConfig,
): Record<string, string> {
  const rgb = hexToRgb(baseColor);
  if (!rgb) {
    // Return fallback scale
    return {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#e5e5e5",
      "300": "#d4d4d4",
      "400": "#a3a3a3",
      "500": baseColor,
      "600": "#525252",
      "700": "#404040",
      "800": "#262626",
      "900": "#171717",
      "950": "#0a0a0a",
    };
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const scale: Record<string, string> = {};

  // Generate each shade
  for (const [shade, adjustment] of Object.entries(config)) {
    // Adjust lightness
    let newL = hsl.l + adjustment;

    // Adjust saturation slightly for lighter shades (less saturated) and darker shades (more saturated)
    let newS = hsl.s;
    if (adjustment > 0) {
      // Lighter shades: reduce saturation slightly
      newS = Math.max(0, hsl.s - adjustment * 0.15);
    } else if (adjustment < 0) {
      // Darker shades: increase saturation slightly
      newS = Math.min(100, hsl.s - adjustment * 0.1);
    }

    // Clamp values
    newL = Math.max(0, Math.min(100, newL));
    newS = Math.max(0, Math.min(100, newS));

    const newRgb = hslToRgb(hsl.h, newS, newL);
    scale[shade] = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }

  return scale;
}

/**
 * Generate foreground color for a background
 * Returns white or black based on contrast
 */
export function generateForegroundColor(backgroundColor: string): string {
  return getContrastingTextColor(backgroundColor);
}

/**
 * Check if a color is valid hex
 */
export function isValidHex(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Normalize a hex color (ensure # prefix and 6 digits)
 */
export function normalizeHex(color: string): string {
  let hex = color.replace(/^#/, "");

  // Expand 3-digit hex
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return "#" + hex.toLowerCase();
}

/**
 * Mix two colors together
 */
export function mixColors(
  color1: string,
  color2: string,
  weight: number = 0.5,
): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const w = Math.max(0, Math.min(1, weight));

  const r = Math.round(rgb1.r * (1 - w) + rgb2.r * w);
  const g = Math.round(rgb1.g * (1 - w) + rgb2.g * w);
  const b = Math.round(rgb1.b * (1 - w) + rgb2.b * w);

  return rgbToHex(r, g, b);
}

/**
 * Generate complementary color
 */
export function getComplementary(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hsl.h = (hsl.h + 180) % 360;

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Generate analogous colors (colors next to each other on the color wheel)
 */
export function getAnalogous(
  hex: string,
  angle: number = 30,
): [string, string] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex, hex];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const h1 = (hsl.h + angle) % 360;
  const h2 = (hsl.h - angle + 360) % 360;

  const rgb1 = hslToRgb(h1, hsl.s, hsl.l);
  const rgb2 = hslToRgb(h2, hsl.s, hsl.l);

  return [rgbToHex(rgb1.r, rgb1.g, rgb1.b), rgbToHex(rgb2.r, rgb2.g, rgb2.b)];
}

/**
 * Generate triadic colors (three colors evenly spaced on the color wheel)
 */
export function getTriadic(hex: string): [string, string, string] {
  const rgb = hexToRgb(hex);
  if (!rgb) return [hex, hex, hex];

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const h1 = (hsl.h + 120) % 360;
  const h2 = (hsl.h + 240) % 360;

  const rgb1 = hslToRgb(h1, hsl.s, hsl.l);
  const rgb2 = hslToRgb(h2, hsl.s, hsl.l);

  return [
    hex,
    rgbToHex(rgb1.r, rgb1.g, rgb1.b),
    rgbToHex(rgb2.r, rgb2.g, rgb2.b),
  ];
}

/**
 * Convert hex to CSS HSL string
 */
export function hexToHslString(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "0 0% 0%";

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;
}
