/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface CardBlockData {
  title?: string;
  description?: string;
  footer?: string;
  image?: { src?: string; alt?: string } | string;
  imageAlt?: string;
  link?: { href?: string; text?: string; openInNewTab?: boolean };
  href?: string;
  variant?: "default" | "outline" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
}

export default function CardBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as CardBlockData;
  const {
    title,
    description,
    footer,
    image,
    imageAlt = "",
    link,
    href,
    variant = "default",
    padding = "md",
  } = data;

  // Normalize image data (support both old string format and new object)
  const imageSrc =
    typeof image === "string" ? image : image?.src;
  const imgAlt =
    typeof image === "string" ? imageAlt : image?.alt || imageAlt;

  // Normalize link data (support both old href string and new link object)
  const linkHref = link?.href || href;
  const linkText = link?.text;
  const linkWraps = linkHref && !linkText;

  const content = (
    <div
      data-slot="card-block"
      data-variant={variant}
      data-padding={padding}
    >
      {imageSrc ? (
        <div data-slot="card-block-image">
          <img
            src={imageSrc}
            alt={imgAlt}
            data-slot="card-block-img"
          />
        </div>
      ) : null}

      <div data-slot="card-block-body">
        {(title || isEditing) ? (
          <h3
            data-slot="card-block-title"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              if (v !== title && onChange)
                onChange({
                  ...block,
                  data: { ...block.data, title: v },
                });
            }}
            style={
              isEditing ? { cursor: "text", outline: "none" } : undefined
            }
          >
            {title || (isEditing ? "Card title" : "")}
          </h3>
        ) : null}

        {(description || isEditing) ? (
          <p
            data-slot="card-block-description"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              if (v !== description && onChange)
                onChange({
                  ...block,
                  data: { ...block.data, description: v },
                });
            }}
            style={
              isEditing ? { cursor: "text", outline: "none" } : undefined
            }
          >
            {description || (isEditing ? "Card description" : "")}
          </p>
        ) : null}

        {footer ? (
          <p data-slot="card-block-footer">{footer}</p>
        ) : null}

        {linkHref && !linkWraps ? (
          <a
            href={linkHref}
            data-slot="card-block-link"
            {...(link?.openInNewTab
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {linkText || "Learn more \u2192"}
          </a>
        ) : null}
      </div>
    </div>
  );

  if (linkWraps) {
    return (
      <a
        href={linkHref}
        data-slot="card-block-wrapper"
        {...(link?.openInNewTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {content}
      </a>
    );
  }

  return content;
}
