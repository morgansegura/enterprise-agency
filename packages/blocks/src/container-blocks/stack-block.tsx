import { cn } from "@enterprise/tokens";
import type { BlockRendererProps, Block } from "../types";

interface StackBlockData {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  blocks?: Block[];
}

const stackGapClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const stackAlignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export function StackBlock({ block, renderBlock }: BlockRendererProps) {
  const data = block.data as unknown as StackBlockData;
  const { gap = "md", align = "stretch", blocks = [] } = data;

  return (
    <div
      className={cn(
        "flex flex-col",
        stackGapClasses[gap],
        stackAlignClasses[align],
      )}
    >
      {blocks.map((childBlock, index) =>
        renderBlock ? renderBlock(childBlock, index) : null,
      )}
    </div>
  );
}
