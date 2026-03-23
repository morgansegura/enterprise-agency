"use client";

import { InlineText } from "@/components/editor/inline-text";
import { useResponsiveChange } from "@/components/editor/responsive-field";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";

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
 * HeadingBlockEditor - WYSIWYG Version
 *
 * Renders heading exactly as it will appear on the live site using
 * data-* attributes for styling (matching client/components/ui/heading).
 * Click to edit text inline.
 *
 * Supports comprehensive typography properties via data-* attributes:
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
    <InlineText
      value={block.data.text}
      onChange={(text) => handleDataChange("text", text)}
      placeholder="Enter heading..."
      as={level}
      className="heading"
      {...filteredDataAttributes}
    />
  );
}
