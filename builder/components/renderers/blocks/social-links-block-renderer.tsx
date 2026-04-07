"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksBlockData {
  links: SocialLink[];
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled" | "outline";
  align?: "left" | "center" | "right";
}

const platformEmoji: Record<string, string> = {
  facebook: "\uD83D\uDCD8",
  twitter: "\uD83D\uDC26",
  instagram: "\uD83D\uDCF7",
  linkedin: "\uD83D\uDCBC",
  youtube: "\u25B6\uFE0F",
  tiktok: "\uD83C\uDFB5",
  github: "\uD83D\uDC19",
  dribbble: "\uD83C\uDFC0",
  behance: "\uD83C\uDFA8",
  pinterest: "\uD83D\uDCCC",
};

const sizeClasses = {
  sm: "size-8 text-sm",
  md: "size-10 text-base",
  lg: "size-12 text-lg",
};
const alignClasses = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function SocialLinksBlockRenderer({
  block,
  onChange: _onChange,
  isEditing: _isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as SocialLinksBlockData;
  const {
    links = [],
    size = "md",
    variant = "default",
    align = "center",
  } = data;

  const dataAttributes: Record<string, string | undefined> = {
    "data-slot": "social-links-block",
    "data-size": size,
    "data-variant": variant,
    "data-align": align,
  };

  const filtered = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  return (
    <div
      {...filtered}
      className={cn("flex gap-2 flex-wrap", alignClasses[align])}
    >
      {links.map((link, i) => (
        <a
          key={i}
          data-slot="social-links-block-link"
          data-variant={variant}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center justify-center rounded-full transition-colors",
            sizeClasses[size],
            variant === "filled" &&
              "bg-(--el-800) text-white hover:bg-(--accent-primary)",
            variant === "outline" &&
              "border border-(--border-default) hover:border-(--accent-primary) hover:text-(--accent-primary)",
            variant === "default" &&
              "text-(--el-500) hover:text-(--accent-primary)",
          )}
          title={link.platform}
        >
          {platformEmoji[link.platform.toLowerCase()] || "\uD83D\uDD17"}
        </a>
      ))}
    </div>
  );
}
