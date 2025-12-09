"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import type { Block } from "@/lib/editor/types";
import { blocksToTiptap, tiptapToBlocks } from "@/lib/editor/utils";
import "./block-editor.css";

type BlockEditorProps = {
  /**
   * Initial content as blocks
   */
  initialBlocks?: Block[];
  /**
   * Callback when content changes
   */
  onChange?: (blocks: Block[]) => void;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether the editor is editable
   */
  editable?: boolean;
  /**
   * Additional CSS class
   */
  className?: string;
};

export function BlockEditor({
  initialBlocks = [],
  onChange,
  placeholder = "Start typing...",
  editable = true,
  className,
}: BlockEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link",
        },
      }),
    ],
    content: blocksToTiptap(initialBlocks),
    editable,
    editorProps: {
      attributes: {
        class: "block-editor-content",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        const json = editor.getJSON();
        const blocks = tiptapToBlocks(json);
        onChange(blocks);
      }
    },
  });

  // Update editor content when initialBlocks changes
  useEffect(() => {
    if (editor && initialBlocks.length > 0) {
      const currentContent = editor.getJSON();
      const newContent = blocksToTiptap(initialBlocks);

      // Only update if content has actually changed
      if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
        editor.commands.setContent(newContent);
      }
    }
  }, [editor, initialBlocks]);

  if (!editor) {
    return (
      <div data-slot="editor-loading">
        <p>Loading editor...</p>
      </div>
    );
  }

  return (
    <div data-slot="block-editor" className={className}>
      <EditorContent editor={editor} />
    </div>
  );
}
