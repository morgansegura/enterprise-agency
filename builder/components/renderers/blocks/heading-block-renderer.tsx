import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface HeadingBlockData {
  text: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  align?: "left" | "center" | "right";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "primary" | "secondary";
}

const sizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const colorClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary",
};

export default function HeadingBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as HeadingBlockData;
  const {
    text,
    level = "h2",
    size = "2xl",
    align = "left",
    weight = "semibold",
    color = "default",
  } = data;

  const Tag = level;

  return (
    <Tag
      className={cn(
        sizeClasses[size],
        alignClasses[align],
        weightClasses[weight],
        colorClasses[color],
      )}
    >
      {text}
    </Tag>
  );
}
