import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface LogoBlockData {
  src: string;
  alt?: string;
  href?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right";
}

const sizeClasses = {
  xs: "h-6",
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-16",
};

const alignClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function LogoBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as LogoBlockData;
  const { src, alt = "Logo", href, size = "md", align = "left" } = data;

  if (!src) {
    return (
      <div className={cn("flex", alignClasses[align])}>
        <div className="bg-muted text-muted-foreground text-sm px-4 py-2 rounded">
          No logo set
        </div>
      </div>
    );
  }

  const logoImage = (
    <img src={src} alt={alt} className={cn("w-auto", sizeClasses[size])} />
  );

  return (
    <div className={cn("flex", alignClasses[align])}>
      {href ? (
        <a href={href} className="inline-block">
          {logoImage}
        </a>
      ) : (
        logoImage
      )}
    </div>
  );
}
