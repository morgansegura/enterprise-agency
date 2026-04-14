"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TipTapLink from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { ColorMark } from "@/lib/editor/tiptap-color-mark";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { useEffect } from "react";
import { TextBubbleMenu } from "@/components/editor/text-bubble-menu/text-bubble-menu";

interface HeadingBlockData {
  text: string;
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function HeadingBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as HeadingBlockData;
  const {
    text,
    level = "h2",
  } = data;

  const Tag = level;

  // TipTap editor for inline editing
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
        horizontalRule: false,
        heading: false,
      }),
      TipTapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-inherit underline" },
      }),
      Underline,
      ColorMark,
      Placeholder.configure({
        placeholder: "Type a heading...",
      }),
    ],
    content: (data as { html?: string }).html || (text ? `<p>${text}</p>` : ""),
    immediatelyRender: false,
    editable: !!isEditing,
    onUpdate: ({ editor: e }) => {
      if (onChange) {
        // Strip tags to get plain text for the heading
        const newText = e.getText();
        // But keep HTML for rich formatting (bold, italic, etc.)
        const newHtml = e.getHTML();
        onChange({
          ...block,
          data: {
            ...block.data,
            text: newText,
            html: newHtml,
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

  // Read-only — render HTML if available (for colored text, bold, etc.)
  const html = (block.data as Record<string, unknown>).html as string | undefined;
  if (!isEditing || !editor) {
    if (html) {
      return (
        <Tag
          className="heading"
          data-slot="heading-block"
          dangerouslySetInnerHTML={{ __html: html.replace(/<\/?p>/g, "") }}
        />
      );
    }
    return (
      <Tag className="heading" data-slot="heading-block">
        {text}
      </Tag>
    );
  }

  // Edit mode — TipTap inline editor styled as the heading
  return (
    <Tag
      className="heading"
      data-slot="heading-block"
      style={{ cursor: "text" }}
    >
      {editor && <TextBubbleMenu editor={editor} />}
      <EditorContent
        editor={editor}
        style={{ outline: "none" }}
      />
    </Tag>
  );
}
