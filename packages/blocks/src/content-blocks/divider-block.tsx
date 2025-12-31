import { cn } from "@enterprise/tokens";
import type { BlockRendererProps } from "../types";

interface DividerBlockData {
  variant?: "solid" | "dashed" | "dotted";
  thickness?: "thin" | "normal" | "thick";
  color?: "default" | "muted" | "primary" | "secondary";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

const variantClasses = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

const thicknessClasses = {
  thin: "border-t",
  normal: "border-t-2",
  thick: "border-t-4",
};

const colorClasses = {
  default: "border-border",
  muted: "border-muted",
  primary: "border-primary",
  secondary: "border-secondary",
};

const spacingClasses = {
  none: "my-0",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
  xl: "my-8",
};

export function DividerBlock({ block }: BlockRendererProps) {
  const data = block.data as unknown as DividerBlockData;
  const {
    variant = "solid",
    thickness = "normal",
    color = "default",
    spacing = "md",
  } = data;

  return (
    <hr
      className={cn(
        "w-full border-0",
        variantClasses[variant],
        thicknessClasses[thickness],
        colorClasses[color],
        spacingClasses[spacing],
      )}
    />
  );
}
