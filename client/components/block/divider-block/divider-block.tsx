import type { DividerBlockData } from "@/lib/blocks";
import "./divider-block.css";

type DividerBlockProps = {
  data: DividerBlockData;
};

/**
 * DividerBlock - Renders a horizontal divider/separator
 * Content block (leaf node) - cannot have children
 */
export function DividerBlock({ data }: DividerBlockProps) {
  const {
    style = "solid",
    weight = "normal",
    spacing = "md",
    variant = "default",
  } = data;

  return (
    <hr
      data-slot="divider-block"
      data-style={style}
      data-weight={weight}
      data-spacing={spacing}
      data-variant={variant}
    />
  );
}
