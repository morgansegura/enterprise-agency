import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface TextBlockData {
  text?: string;
  html?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right" | "justify";
  variant?: "body" | "muted" | "caption";
  maxWidth?: string;
}

// Match editor's TextBlockEditor maps exactly
const sizeClasses: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const variantClasses: Record<string, string> = {
  body: "text-foreground",
  muted: "text-muted-foreground",
  caption: "text-muted-foreground text-sm",
};

export default function TextBlockRenderer({ block }: BlockRendererProps) {
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
