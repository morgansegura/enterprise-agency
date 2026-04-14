"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { ColorMark } from "@/lib/editor/tiptap-color-mark";
import { TextBubbleMenu } from "@/components/editor/text-bubble-menu/text-bubble-menu";
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface TextBlockData {
  text?: string;
  html?: string;
  content?: string;
}

export default function TextBlockRenderer({
  block,
  onChange,
  isEditing,
  editorProps,
}: BlockRendererProps) {
  const data = block.data as unknown as TextBlockData;
  const { text, html } = data;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-(--accent-primary) underline",
        },
      }),
      Underline,
      ColorMark,
      Placeholder.configure({ placeholder: "Type some text..." }),
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
    if (editor) editor.setEditable(!!isEditing);
  }, [editor, isEditing]);

  // Read-only
  if (!isEditing || !editor) {
    if (html) {
      return (
        <div
          {...editorProps}
          className={cn("text text-block prose prose-sm max-w-none", editorProps?.className)}
          data-slot="text-block"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    return (
      <p
        {...editorProps}
        className={cn("text", editorProps?.className)}
        data-slot="text-block"
      >
        {text || data.content}
      </p>
    );
  }

  // Edit mode — TipTap
  return (
    <div
      {...editorProps}
      className={cn("text text-block prose prose-sm max-w-none", editorProps?.className)}
      data-slot="text-block"
      style={{ cursor: "text" }}
    >
      <EditorContent editor={editor} style={{ outline: "none" }} />
      <TextBubbleMenu editor={editor} />
    </div>
  );
}
