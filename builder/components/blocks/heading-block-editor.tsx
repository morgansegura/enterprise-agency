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
    // Content
    text: string;
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    // Typography - Size & Spacing
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
    letterSpacing?:
      | "tighter"
      | "tight"
      | "normal"
      | "wide"
      | "wider"
      | "widest";
    lineHeight?: "none" | "tight" | "snug" | "normal" | "relaxed" | "loose";

    // Typography - Style
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
    fontStyle?: "normal" | "italic";
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
    textDecoration?: "none" | "underline" | "line-through";

    // Typography - Color (preset only)
    color?:
      | "default"
      | "primary"
      | "secondary"
      | "muted"
      | "accent"
      | "destructive";

    // Layout
    align?: "left" | "center" | "right";
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "none";
    whiteSpace?: "normal" | "nowrap" | "pre-wrap";

    // Effects
    opacity?: number; // 0-100, mapped to preset (10, 25, 50, 75, 90, 100)

    // Responsive overrides
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

const fontStyleMap: Record<string, string> = {
  normal: "not-italic",
  italic: "italic",
};

const textTransformMap: Record<string, string> = {
  none: "normal-case",
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
};

const textDecorationMap: Record<string, string> = {
  none: "no-underline",
  underline: "underline",
  "line-through": "line-through",
};

const whiteSpaceMap: Record<string, string> = {
  normal: "whitespace-normal",
  nowrap: "whitespace-nowrap",
  "pre-wrap": "whitespace-pre-wrap",
};

const maxWidthMap: Record<string, string> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  prose: "max-w-prose",
  none: "max-w-none",
};

const colorMap: Record<string, string> = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground",
  accent: "text-accent",
  destructive: "text-destructive",
};

const opacityMap: Record<number, string> = {
  10: "opacity-10",
  25: "opacity-25",
  50: "opacity-50",
  75: "opacity-75",
  90: "opacity-90",
  100: "opacity-100",
};

/**
 * Get the closest opacity preset class
 */
function getOpacityClass(opacity: number | undefined): string | undefined {
  if (opacity === undefined) return undefined;
  if (opacity <= 10) return opacityMap[10];
  if (opacity <= 25) return opacityMap[25];
  if (opacity <= 50) return opacityMap[50];
  if (opacity <= 75) return opacityMap[75];
  if (opacity <= 90) return opacityMap[90];
  return opacityMap[100];
}

/**
 * HeadingBlockEditor - WYSIWYG Version
 *
 * Renders heading exactly as it will appear on the live site.
 * Click to edit text inline.
 *
 * Supports comprehensive typography properties via CSS classes:
 * - Size & Spacing: size, letterSpacing, lineHeight
 * - Style: weight, fontStyle, textTransform, textDecoration
 * - Color: color (preset only)
 * - Layout: align, maxWidth, whiteSpace
 * - Effects: opacity
 */
export function HeadingBlockEditor({
  block,
  onChange,
}: HeadingBlockEditorProps) {
  const breakpoint = useCurrentBreakpoint();

  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as HeadingBlockData["data"] }),
  );

  // Get responsive-aware values - Content
  const level = block.data.level || "h2";

  // Size & Spacing
  const size =
    getResponsiveValue<string>(block.data, "size", breakpoint) || "2xl";
  const letterSpacing = getResponsiveValue<string>(
    block.data,
    "letterSpacing",
    breakpoint,
  );
  const lineHeight = getResponsiveValue<string>(
    block.data,
    "lineHeight",
    breakpoint,
  );

  // Style
  const weight =
    getResponsiveValue<string>(block.data, "weight", breakpoint) || "semibold";
  const fontStyle = getResponsiveValue<string>(
    block.data,
    "fontStyle",
    breakpoint,
  );
  const textTransform = getResponsiveValue<string>(
    block.data,
    "textTransform",
    breakpoint,
  );
  const textDecoration = getResponsiveValue<string>(
    block.data,
    "textDecoration",
    breakpoint,
  );

  // Color
  const color = getResponsiveValue<string>(block.data, "color", breakpoint);

  // Layout
  const align =
    getResponsiveValue<string>(block.data, "align", breakpoint) || "left";
  const maxWidth = getResponsiveValue<string>(
    block.data,
    "maxWidth",
    breakpoint,
  );
  const whiteSpace = getResponsiveValue<string>(
    block.data,
    "whiteSpace",
    breakpoint,
  );

  // Effects
  const opacity = getResponsiveValue<number>(block.data, "opacity", breakpoint);

  // Build Tailwind classes (no inline styles)
  const headingClasses = cn(
    // Size & Spacing
    sizeMap[size],
    letterSpacing && letterSpacingMap[letterSpacing],
    lineHeight && lineHeightMap[lineHeight],
    // Style
    weightMap[weight],
    fontStyle && fontStyleMap[fontStyle],
    textTransform && textTransformMap[textTransform],
    textDecoration && textDecorationMap[textDecoration],
    // Color
    color && colorMap[color],
    // Layout
    alignMap[align],
    maxWidth && maxWidthMap[maxWidth],
    maxWidth && align === "center" && "mx-auto",
    whiteSpace && whiteSpaceMap[whiteSpace],
    // Effects
    getOpacityClass(opacity),
  );

  return (
    <InlineText
      value={block.data.text}
      onChange={(text) => handleDataChange("text", text)}
      placeholder="Enter heading..."
      as={level}
      className={headingClasses}
    />
  );
}
