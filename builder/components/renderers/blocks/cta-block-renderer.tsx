"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

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

  const update = (field: string, value: unknown) => {
    if (onChange) onChange({ ...block, data: { ...block.data, [field]: value } });
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg px-8 py-10",
        variant === "highlighted"
          ? "bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)]"
          : variant === "minimal"
            ? "border border-[var(--border-default)]"
            : "bg-[var(--el-100)]/50",
        align === "center" ? "text-center" : "text-left",
      )}
    >
      <h3
        className="text-xl font-bold"
        contentEditable={!!isEditing}
        suppressContentEditableWarning
        onBlur={(e) => {
          const v = e.currentTarget.textContent || "";
          if (v !== heading) update("heading", v);
        }}
        style={isEditing ? { cursor: "text", outline: "none" } : undefined}
      >
        {heading}
      </h3>
      {(description || isEditing) && (
        <p
          className={cn(
            "mt-2 text-sm",
            variant === "highlighted"
              ? "opacity-80"
              : "text-[var(--el-500)]",
          )}
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            if (v !== description) update("description", v);
          }}
          style={isEditing ? { cursor: "text", outline: "none" } : undefined}
        >
          {description || (isEditing ? "Description" : "")}
        </p>
      )}
      <div
        className={cn(
          "flex gap-3 mt-4",
          align === "center" ? "justify-center" : "",
        )}
      >
        <span
          className={cn(
            "inline-flex items-center px-4 py-2 rounded-md text-sm font-medium",
            variant === "highlighted"
              ? "bg-[var(--el-0)] text-[var(--el-800)]"
              : "bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)]",
          )}
          contentEditable={!!isEditing}
          suppressContentEditableWarning
          onBlur={(e) => {
            const v = e.currentTarget.textContent || "";
            update("primaryCta", { ...primaryCta, text: v, href: primaryCta?.href || "#" });
          }}
          style={isEditing ? { cursor: "text", outline: "none" } : undefined}
        >
          {primaryCta?.text || "Get Started"}
        </span>
        {(secondaryCta || isEditing) && (
          <span
            className="inline-flex items-center px-4 py-2 rounded-md border border-[var(--border-default)] text-sm font-medium"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              update("secondaryCta", { ...secondaryCta, text: v, href: secondaryCta?.href || "#" });
            }}
            style={isEditing ? { cursor: "text", outline: "none" } : undefined}
          >
            {secondaryCta?.text || (isEditing ? "Learn More" : "")}
          </span>
        )}
      </div>
    </div>
  );
}
