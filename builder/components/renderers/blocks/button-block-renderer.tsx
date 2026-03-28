"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface ButtonBlockData {
  text: string;
  href?: string;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  fullWidth?: boolean;
  openInNewTab?: boolean;
}

const variantClasses = {
  default: "bg-[var(--accent-primary)] text-[var(--accent-primary-foreground)]",
  secondary: "bg-[var(--el-100)] text-[var(--el-800)]",
  outline: "border border-[var(--el-150)] bg-[var(--el-0)] text-[var(--el-800)]",
  ghost: "text-[var(--el-600)]",
  link: "text-[var(--accent-primary)] underline-offset-4 underline",
  destructive: "bg-[var(--status-error)] text-white",
};

const sizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export default function ButtonBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as ButtonBlockData;
  const {
    text,
    href = "#",
    variant = "default",
    size = "default",
    fullWidth = false,
    openInNewTab = false,
  } = data;

  const className = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
  );

  if (isEditing) {
    return (
      <span
        className={className}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newText = e.currentTarget.textContent || "";
          if (newText !== text && onChange) {
            onChange({ ...block, data: { ...block.data, text: newText } });
          }
        }}
        style={{ cursor: "text", outline: "none" }}
      >
        {text}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
    >
      {text}
    </a>
  );
}
