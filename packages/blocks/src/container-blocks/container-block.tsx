import { cn } from "@enterprise/tokens";
import type { BlockRendererProps, Block } from "../types";

interface ContainerBlockData {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  background?: "none" | "white" | "gray" | "dark" | "primary" | "secondary";
  blocks?: Block[];
}

const containerMaxWidthClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

const containerPaddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-12",
};

const containerBackgroundClasses = {
  none: "",
  white: "bg-white",
  gray: "bg-gray-100 dark:bg-gray-900",
  dark: "bg-gray-900 text-white",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

export function ContainerBlock({ block, renderBlock }: BlockRendererProps) {
  const data = block.data as unknown as ContainerBlockData;
  const {
    maxWidth = "full",
    padding = "md",
    background = "none",
    blocks = [],
  } = data;

  return (
    <div
      className={cn(
        "mx-auto w-full",
        containerMaxWidthClasses[maxWidth],
        containerPaddingClasses[padding],
        containerBackgroundClasses[background],
      )}
    >
      {blocks.map((childBlock, index) =>
        renderBlock ? renderBlock(childBlock, index) : null,
      )}
    </div>
  );
}
