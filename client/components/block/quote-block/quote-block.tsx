import type { QuoteBlockData } from "@/lib/blocks";
import Image from "next/image";
import "./quote-block.css";

type QuoteBlockProps = {
  data: QuoteBlockData;
};

/**
 * QuoteBlock - Renders blockquotes/testimonials
 * Content block (leaf node) - cannot have children
 */
export function QuoteBlock({ data }: QuoteBlockProps) {
  const { quote, author, role, avatar, variant = "default" } = data;

  return (
    <blockquote data-slot="quote-block" data-variant={variant}>
      <p data-slot="quote-block-text">{quote}</p>
      {author || avatar ? (
        <footer data-slot="quote-block-footer">
          {avatar ? (
            <Image
              data-slot="quote-block-avatar"
              src={avatar.url}
              alt={avatar.alt || author || ""}
              width={avatar.width || 48}
              height={avatar.height || 48}
            />
          ) : null}
          <div data-slot="quote-block-citation">
            {author ? (
              <cite data-slot="quote-block-author">{author}</cite>
            ) : null}
            {role ? <span data-slot="quote-block-role">{role}</span> : null}
          </div>
        </footer>
      ) : null}
    </blockquote>
  );
}
