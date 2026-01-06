import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

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
  fontStyle?: "normal" | "italic";
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  textDecoration?: "none" | "underline" | "line-through";
  color?: "default" | "primary" | "secondary" | "muted" | "accent" | "destructive";
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "none";
  whiteSpace?: "normal" | "nowrap" | "pre-wrap";
  opacity?: number;
}

/**
 * Get the closest opacity preset value
 */
function getOpacityPreset(opacity: number | undefined): string | undefined {
  if (opacity === undefined) return undefined;
  if (opacity <= 10) return "10";
  if (opacity <= 25) return "25";
  if (opacity <= 50) return "50";
  if (opacity <= 75) return "75";
  if (opacity <= 90) return "90";
  return "100";
}

/**
 * HeadingBlockRenderer - Preview/Export Version
 *
 * Uses data-* attributes for styling (matching HeadingBlockEditor and client).
 * This ensures WYSIWYG parity between builder and frontend.
 */
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
    fontStyle,
    textTransform,
    textDecoration,
    color,
    maxWidth,
    whiteSpace,
    opacity,
  } = data;

  const Tag = level;

  // Build data attributes for CSS-based styling (matching client's Heading component)
  const dataAttributes: Record<string, string | undefined> = {
    "data-size": size,
    "data-weight": weight,
    "data-align": align,
    "data-letter-spacing": letterSpacing,
    "data-line-height": lineHeight,
    "data-font-style": fontStyle,
    "data-text-transform": textTransform,
    "data-text-decoration": textDecoration,
    "data-white-space": whiteSpace,
    "data-max-width": maxWidth,
    "data-opacity": getOpacityPreset(opacity),
    "data-color": color,
  };

  // Filter out undefined values
  const filteredDataAttributes = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  return (
    <Tag className="heading" {...filteredDataAttributes}>
      {text}
    </Tag>
  );
}
