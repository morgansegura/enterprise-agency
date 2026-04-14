"use client";

import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

interface ButtonBlockData {
  text: string;
  href?: string;
  fullWidth?: boolean;
  openInNewTab?: boolean;
}

export default function ButtonBlockRenderer({
  block,
  onChange,
  isEditing,
  editorProps,
}: BlockRendererProps) {
  const data = block.data as unknown as ButtonBlockData;
  const {
    text,
    href = "#",
    fullWidth = false,
    openInNewTab = false,
  } = data;

  if (isEditing) {
    return (
      <span
        {...editorProps}
        className={cn(editorProps?.className)}
        data-slot="button-block"
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
      {...editorProps}
      className={cn(editorProps?.className)}
      href={href}
      data-slot="button-block"
      {...(fullWidth ? { "data-full-width": "" } : {})}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {text}
    </a>
  );
}
