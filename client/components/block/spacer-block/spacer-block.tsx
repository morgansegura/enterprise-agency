import type { SpacerBlockData } from "@/lib/blocks";
import "./spacer-block.css";

type SpacerBlockProps = {
  data: SpacerBlockData;
};

/**
 * SpacerBlock - Renders vertical spacing
 * Content block (leaf node) - cannot have children
 */
export function SpacerBlock({ data: _data }: SpacerBlockProps) {
  return <div data-slot="spacer-block" />;
}
