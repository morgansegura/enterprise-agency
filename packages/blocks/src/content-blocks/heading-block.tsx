import { cn } from "@enterprise/tokens";
import {
  getColorValue,
  sizeClasses,
  alignClasses,
  weightClasses,
  letterSpacingClasses,
  lineHeightClasses,
} from "@enterprise/ui";
import type { BlockRendererProps } from "../types";

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
  color?: string;
  fontFamily?: string;
}

export function HeadingBlock({ block }: BlockRendererProps) {
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
  const colorValue = getColorValue(color);

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
