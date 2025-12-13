import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "../block-renderer";

interface FlexBlockData {
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  wrap?: boolean;
  blocks?: Block[];
}

const directionClasses = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const gapClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export default function FlexBlockRenderer({
  block,
  breakpoint,
}: BlockRendererProps) {
  const data = block.data as unknown as FlexBlockData;
  const {
    direction = "row",
    justify = "start",
    align = "start",
    gap = "md",
    wrap = false,
    blocks = [],
  } = data;

  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        wrap && "flex-wrap",
      )}
    >
      {blocks.map((childBlock) => (
        <BlockRenderer
          key={childBlock._key}
          block={childBlock}
          breakpoint={breakpoint}
        />
      ))}
    </div>
  );
}
