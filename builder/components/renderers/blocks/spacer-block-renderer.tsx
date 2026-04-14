import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

export default function SpacerBlockRenderer({
  block: _block,
  onChange: _onChange,
  isEditing: _isEditing,
}: BlockRendererProps) {
  return <div data-slot="spacer-block" />;
}
