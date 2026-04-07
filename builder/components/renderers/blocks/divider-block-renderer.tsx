import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface DividerBlockData {
  style?: "solid" | "dashed" | "dotted";
  weight?: "thin" | "normal" | "thick";
  spacing?: "sm" | "md" | "lg";
  variant?: "default" | "muted" | "primary" | "secondary";
}

export default function DividerBlockRenderer({
  block,
  onChange: _onChange,
  isEditing: _isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as DividerBlockData;
  const {
    style = "solid",
    weight = "normal",
    spacing = "md",
    variant = "default",
  } = data;

  return (
    <hr
      data-slot="divider-block"
      data-style={style}
      data-weight={weight}
      data-spacing={spacing}
      data-variant={variant}
    />
  );
}
