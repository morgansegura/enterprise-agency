import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface SpacerBlockData {
  height?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export default function SpacerBlockRenderer({
  block,
  onChange: _onChange,
  isEditing: _isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as SpacerBlockData;
  const { height } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  return (
    <div
      data-slot="spacer-block"
      data-height={hasStyle("height") ? undefined : height}
    />
  );
}
