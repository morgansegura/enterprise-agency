import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "../block-renderer";

interface ColumnsBlockData {
  count?: "2" | "3" | "4";
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  responsive?: boolean;
  blocks?: Block[];
}

const countClasses = {
  "2": "lg:grid-cols-2",
  "3": "lg:grid-cols-3",
  "4": "lg:grid-cols-4",
};

const responsiveCountClasses = {
  "2": "md:grid-cols-2",
  "3": "sm:grid-cols-2 lg:grid-cols-3",
  "4": "sm:grid-cols-2 lg:grid-cols-4",
};

const gapClasses = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

export default function ColumnsBlockRenderer({ block, breakpoint }: BlockRendererProps) {
  const data = block.data as unknown as ColumnsBlockData;
  const { count = "2", gap = "md", responsive = true, blocks = [] } = data;

  return (
    <div
      className={cn(
        "grid grid-cols-1",
        responsive ? responsiveCountClasses[count] : countClasses[count],
        gapClasses[gap],
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
