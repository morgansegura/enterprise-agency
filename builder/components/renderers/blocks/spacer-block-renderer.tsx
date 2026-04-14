import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

export default function SpacerBlockRenderer({
  block: _block,
  onChange: _onChange,
  isEditing: _isEditing,
  editorProps,
}: BlockRendererProps) {
  return <div {...editorProps} className={cn(editorProps?.className)} data-slot="spacer-block" />;
}
