import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import type { Block } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "../block-renderer";

interface StackBlockData {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  blocks?: Block[];
}

const gapClasses = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export default function StackBlockRenderer({
  block,
  breakpoint,
}: BlockRendererProps) {
  const data = block.data as unknown as StackBlockData;
  const { gap = "md", align = "stretch", blocks = [] } = data;

  return (
    <div className={cn("flex flex-col", gapClasses[gap], alignClasses[align])}>
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
