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
  facebook: "📘",
  twitter: "🐦",
  instagram: "📷",
  linkedin: "💼",
  youtube: "▶️",
  tiktok: "🎵",
  github: "🐙",
  dribbble: "🏀",
  behance: "🎨",
  pinterest: "📌",
};

const sizeClasses = { sm: "size-8 text-sm", md: "size-10 text-base", lg: "size-12 text-lg" };
const alignClasses = { left: "justify-start", center: "justify-center", right: "justify-end" };

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

  return (
    <div className={cn("flex gap-2 flex-wrap", alignClasses[align])}>
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center justify-center rounded-full transition-colors",
            sizeClasses[size],
            variant === "filled" && "bg-[var(--el-800)] text-white hover:bg-[var(--accent-primary)]",
            variant === "outline" && "border border-[var(--border-default)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]",
            variant === "default" && "text-[var(--el-500)] hover:text-[var(--accent-primary)]",
          )}
          title={link.platform}
        >
          {platformEmoji[link.platform.toLowerCase()] || "🔗"}
        </a>
      ))}
    </div>
  );
}
