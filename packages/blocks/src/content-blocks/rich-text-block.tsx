import { cn } from "@enterprise/tokens";
import type { BlockRendererProps } from "../types";

interface RichTextBlockData {
  html: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}

const proseSizeClasses = {
  sm: "prose-sm",
  md: "prose-base",
  lg: "prose-lg",
};

const proseAlignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function RichTextBlock({ block }: BlockRendererProps) {
  const data = block.data as unknown as RichTextBlockData;
  const { html, size = "md", align = "left" } = data;

  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        proseSizeClasses[size],
        proseAlignClasses[align],
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
