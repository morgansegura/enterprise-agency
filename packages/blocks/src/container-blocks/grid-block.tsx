import { cn } from "@enterprise/tokens";
import type { BlockRendererProps, Block } from "../types";

interface GridBlockData {
  columns?: "1" | "2" | "3" | "4" | "5" | "6" | "auto";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  autoFlow?: "row" | "column" | "dense";
  blocks?: Block[];
}

const gridColumnsClasses = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  "5": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  "6": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  auto: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
};

const gridGapClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const gridAutoFlowClasses = {
  row: "grid-flow-row",
  column: "grid-flow-col",
  dense: "grid-flow-dense",
};

export function GridBlock({ block, renderBlock }: BlockRendererProps) {
  const data = block.data as unknown as GridBlockData;
  const { columns = "2", gap = "md", autoFlow = "row", blocks = [] } = data;

  return (
    <div
      className={cn(
        "grid",
        gridColumnsClasses[columns],
        gridGapClasses[gap],
        gridAutoFlowClasses[autoFlow],
      )}
    >
      {blocks.map((childBlock, index) =>
        renderBlock ? renderBlock(childBlock, index) : null,
      )}
    </div>
  );
}
