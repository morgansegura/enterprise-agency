"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

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

  if (isEditing) {
    return (
      <span
        data-slot="button-block"
        data-variant={variant}
        data-size={size}
        {...(fullWidth ? { "data-full-width": "" } : {})}
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
      data-slot="button-block"
      data-variant={variant}
      data-size={size}
      {...(fullWidth ? { "data-full-width": "" } : {})}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {text}
    </a>
  );
}
