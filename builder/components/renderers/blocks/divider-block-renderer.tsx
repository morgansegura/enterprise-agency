import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface DividerBlockData {
  style?: "solid" | "dashed" | "dotted";
  thickness?: "thin" | "medium" | "thick";
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "muted" | "primary" | "secondary";
}

const styleClasses = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
};

const thicknessClasses = {
  thin: "border-t",
  medium: "border-t-2",
  thick: "border-t-4",
};

const spacingClasses = {
  xs: "my-2",
  sm: "my-4",
  md: "my-6",
  lg: "my-8",
  xl: "my-12",
};

const colorClasses = {
  default: "border-border",
  muted: "border-muted",
  primary: "border-primary",
  secondary: "border-secondary",
};

export default function DividerBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as DividerBlockData;
  const {
    style = "solid",
    thickness = "thin",
    spacing = "md",
    color = "default",
  } = data;

  return (
    <hr
      className={cn(
        styleClasses[style],
        thicknessClasses[thickness],
        spacingClasses[spacing],
        colorClasses[color],
      )}
    />
  );
}
