import { cn } from "@enterprise/tokens";
import type { BlockRendererProps } from "../types";

interface SpacerBlockData {
  height?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const heightClasses = {
  xs: "h-2",
  sm: "h-4",
  md: "h-8",
  lg: "h-12",
  xl: "h-16",
  "2xl": "h-24",
};

export function SpacerBlock({ block }: BlockRendererProps) {
  const data = block.data as unknown as SpacerBlockData;
  const { height = "md" } = data;

  return <div className={cn(heightClasses[height])} aria-hidden="true" />;
}
