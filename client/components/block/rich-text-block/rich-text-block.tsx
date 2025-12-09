import type { RichTextBlockData } from "@/lib/blocks";

type RichTextBlockProps = {
  data: RichTextBlockData;
};

/**
 * RichTextBlock - TipTap HTML content renderer
 * Content block (leaf node) - cannot have children
 * Renders rich HTML with typography styles from design tokens
 */
export function RichTextBlock({ data }: RichTextBlockProps) {
  const { html, align = "left" } = data;

  return (
    <div
      className="rich-text"
      data-align={align}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
