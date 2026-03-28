import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

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

const sizeClasses = {
  sm: "py-12",
  md: "py-20",
  lg: "py-28",
};

const alignClasses = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

export default function HeroBlockRenderer({ block, onChange, isEditing }: BlockRendererProps) {
  const data = block.data as unknown as HeroBlockData;
  const {
    heading = "Headline",
    subheading,
    description,
    primaryCta,
    secondaryCta,
    image,
    layout = "centered",
    align = "center",
    size = "lg",
  } = data;

  const isSplit = layout === "split-right" || layout === "split-left";

  return (
    <div
      className={cn(
        "relative w-full bg-[var(--el-100)]/30 rounded-lg overflow-hidden",
        sizeClasses[size],
      )}
    >
      {image?.src && (
        <div className="absolute inset-0 opacity-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt || ""}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div
        className={cn(
          "relative z-10 px-8",
          isSplit ? "flex items-center gap-8" : "",
          layout === "split-left" && "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-3",
            isSplit ? "flex-1" : "max-w-2xl mx-auto",
            alignClasses[align],
          )}
        >
          {(subheading || isEditing) && (
            <p
              className="text-sm font-medium text-[var(--accent-primary)] uppercase tracking-wider"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== subheading && onChange) onChange({ ...block, data: { ...block.data, subheading: v } });
              }}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >
              {subheading || (isEditing ? "Subheading" : "")}
            </p>
          )}
          <h2
            className="text-3xl font-bold tracking-tight"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              if (v !== heading && onChange) onChange({ ...block, data: { ...block.data, heading: v } });
            }}
            style={isEditing ? { cursor: "text", outline: "none" } : undefined}
          >
            {heading}
          </h2>
          {(description || isEditing) && (
            <p
              className="text-[var(--el-500)] max-w-lg"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== description && onChange) onChange({ ...block, data: { ...block.data, description: v } });
              }}
              style={isEditing ? { cursor: "text", outline: "none" } : undefined}
            >
              {description || (isEditing ? "Description text" : "")}
            </p>
          )}
          {(primaryCta || secondaryCta || isEditing) && (
            <div className="flex gap-3 mt-2">
              {(primaryCta || isEditing) && (
                <span
                  className="inline-flex items-center px-4 py-2 rounded-md bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)] text-sm font-medium"
                  contentEditable={!!isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const v = e.currentTarget.textContent || "";
                    if (onChange) onChange({ ...block, data: { ...block.data, primaryCta: { ...primaryCta, text: v, href: primaryCta?.href || "#" } } });
                  }}
                  style={isEditing ? { cursor: "text", outline: "none" } : undefined}
                >
                  {primaryCta?.text || (isEditing ? "Primary CTA" : "")}
                </span>
              )}
              {(secondaryCta || isEditing) && (
                <span
                  className="inline-flex items-center px-4 py-2 rounded-md border border-[var(--border-default)] text-sm font-medium"
                  contentEditable={!!isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const v = e.currentTarget.textContent || "";
                    if (onChange) onChange({ ...block, data: { ...block.data, secondaryCta: { ...secondaryCta, text: v, href: secondaryCta?.href || "#" } } });
                  }}
                  style={isEditing ? { cursor: "text", outline: "none" } : undefined}
                >
                  {secondaryCta?.text || (isEditing ? "Secondary CTA" : "")}
                </span>
              )}
            </div>
          )}
        </div>
        {isSplit && image?.src && (
          <div className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt || ""}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
