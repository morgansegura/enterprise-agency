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
      {...(style ? { "data-style": style } : {})}
      {...(weight && !hasStyle("fontWeight") ? { "data-weight": weight } : {})}
      {...(spacing && !hasStyle("paddingTop") ? { "data-spacing": spacing } : {})}
      {...(variant ? { "data-variant": variant } : {})}
    />
  );
}
