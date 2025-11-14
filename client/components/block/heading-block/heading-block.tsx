import type { HeadingBlockData } from "@/lib/blocks";
import "./heading-block.css";

type HeadingBlockProps = {
  data: HeadingBlockData;
};

/**
 * HeadingBlock - Renders text headings with semantic HTML levels
 * Content block (leaf node) - cannot have children
 */
export function HeadingBlock({ data }: HeadingBlockProps) {
  const { text, level = "h2", size, align = "left", weight } = data;

  const HeadingTag = level;

  return (
    <HeadingTag
      data-slot="heading-block"
      data-level={level}
      data-size={size}
      data-align={align}
      data-weight={weight}
    >
      {text}
    </HeadingTag>
  );
}
