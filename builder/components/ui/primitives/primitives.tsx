import * as React from "react";
import { cn } from "@/lib/utils";
import "./primitives.css";

// ============================================================================
// Spacing type
// ============================================================================

export type Space =
  | "0"
  | "025"
  | "050"
  | "075"
  | "100"
  | "150"
  | "200"
  | "250"
  | "300"
  | "400"
  | "500"
  | "600";

// ============================================================================
// Box
// ============================================================================

interface BoxProps extends React.ComponentProps<"div"> {
  as?: React.ElementType;
  padding?: Space;
  paddingBlock?: Space;
  paddingInline?: Space;
  backgroundColor?: "surface" | "surface-sunken" | "surface-raised";
}

function Box({
  as: Component = "div",
  padding,
  paddingBlock,
  paddingInline,
  backgroundColor,
  className,
  ...props
}: BoxProps) {
  return (
    <Component
      data-slot="box"
      data-padding={padding}
      data-padding-block={paddingBlock}
      data-padding-inline={paddingInline}
      data-bg={backgroundColor}
      className={cn(className)}
      {...props}
    />
  );
}

// ============================================================================
// Stack (vertical)
// ============================================================================

interface StackProps extends React.ComponentProps<"div"> {
  as?: React.ElementType;
  space?: Space;
  align?: "start" | "center" | "end" | "stretch";
}

function Stack({
  as: Component = "div",
  space = "100",
  align,
  className,
  ...props
}: StackProps) {
  return (
    <Component
      data-slot="stack"
      data-space={space}
      data-align={align}
      className={cn(className)}
      {...props}
    />
  );
}

// ============================================================================
// Inline (horizontal)
// ============================================================================

interface InlineProps extends React.ComponentProps<"div"> {
  as?: React.ElementType;
  space?: Space;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  spread?: boolean;
  wrap?: boolean;
}

function Inline({
  as: Component = "div",
  space = "100",
  align = "center",
  spread = false,
  wrap = false,
  className,
  ...props
}: InlineProps) {
  return (
    <Component
      data-slot="inline"
      data-space={space}
      data-align={align}
      data-spread={spread || undefined}
      data-wrap={wrap || undefined}
      className={cn(className)}
      {...props}
    />
  );
}

// ============================================================================
// Flex
// ============================================================================

interface FlexProps extends React.ComponentProps<"div"> {
  as?: React.ElementType;
  direction?: "row" | "column";
  gap?: Space;
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

function Flex({
  as: Component = "div",
  direction = "row",
  gap = "100",
  align,
  justify,
  wrap = false,
  className,
  ...props
}: FlexProps) {
  return (
    <Component
      data-slot="flex"
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      className={cn(className)}
      {...props}
    />
  );
}

// ============================================================================
// Grid
// ============================================================================

interface GridProps extends React.ComponentProps<"div"> {
  as?: React.ElementType;
  columns?: number | string;
  gap?: Space;
  alignItems?: "start" | "center" | "end" | "stretch";
}

function Grid({
  as: Component = "div",
  columns = 1,
  gap = "100",
  alignItems,
  className,
  style,
  ...props
}: GridProps) {
  const templateColumns =
    typeof columns === "number" ? `repeat(${columns}, 1fr)` : columns;

  return (
    <Component
      data-slot="grid"
      data-gap={gap}
      data-align-items={alignItems}
      className={cn(className)}
      style={{ gridTemplateColumns: templateColumns, ...style }}
      {...props}
    />
  );
}

// ============================================================================
// Bleed (negative margins)
// ============================================================================

interface BleedProps extends React.ComponentProps<"div"> {
  all?: Space;
  block?: Space;
  inline?: Space;
}

function Bleed({ all, block, inline, className, ...props }: BleedProps) {
  return (
    <div
      data-slot="bleed"
      data-all={all}
      data-block={block}
      data-inline={inline}
      className={cn(className)}
      {...props}
    />
  );
}

export { Box, Stack, Inline, Flex, Grid, Bleed };
