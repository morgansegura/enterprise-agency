import { cn } from "@enterprise/tokens";
import type { BlockRendererProps } from "../types";

interface QuoteBlockData {
  text: string;
  author?: string;
  source?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  variant?: "default" | "bordered" | "highlighted";
}

const quoteSizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const quoteAlignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const quoteVariantClasses = {
  default: "border-l-4 border-primary pl-4",
  bordered: "border border-border rounded-lg p-4",
  highlighted: "bg-muted p-4 rounded-lg",
};

export function QuoteBlock({ block }: BlockRendererProps) {
  const data = block.data as unknown as QuoteBlockData;
  const {
    text,
    author,
    source,
    size = "md",
    align = "left",
    variant = "default",
  } = data;

  return (
    <blockquote
      className={cn(
        "italic",
        quoteSizeClasses[size],
        quoteAlignClasses[align],
        quoteVariantClasses[variant],
      )}
    >
      <p className="mb-2">{text}</p>
      {(author || source) && (
        <footer className="text-sm text-muted-foreground not-italic">
          {author && <span className="font-medium">{author}</span>}
          {author && source && <span> — </span>}
          {source && <cite>{source}</cite>}
        </footer>
      )}
    </blockquote>
  );
}
