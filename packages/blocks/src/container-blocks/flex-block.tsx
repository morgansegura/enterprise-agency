import { cn } from "@enterprise/tokens";
import type { BlockRendererProps, Block } from "../types";

interface FlexBlockData {
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  wrap?: boolean;
  blocks?: Block[];
}

const flexDirectionClasses = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
};

const flexJustifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const flexAlignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const flexGapClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export function FlexBlock({ block, renderBlock }: BlockRendererProps) {
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
        flexDirectionClasses[direction],
        flexJustifyClasses[justify],
        flexAlignClasses[align],
        flexGapClasses[gap],
        wrap && "flex-wrap",
      )}
    >
      {blocks.map((childBlock, index) =>
        renderBlock ? renderBlock(childBlock, index) : null,
      )}
    </div>
  );
}
