"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { getElementClass } from "@enterprise/tokens";

interface CtaBlockData {
  heading: string;
  description?: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  variant?: "default" | "highlighted" | "minimal";
  align?: "left" | "center";
}

export default function CtaBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as CtaBlockData;
  const {
    heading,
    description,
    primaryCta,
    secondaryCta,
    variant = "default",
    align = "center",
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const update = (field: string, value: unknown) => {
    if (onChange)
      onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  return (
    <section
      className={elementClass}
      data-slot="cta-block"
      data-variant={variant}
      data-align={hasStyle("textAlign") ? undefined : align}
    >
      <div data-slot="cta-block-content">
        <h2
          data-slot="cta-block-heading"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            if (v !== heading) update("heading", v);
          }}
          style={
            isEditing ? { cursor: "text", outline: "none" } : undefined
          }
        >
          {heading}
        </h2>

        {description || isEditing ? (
          <p
            data-slot="cta-block-description"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              if (v !== description) update("description", v);
            }}
            style={
              isEditing ? { cursor: "text", outline: "none" } : undefined
            }
          >
            {description || (isEditing ? "Description" : "")}
          </p>
        ) : null}
      </div>

      <div data-slot="cta-block-actions">
        <span
          data-slot="cta-block-primary-cta"
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            update("primaryCta", {
              ...primaryCta,
              text: v,
              href: primaryCta?.href || "#",
            });
          }}
          style={
            isEditing ? { cursor: "text", outline: "none" } : undefined
          }
        >
          {primaryCta?.text || "Get Started"}
        </span>

        {secondaryCta || isEditing ? (
          <span
            data-slot="cta-block-secondary-cta"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              update("secondaryCta", {
                ...secondaryCta,
                text: v,
                href: secondaryCta?.href || "#",
              });
            }}
            style={
              isEditing ? { cursor: "text", outline: "none" } : undefined
            }
          >
            {secondaryCta?.text || (isEditing ? "Learn More" : "")}
          </span>
        ) : null}
      </div>
    </section>
  );
}
