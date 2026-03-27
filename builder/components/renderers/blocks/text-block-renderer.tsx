"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface TextBlockData {
  text?: string;
  html?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "left" | "center" | "right" | "justify";
  variant?: "body" | "muted" | "caption";
  maxWidth?: string;
}

const sizeClasses: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const variantClasses: Record<string, string> = {
  body: "text-[var(--el-800)]",
  muted: "text-[var(--el-500)]",
  caption: "text-[var(--el-500)] text-sm",
};

export default function TextBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as TextBlockData;
  const {
    text,
    html,
    size = "md",
    align = "left",
    variant = "body",
    maxWidth,
  } = data;

  const textClasses = cn(
    sizeClasses[size] || sizeClasses.md,
    alignClasses[align] || alignClasses.left,
    variantClasses[variant] || variantClasses.body,
  );

  const wrapperStyle = {
    maxWidth: maxWidth || "none",
    margin: align === "center" ? ("0 auto" as const) : undefined,
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[var(--accent-primary)] underline",
        },
      }),
      Placeholder.configure({
        placeholder: "Type some text...",
      }),
    ],
    content: html || (text ? `<p>${text}</p>` : ""),
    immediatelyRender: false,
    editable: !!isEditing,
    onUpdate: ({ editor: e }) => {
      if (onChange) {
        onChange({
          ...block,
          data: {
            ...block.data,
            text: e.getText(),
            html: e.getHTML(),
          },
        });
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!!isEditing);
    }
  }, [editor, isEditing]);

  // Read-only
  if (!isEditing || !editor) {
    if (html) {
      return (
        <div style={wrapperStyle}>
          <div
            className={cn("prose prose-sm max-w-none", textClasses)}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      );
    }
    return (
      <div style={wrapperStyle}>
        <p className={textClasses}>{text}</p>
      </div>
    );
  }

  // Edit mode — TipTap
  return (
    <div style={wrapperStyle}>
      <div className={cn("prose prose-sm max-w-none", textClasses)}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
