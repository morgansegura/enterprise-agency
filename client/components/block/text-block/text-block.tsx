import type { TextBlockData } from "@/lib/blocks";
import "./text-block.css";

type TextBlockProps = {
  data: TextBlockData;
};

/**
 * TextBlock - Renders paragraph text with formatting options
 * Content block (leaf node) - cannot have children
 * Supports rich text/markdown through content prop
 */
export function TextBlock({ data }: TextBlockProps) {
  const { content, size = "base", align = "left", variant = "default" } = data;

  return (
    <p
      data-slot="text-block"
      data-size={size}
      data-align={align}
      data-variant={variant}
    >
      {content}
    </p>
  );
}
