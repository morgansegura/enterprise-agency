import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface HeadingBlockData {
  text: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  align?: "left" | "center" | "right";
  weight?:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black";
  letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
  lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
  color?: string; // Any color: preset name, hex, rgb, css var
  fontFamily?: string; // Font family: global preset var or custom font string
}

// Match editor's HeadingBlockEditor sizeMap exactly
const sizeClasses: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
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

const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const weightClasses: Record<string, string> = {
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

const letterSpacingClasses: Record<string, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

const lineHeightClasses: Record<string, string> = {
  none: "leading-none",
  tight: "leading-tight",
  snug: "leading-snug",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

// Legacy color presets (for backwards compatibility)
const colorPresets: Record<string, string> = {
  default: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  muted: "var(--muted-foreground)",
  accent: "var(--accent)",
  destructive: "var(--destructive)",
};

/**
 * Get the actual color value from a preset name or return as-is if it's a custom color
 */
function getColorValue(color: string | undefined): string | undefined {
  if (!color) return undefined;
  // Check if it's a preset
  if (colorPresets[color]) return colorPresets[color];
  // Otherwise return as-is (hex, rgb, css var, etc.)
  return color;
}

export default function HeadingBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as HeadingBlockData;
  const {
    text,
    level = "h2",
    size = "2xl",
    align = "left",
    weight = "semibold",
    letterSpacing,
    lineHeight,
    color,
    fontFamily,
  } = data;

  const Tag = level;

  // Get color value (supports presets and custom colors)
  const colorValue = getColorValue(color);

  // Build inline styles for color and fontFamily
  const style: React.CSSProperties = {
    ...(colorValue && { color: colorValue }),
    ...(fontFamily && { fontFamily }),
  };

  return (
    <Tag
      className={cn(
        sizeClasses[size] || sizeClasses["2xl"],
        alignClasses[align] || alignClasses.left,
        weightClasses[weight] || weightClasses.semibold,
        letterSpacing && letterSpacingClasses[letterSpacing],
        lineHeight && lineHeightClasses[lineHeight],
      )}
      style={Object.keys(style).length > 0 ? style : undefined}
    >
      {text}
    </Tag>
  );
}
