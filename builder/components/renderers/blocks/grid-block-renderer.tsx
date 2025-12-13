import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "../block-renderer";

interface GridBlockData {
  columns?: "1" | "2" | "3" | "4" | "5" | "6" | "auto";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  autoFlow?: "row" | "column" | "dense";
  blocks?: Block[];
}

const columnsClasses = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  "5": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  "6": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  auto: "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
};

const gapClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const autoFlowClasses = {
  row: "grid-flow-row",
  column: "grid-flow-col",
  dense: "grid-flow-dense",
};

export default function GridBlockRenderer({ block, breakpoint }: BlockRendererProps) {
  const data = block.data as unknown as GridBlockData;
  const {
    columns = "2",
    gap = "md",
    autoFlow = "row",
    blocks = [],
  } = data;

  return (
    <div
      className={cn(
        "grid",
        columnsClasses[columns],
        gapClasses[gap],
        autoFlowClasses[autoFlow],
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
