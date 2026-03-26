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

export default function HeroBlockRenderer({ block }: BlockRendererProps) {
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
        "relative w-full bg-muted/30 rounded-lg overflow-hidden",
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
          {subheading && (
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              {subheading}
            </p>
          )}
          <h2 className="text-3xl font-bold tracking-tight">{heading}</h2>
          {description && (
            <p className="text-muted-foreground max-w-lg">{description}</p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="flex gap-3 mt-2">
              {primaryCta && (
                <span className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
                  {primaryCta.text}
                </span>
              )}
              {secondaryCta && (
                <span className="inline-flex items-center px-4 py-2 rounded-md border border-border text-sm font-medium">
                  {secondaryCta.text}
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
