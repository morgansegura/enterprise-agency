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

interface RichTextBlockData {
  html: string;
}

export default function RichTextBlockRenderer({
  block,
  onChange,
  isEditing,
  editorProps,
}: BlockRendererProps) {
  const data = block.data as unknown as RichTextBlockData;
  const { html } = data;

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      Underline,
      ColorMark,
      Placeholder.configure({ placeholder: "Start typing..." }),
    ],
    content: html,
    immediatelyRender: false,
    editable: !!isEditing,
    onUpdate: ({ editor: e }) => {
      if (onChange) {
        onChange({ ...block, data: { ...block.data, html: e.getHTML() } });
      }
    },
  });

  useEffect(() => {
    if (editor) editor.setEditable(!!isEditing);
  }, [editor, isEditing]);

  if (!isEditing || !editor) {
    return (
      <div
        {...editorProps}
        className={cn("rich-text", editorProps?.className)}
        data-slot="rich-text-block"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      {...editorProps}
      className={cn("rich-text", editorProps?.className)}
      data-slot="rich-text-block"
    >
      <EditorContent editor={editor} />
      <TextBubbleMenu editor={editor} />
    </div>
  );
}
