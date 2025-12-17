"use client";

import { InlineText } from "@/components/editor/inline-text";
import { useResponsiveChange } from "@/components/editor/responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import { cn } from "@/lib/utils";

interface HeadingBlockData {
  _key: string;
  _type: "heading-block";
  data: {
    text: string;
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
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
    weight?: "normal" | "medium" | "semibold" | "bold" | "thin" | "extralight" | "light" | "extrabold" | "black";
    letterSpacing?: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest";
    lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";
    color?: string; // Any color: preset name, hex, rgb, css var
    fontFamily?: string; // Font family: global preset var or custom font string
    _responsive?: {
      tablet?: Partial<HeadingBlockData["data"]>;
      mobile?: Partial<HeadingBlockData["data"]>;
    };
  };
}

interface HeadingBlockEditorProps {
  block: HeadingBlockData;
  onChange: (block: HeadingBlockData) => void;
  onDelete: () => void;
  isSelected?: boolean;
}

const sizeMap: Record<string, string> = {
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

const alignMap: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const weightMap: Record<string, string> = {
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

const letterSpacingMap: Record<string, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  wider: "tracking-wider",
  widest: "tracking-widest",
};

const lineHeightMap: Record<string, string> = {
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

/**
 * HeadingBlockEditor - WYSIWYG Version
 *
 * Renders heading exactly as it will appear on the live site.
 * Click to edit text inline.
 */
export function HeadingBlockEditor({
  block,
  onChange,
}: HeadingBlockEditorProps) {
  const breakpoint = useCurrentBreakpoint();

  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as HeadingBlockData["data"] }),
  );

  // Get responsive-aware values
  const level = block.data.level || "h2";
  const size =
    getResponsiveValue<string>(block.data, "size", breakpoint) || "2xl";
  const align =
    getResponsiveValue<string>(block.data, "align", breakpoint) || "left";
  const weight =
    getResponsiveValue<string>(block.data, "weight", breakpoint) || "semibold";
  const letterSpacing =
    getResponsiveValue<string>(block.data, "letterSpacing", breakpoint);
  const lineHeight =
    getResponsiveValue<string>(block.data, "lineHeight", breakpoint);
  const color =
    getResponsiveValue<string>(block.data, "color", breakpoint);
  const fontFamily =
    getResponsiveValue<string>(block.data, "fontFamily", breakpoint);

  const headingClasses = cn(
    sizeMap[size],
    alignMap[align],
    weightMap[weight],
    letterSpacing && letterSpacingMap[letterSpacing],
    lineHeight && lineHeightMap[lineHeight],
  );

  // Inline style for color and fontFamily (supports any value: hex, rgb, css var, preset name)
  const colorValue = getColorValue(color);
  const headingStyle: React.CSSProperties = {
    ...(colorValue && { color: colorValue }),
    ...(fontFamily && { fontFamily }),
  };

  return (
    <InlineText
      value={block.data.text}
      onChange={(text) => handleDataChange("text", text)}
      placeholder="Enter heading..."
      as={level}
      className={headingClasses}
      style={headingStyle}
    />
  );
}
