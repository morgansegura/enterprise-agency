"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { useEffect } from "react";
import { getElementClass } from "@enterprise/tokens";

interface RichTextBlockData {
  html: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}

export default function RichTextBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as RichTextBlockData;
  const { html, align = "left" } = data;

  const styles = (block as Record<string, unknown>).styles as
    | Record<string, string>
    | undefined;
  const hasStyle = (prop: string) => !!styles?.[prop];
  const elementClass = getElementClass(block._key);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
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

  // Read-only -- static HTML (client site, preview mode)
  if (!isEditing || !editor) {
    return (
      <div
        className={`rich-text ${elementClass}`}
        data-align={hasStyle("textAlign") ? undefined : align}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Edit mode -- TipTap inline editor on canvas
  return (
    <div
      className={`rich-text ${elementClass}`}
      data-align={hasStyle("textAlign") ? undefined : align}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
