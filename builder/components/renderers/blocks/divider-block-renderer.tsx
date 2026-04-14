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
    style,
    weight,
    spacing,
    variant,
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  return (
    <hr
      data-slot="divider-block"
      data-style={style}
      data-weight={hasStyle("fontWeight") ? undefined : weight}
      data-spacing={hasStyle("paddingTop") ? undefined : spacing}
      data-variant={variant}
    />
  );
}
