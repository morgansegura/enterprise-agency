import type { QuoteBlockData } from "@/lib/blocks";
import "./quote-block.css";

type QuoteBlockProps = {
  data: QuoteBlockData;
};

/**
 * QuoteBlock - Renders blockquotes/testimonials
 * Content block (leaf node) - cannot have children
 */
export function QuoteBlock({ data }: QuoteBlockProps) {
  const {
    text,
    author,
    title,
    size = "md",
    align = "left",
    variant = "default",
  } = data;

  return (
    <blockquote
      data-slot="quote-block"
      data-variant={variant}
      data-size={size}
      data-align={align}
    >
      <p data-slot="quote-block-text">{text}</p>
      {author || title ? (
        <footer data-slot="quote-block-footer">
          {author ? (
            <cite data-slot="quote-block-author">{author}</cite>
          ) : null}
          {title ? (
            <span data-slot="quote-block-title">{title}</span>
          ) : null}
        </footer>
      ) : null}
    </blockquote>
  );
}
