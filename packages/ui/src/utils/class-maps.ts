/**
 * Shared Tailwind Class Maps
 *
 * Utility class mappings used by both builder and client apps
 * for consistent styling across the design system.
 */

// Size classes for text/headings
export const sizeClasses: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
  "7xl": "text-7xl",
  "8xl": "text-8xl",
  "9xl": "text-9xl",
};

// Text alignment classes
export const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

// Font weight classes
export const weightClasses: Record<string, string> = {
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

// Letter spacing classes
export const letterSpacingClasses: Record<string, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

// Line height classes
export const lineHeightClasses: Record<string, string> = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

// Text variant classes
export const variantClasses: Record<string, string> = {
  default: "text-foreground",
  body: "text-foreground",
  muted: "text-muted-foreground",
  caption: "text-muted-foreground text-sm",
  lead: "text-xl text-muted-foreground",
};

// Color preset CSS variable mappings
export const colorPresets: Record<string, string> = {
  default: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  muted: "var(--muted-foreground)",
  accent: "var(--accent)",
  destructive: "var(--destructive)",
};

// Max width preset classes
export const maxWidthClasses: Record<string, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  prose: "max-w-prose",
  none: "max-w-none",
};

// Opacity preset classes
export const opacityClasses: Record<string, string> = {
  "10": "opacity-10",
  "25": "opacity-25",
  "50": "opacity-50",
  "75": "opacity-75",
  "90": "opacity-90",
  "100": "opacity-100",
};

// Gap/spacing classes
export const gapClasses: Record<string, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  "2xl": "gap-12",
};

// Padding classes
export const paddingClasses: Record<string, string> = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  "2xl": "p-12",
};

// Border radius classes
export const radiusClasses: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

// Shadow classes
export const shadowClasses: Record<string, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

// Flex direction classes
export const flexDirectionClasses: Record<string, string> = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  col: "flex-col",
  "col-reverse": "flex-col-reverse",
};

// Flex justify classes
export const justifyClasses: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

// Flex align items classes
export const alignItemsClasses: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

// Grid column span classes
export const colSpanClasses: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

// Grid columns classes
export const gridColsClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

/**
 * Get the actual color value from a preset name or return as-is if it's a custom color
 */
export function getColorValue(color: string | undefined): string | undefined {
  if (!color) return undefined;
  // Check if it's a preset
  if (colorPresets[color]) return colorPresets[color];
  // Otherwise return as-is (hex, rgb, css var, etc.)
  return color;
}

/**
 * Build Tailwind classes from a class map with a default fallback
 */
export function getClassFromMap(
  map: Record<string, string>,
  value: string | undefined,
  defaultValue: string,
): string {
  if (!value) return map[defaultValue] || "";
  return map[value] || map[defaultValue] || "";
}
