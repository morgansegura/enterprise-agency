import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface HeroBlockData {
  heading: string;
  subheading?: string;
  description?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  image?: { src: string; alt: string };
  layout?: "centered" | "split-right" | "split-left";
  overlay?: boolean;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
}

export default function HeroBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as HeroBlockData;
  const {
    heading = "Headline",
    subheading,
    description,
    primaryCta,
    secondaryCta,
    image,
    layout = "centered",
    overlay = false,
    align = "center",
    size = "lg",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  return (
    <section
      className={elementClass}
      data-slot="hero-block"
      data-layout={layout}
      data-align={hasStyle("textAlign") ? undefined : align}
      data-size={hasStyle("fontSize") ? undefined : size}
      data-overlay={overlay || undefined}
    >
      {image?.src ? (
        <div data-slot="hero-block-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt || ""}
            data-slot="hero-block-bg-img"
          />
          {overlay ? <div data-slot="hero-block-overlay" /> : null}
        </div>
      ) : null}

      <div data-slot="hero-block-content">
        {subheading || isEditing ? (
          <p
            data-slot="hero-block-subheading"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              if (v !== subheading && onChange)
                onChange({
                  ...block,
                  data: { ...block.data, subheading: v },
                });
            }}
            style={
              isEditing ? { cursor: "text", outline: "none" } : undefined
            }
          >
            {subheading || (isEditing ? "Subheading" : "")}
          </p>
        ) : null}

        <h1
          data-slot="hero-block-heading"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            if (v !== heading && onChange)
              onChange({
                ...block,
                data: { ...block.data, heading: v },
              });
          }}
          style={
            isEditing ? { cursor: "text", outline: "none" } : undefined
          }
        >
          {heading}
        </h1>

        {description || isEditing ? (
          <p
            data-slot="hero-block-description"
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
            {description || (isEditing ? "Description text" : "")}
          </p>
        ) : null}

        {primaryCta || secondaryCta || isEditing ? (
          <div data-slot="hero-block-actions">
            {primaryCta || isEditing ? (
              <span
                data-slot="hero-block-primary-cta"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (onChange)
                    onChange({
                      ...block,
                      data: {
                        ...block.data,
                        primaryCta: {
                          ...primaryCta,
                          text: v,
                          href: primaryCta?.href || "#",
                        },
                      },
                    });
                }}
                style={
                  isEditing
                    ? { cursor: "text", outline: "none" }
                    : undefined
                }
              >
                {primaryCta?.text || (isEditing ? "Primary CTA" : "")}
              </span>
            ) : null}

            {secondaryCta || isEditing ? (
              <span
                data-slot="hero-block-secondary-cta"
                contentEditable={!!isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const v = e.currentTarget.textContent || "";
                  if (onChange)
                    onChange({
                      ...block,
                      data: {
                        ...block.data,
                        secondaryCta: {
                          ...secondaryCta,
                          text: v,
                          href: secondaryCta?.href || "#",
                        },
                      },
                    });
                }}
                style={
                  isEditing
                    ? { cursor: "text", outline: "none" }
                    : undefined
                }
              >
                {secondaryCta?.text || (isEditing ? "Secondary CTA" : "")}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
