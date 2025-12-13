import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface RichTextBlockData {
  html: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}

const sizeClasses = {
  sm: "prose-sm",
  md: "prose-base",
  lg: "prose-lg",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function RichTextBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as RichTextBlockData;
  const { html, size = "md", align = "left" } = data;

  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        sizeClasses[size],
        alignClasses[align],
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
