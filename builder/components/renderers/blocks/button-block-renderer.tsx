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
    variant,
    size,
    fullWidth = false,
    openInNewTab = false,
  } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  if (isEditing) {
    return (
      <span
        data-slot="button-block"
        {...(variant ? { "data-variant": variant } : {})}
        {...(size && !hasStyle("fontSize") ? { "data-size": size } : {})}
        {...(fullWidth ? { "data-full-width": "" } : {})}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newText = e.currentTarget.textContent || "";
          if (newText !== text && onChange) {
            onChange({ ...block, data: { ...block.data, text: newText } });
          }
        }}
        style={{ outline: "none" }}
      >
        {text}
      </span>
    );
  }

  return (
    <a
      href={href}
      data-slot="button-block"
      {...(variant ? { "data-variant": variant } : {})}
      {...(size && !hasStyle("fontSize") ? { "data-size": size } : {})}
      {...(fullWidth ? { "data-full-width": "" } : {})}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {text}
    </a>
  );
}
