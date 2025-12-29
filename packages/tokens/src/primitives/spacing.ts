/**
 * Tailwind CSS Spacing Primitives
 *
 * Complete spacing scale from Tailwind CSS v3.4
 * Used for margin, padding, gap, width, height, etc.
 */

// =============================================================================
// Spacing Scale
// =============================================================================

export const spacing = {
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem", // 2px
  "1": "0.25rem", // 4px
  "1.5": "0.375rem", // 6px
  "2": "0.5rem", // 8px
  "2.5": "0.625rem", // 10px
  "3": "0.75rem", // 12px
  "3.5": "0.875rem", // 14px
  "4": "1rem", // 16px
  "5": "1.25rem", // 20px
  "6": "1.5rem", // 24px
  "7": "1.75rem", // 28px
  "8": "2rem", // 32px
  "9": "2.25rem", // 36px
  "10": "2.5rem", // 40px
  "11": "2.75rem", // 44px
  "12": "3rem", // 48px
  "14": "3.5rem", // 56px
  "16": "4rem", // 64px
  "20": "5rem", // 80px
  "24": "6rem", // 96px
  "28": "7rem", // 112px
  "32": "8rem", // 128px
  "36": "9rem", // 144px
  "40": "10rem", // 160px
  "44": "11rem", // 176px
  "48": "12rem", // 192px
  "52": "13rem", // 208px
  "56": "14rem", // 224px
  "60": "15rem", // 240px
  "64": "16rem", // 256px
  "72": "18rem", // 288px
  "80": "20rem", // 320px
  "96": "24rem", // 384px
} as const;

// =============================================================================
// Spacing with Pixel Values (for editor display)
// =============================================================================

export const spacingWithPx = {
  "0": { value: "0px", px: 0 },
  px: { value: "1px", px: 1 },
  "0.5": { value: "0.125rem", px: 2 },
  "1": { value: "0.25rem", px: 4 },
  "1.5": { value: "0.375rem", px: 6 },
  "2": { value: "0.5rem", px: 8 },
  "2.5": { value: "0.625rem", px: 10 },
  "3": { value: "0.75rem", px: 12 },
  "3.5": { value: "0.875rem", px: 14 },
  "4": { value: "1rem", px: 16 },
  "5": { value: "1.25rem", px: 20 },
  "6": { value: "1.5rem", px: 24 },
  "7": { value: "1.75rem", px: 28 },
  "8": { value: "2rem", px: 32 },
  "9": { value: "2.25rem", px: 36 },
  "10": { value: "2.5rem", px: 40 },
  "11": { value: "2.75rem", px: 44 },
  "12": { value: "3rem", px: 48 },
  "14": { value: "3.5rem", px: 56 },
  "16": { value: "4rem", px: 64 },
  "20": { value: "5rem", px: 80 },
  "24": { value: "6rem", px: 96 },
  "28": { value: "7rem", px: 112 },
  "32": { value: "8rem", px: 128 },
  "36": { value: "9rem", px: 144 },
  "40": { value: "10rem", px: 160 },
  "44": { value: "11rem", px: 176 },
  "48": { value: "12rem", px: 192 },
  "52": { value: "13rem", px: 208 },
  "56": { value: "14rem", px: 224 },
  "60": { value: "15rem", px: 240 },
  "64": { value: "16rem", px: 256 },
  "72": { value: "18rem", px: 288 },
  "80": { value: "20rem", px: 320 },
  "96": { value: "24rem", px: 384 },
} as const;

// =============================================================================
// Negative Spacing (for negative margins)
// =============================================================================

export const negativeSpacing = Object.fromEntries(
  Object.entries(spacing)
    .filter(([key]) => key !== "0")
    .map(([key, value]) => [`-${key}`, `-${value}`]),
) as Record<`-${Exclude<keyof typeof spacing, "0">}`, string>;

// =============================================================================
// Types
// =============================================================================

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];
export type NegativeSpacingKey = keyof typeof negativeSpacing;

// =============================================================================
// Utilities
// =============================================================================

/** Get spacing value by key */
export function getSpacing(key: SpacingKey): SpacingValue {
  return spacing[key];
}

/** Get spacing in pixels */
export function getSpacingPx(key: SpacingKey): number {
  return spacingWithPx[key].px;
}
