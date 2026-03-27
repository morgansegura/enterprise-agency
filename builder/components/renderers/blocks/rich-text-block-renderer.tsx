"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface RichTextBlockData {
  html: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}

const sizeClasses = {
  sm: "prose-sm",
  md: "prose-base",
  lg: "prose-lg",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function RichTextBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as RichTextBlockData;
  const { html, size = "md", align = "left" } = data;

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[var(--accent-primary)] underline",
        },
      }),
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
    ],
    content: html,
    immediatelyRender: false,
    editable: !!isEditing,
    onUpdate: ({ editor: e }) => {
      if (onChange) {
        onChange({
          ...block,
          data: { ...block.data, html: e.getHTML() },
        });
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!!isEditing);
    }
  }, [editor, isEditing]);

  // Read-only — static HTML (client site, preview mode)
  if (!isEditing || !editor) {
    return (
      <div
        className={cn(
          "prose prose-neutral dark:prose-invert max-w-none",
          sizeClasses[size],
          alignClasses[align],
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Edit mode — TipTap inline editor on canvas
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        sizeClasses[size],
        alignClasses[align],
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
