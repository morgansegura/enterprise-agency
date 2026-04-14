import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

export default function DividerBlockRenderer({
  block: _block,
  onChange: _onChange,
  isEditing: _isEditing,
  editorProps,
}: BlockRendererProps) {
  return <hr {...editorProps} className={cn(editorProps?.className)} data-slot="divider-block" />;
}
