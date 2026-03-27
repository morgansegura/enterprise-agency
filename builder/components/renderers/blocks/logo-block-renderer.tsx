/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface LogoBlockData {
  src: string;
  alt: string;
  href?: string;
  size: "sm" | "md" | "lg" | "xl";
  align: "left" | "center" | "right";
  openInNewTab?: boolean;
}

const sizeClasses = {
  sm: "h-8",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
};

const alignClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function LogoBlockRenderer({ block }: BlockRendererProps) {
  const data = block.data as unknown as LogoBlockData;
  const {
    src,
    alt = "Logo",
    href,
    size = "md",
    align = "left",
    openInNewTab,
  } = data;

  if (!src) {
    return (
      <div className={cn("flex", alignClasses[align])}>
        <div className="bg-[var(--el-100)] text-[var(--el-500)] text-sm px-4 py-2 rounded">
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
        <a
          href={href}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          className="inline-block"
        >
          {logoImage}
        </a>
      ) : (
        logoImage
      )}
    </div>
  );
}
