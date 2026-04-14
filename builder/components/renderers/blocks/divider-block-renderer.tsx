import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

export default function DividerBlockRenderer({
  block: _block,
  onChange: _onChange,
  isEditing: _isEditing,
}: BlockRendererProps) {
  return <hr data-slot="divider-block" />;
}
