import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface SpacerBlockData {
  height?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export default function SpacerBlockRenderer({
  block,
  onChange: _onChange,
  isEditing: _isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as SpacerBlockData;
  const { height = "md" } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  return (
    <div
      className={elementClass}
      data-slot="spacer-block"
      data-height={hasStyle("height") ? undefined : height}
    />
  );
}
