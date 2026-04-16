import type { DividerBlockData } from "@/lib/blocks";
import "./divider-block.css";

type DividerBlockProps = {
  data: DividerBlockData;
};

/**
 * DividerBlock - Renders a horizontal divider/separator
 * Content block (leaf node) - cannot have children
 */
export function DividerBlock({ data: _data }: DividerBlockProps) {
  return <hr data-slot="divider-block" />;
}
