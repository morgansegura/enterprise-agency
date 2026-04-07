/**
 * Color Conversion Utilities
 *
 * Pure functions for converting between HSV, RGB, HSL, and hex.
 * Used by the full-spectrum color picker.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ParsedColor {
  hex: string; // #rrggbb
  rgb: RGB;
  hsv: HSV;
  alpha: number; // 0-1
}

// ---------------------------------------------------------------------------
// HSV <-> RGB
// ---------------------------------------------------------------------------

export function hsvToRgb(h: number, s: number, v: number): RGB {
  const s1 = s / 100;
  const v1 = v / 100;
  const c = v1 * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v1 - c;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r1) h = ((g1 - b1) / d + 6) % 6;
    else if (max === g1) h = (b1 - r1) / d + 2;
    else h = (r1 - g1) / d + 4;
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(max === 0 ? 0 : (d / max) * 100),
    v: Math.round(max * 100),
  };
}

// ---------------------------------------------------------------------------
// RGB <-> HSL
// ---------------------------------------------------------------------------

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  const d = max - min;

  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r1) h = ((g1 - b1) / d + 6) % 6;
    else if (max === g1) h = (b1 - r1) / d + 2;
    else h = (r1 - g1) / d + 4;
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  const s1 = s / 100;
  const l1 = l / 100;
  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l1 - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// ---------------------------------------------------------------------------
// Hex <-> RGB
// ---------------------------------------------------------------------------

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function hexToRgb(hex: string): RGB {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  return {
    r: parseInt(h.slice(0, 2), 16) || 0,
    g: parseInt(h.slice(2, 4), 16) || 0,
    b: parseInt(h.slice(4, 6), 16) || 0,
  };
}

// ---------------------------------------------------------------------------
// Parse any CSS color string
// ---------------------------------------------------------------------------

export function parseAnyColor(value: string): ParsedColor {
  if (!value || value === "transparent") {
    return {
      hex: "#000000",
      rgb: { r: 0, g: 0, b: 0 },
      hsv: { h: 0, s: 0, v: 0 },
      alpha: 0,
    };
  }

  // CSS variable — can't parse, return black
  if (value.startsWith("var(")) {
    return {
      hex: "#000000",
      rgb: { r: 0, g: 0, b: 0 },
      hsv: { h: 0, s: 0, v: 0 },
      alpha: 1,
    };
  }

  // rgba/rgb
  const rgbaMatch = value.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/,
  );
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const alpha = parseFloat(rgbaMatch[4] ?? "1");
    return {
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsv: rgbToHsv(r, g, b),
      alpha,
    };
  }

  // hsla/hsl
  const hslaMatch = value.match(
    /hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*(?:,\s*([\d.]+)\s*)?\)/,
  );
  if (hslaMatch) {
    const h = parseInt(hslaMatch[1]);
    const s = parseInt(hslaMatch[2]);
    const l = parseInt(hslaMatch[3]);
    const alpha = parseFloat(hslaMatch[4] ?? "1");
    const rgb = hslToRgb(h, s, l);
    return {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
      alpha,
    };
  }

  // Hex
  const rgb = hexToRgb(value);
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
    alpha: 1,
  };
}

// ---------------------------------------------------------------------------
// Format output
// ---------------------------------------------------------------------------

export function formatHex(rgb: RGB): string {
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function formatRgba(rgb: RGB, alpha: number): string {
  if (alpha === 1) return rgbToHex(rgb.r, rgb.g, rgb.b);
  if (alpha === 0) return "transparent";
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function formatHsla(hsl: HSL, alpha: number): string {
  if (alpha === 1) return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;
}

/**
 * Build a color output string from RGB + alpha.
 * Returns hex when alpha is 1, rgba otherwise.
 */
export function buildColorOutput(rgb: RGB, alpha: number): string {
  return formatRgba(rgb, alpha);
}
