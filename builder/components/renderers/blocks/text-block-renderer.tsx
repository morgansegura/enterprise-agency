import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface TextBlockData {
  text: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right";
  variant?: "body" | "lead" | "muted" | "small";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const variantClasses = {
  body: "text-foreground",
  lead: "text-xl text-muted-foreground",
  muted: "text-muted-foreground",
  small: "text-sm text-muted-foreground",
};

export default function TextBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as TextBlockData;
  const { text, size = "md", align = "left", variant = "body" } = data;

  return (
    <p
      className={cn(
        sizeClasses[size],
        alignClasses[align],
        variantClasses[variant],
      )}
    >
      {text}
    </p>
  );
}
