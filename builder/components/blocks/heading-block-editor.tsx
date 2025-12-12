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
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl";
    align?: "left" | "center" | "right";
    weight?: "normal" | "medium" | "semibold" | "bold";
    color?: "default" | "primary" | "secondary" | "muted";
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
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "5xl": "text-5xl",
  "6xl": "text-6xl",
};

const alignMap: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const weightMap: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorMap: Record<string, string> = {
  default: "text-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
  muted: "text-muted-foreground",
};

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
  const color =
    getResponsiveValue<string>(block.data, "color", breakpoint) || "default";

  const headingClasses = cn(
    sizeMap[size],
    alignMap[align],
    weightMap[weight],
    colorMap[color],
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
