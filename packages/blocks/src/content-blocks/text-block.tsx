import { cn } from "@enterprise/tokens";
import { sizeClasses, alignClasses, variantClasses } from "@enterprise/ui";
import type { BlockRendererProps } from "../types";

interface TextBlockData {
  text?: string;
  html?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right" | "justify";
  variant?: "body" | "muted" | "caption";
  maxWidth?: string;
}

export function TextBlock({ block }: BlockRendererProps) {
  const data = block.data as unknown as TextBlockData;
  const {
    text,
    html,
    size = "md",
    align = "left",
    variant = "body",
    maxWidth,
  } = data;

  const hasHtml = Boolean(html);
  const textClasses = cn(
    sizeClasses[size] || sizeClasses.md,
    alignClasses[align] || alignClasses.left,
    variantClasses[variant] || variantClasses.body,
  );

  // Render HTML content if available (from TipTap)
  if (hasHtml) {
    return (
      <div
        style={{
          maxWidth: maxWidth || "none",
          margin: align === "center" ? "0 auto" : undefined,
        }}
      >
        <div
          className={cn("prose prose-sm max-w-none", textClasses)}
          dangerouslySetInnerHTML={{ __html: html! }}
        />
      </div>
    );
  }

  // Fallback to plain text
  return (
    <div
      style={{
        maxWidth: maxWidth || "none",
        margin: align === "center" ? "0 auto" : undefined,
      }}
    >
      <p className={textClasses}>{text}</p>
    </div>
  );
}
