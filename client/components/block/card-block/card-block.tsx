import type { CardBlockData } from "@/lib/blocks";
import "./card-block.css";

type CardBlockProps = {
  data: CardBlockData;
};

/**
 * CardBlock - Renders cards with optional image, title, description, footer, and link
 * Content block (leaf node) - cannot have children
 */
export function CardBlock({ data }: CardBlockProps) {
  const {
    image,
    title,
    description,
    footer,
    link,
    variant = "default",
    padding = "md",
  } = data;

  const content = (
    <div
      data-slot="card-block"
      data-variant={variant}
      data-padding={padding}
    >
      {image?.src ? (
        <div data-slot="card-block-image">
          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic CMS images */}
          <img
            src={image.src}
            alt={image.alt}
            data-slot="card-block-img"
          />
        </div>
      ) : null}

      <div data-slot="card-block-body">
        <h3 data-slot="card-block-title">{title}</h3>

        {description ? (
          <p data-slot="card-block-description">{description}</p>
        ) : null}

        {footer ? (
          <p data-slot="card-block-footer">{footer}</p>
        ) : null}

        {link?.href && !linkWrapsCard(link) ? (
          <a
            href={link.href}
            data-slot="card-block-link"
            {...(link.openInNewTab
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {link.text || "Learn more \u2192"}
          </a>
        ) : null}
      </div>
    </div>
  );

  if (link?.href && linkWrapsCard(link)) {
    return (
      <a
        href={link.href}
        data-slot="card-block-wrapper"
        {...(link.openInNewTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return content;
}

/**
 * If the link has no display text, wrap the entire card as a clickable link.
 * If the link has display text, render it as an inline link inside the card body.
 */
function linkWrapsCard(link: { text?: string }): boolean {
  return !link.text;
}
