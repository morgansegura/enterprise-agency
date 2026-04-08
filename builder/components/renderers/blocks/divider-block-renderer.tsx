import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

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

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  return (
    <hr
      className={elementClass}
      data-slot="divider-block"
      data-style={style}
      data-weight={hasStyle("fontWeight") ? undefined : weight}
      data-spacing={hasStyle("paddingTop") ? undefined : spacing}
      data-variant={variant}
    />
  );
}
