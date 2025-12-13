import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface CardBlockData {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  variant?: "default" | "outline" | "ghost";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantClasses = {
  default: "bg-card border border-border shadow-sm",
  outline: "border border-border",
  ghost: "bg-muted/50",
};

const paddingClasses = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function CardBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as CardBlockData;
  const {
    title,
    description,
    image,
    imageAlt = "",
    href,
    variant = "default",
    padding = "md",
  } = data;

  const cardContent = (
    <>
      {image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className={cn(paddingClasses[padding])}>
        {title && (
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </>
  );

  const className = cn(
    "rounded-lg overflow-hidden transition-shadow hover:shadow-md",
    variantClasses[variant],
  );

  if (href) {
    return (
      <a href={href} className={cn(className, "block")}>
        {cardContent}
      </a>
    );
  }

  return <div className={className}>{cardContent}</div>;
}
