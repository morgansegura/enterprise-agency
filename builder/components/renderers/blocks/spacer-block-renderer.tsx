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
  const { height = "md" } = data;

  return <div data-slot="spacer-block" data-height={height} />;
}
