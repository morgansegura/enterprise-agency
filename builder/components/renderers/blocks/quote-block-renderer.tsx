import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface QuoteBlockData {
  text: string;
  author?: string;
  source?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
  variant?: "default" | "bordered" | "highlighted";
}

const sizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const variantClasses = {
  default: "border-l-4 border-primary pl-4",
  bordered: "border border-border rounded-lg p-4",
  highlighted: "bg-muted p-4 rounded-lg",
};

export default function QuoteBlockRenderer({ block }: BlockRendererProps) {
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
        sizeClasses[size],
        alignClasses[align],
        variantClasses[variant],
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
