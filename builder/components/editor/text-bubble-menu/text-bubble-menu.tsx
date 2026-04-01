"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
} from "lucide-react";
import "./text-bubble-menu.css";

interface TextBubbleMenuProps {
  editor: Editor;
}

/**
 * TextBubbleMenu — custom floating toolbar that appears when text is selected.
 * Uses native selection API to detect and position the menu.
 */
export function TextBubbleMenu({ editor }: TextBubbleMenuProps) {
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    const update = () => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        setVisible(false);
        return;
      }

      // Get position from TipTap's view
      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);
      const editorEl = editor.view.dom.closest("[data-block-key]");
      if (!editorEl) return;

      setPos({
        top: start.top - 40,
        left: (start.left + end.left) / 2,
      });
      setVisible(true);
    };

    editor.on("selectionUpdate", update);
    editor.on("blur", () => setVisible(false));

    return () => {
      editor.off("selectionUpdate", update);
    };
  }, [editor]);

  if (!visible) return null;

  return (
    <div
      className="text-bubble-menu"
      style={{ top: pos.top, left: pos.left, transform: "translateX(-50%)" }}
    >
      <button
        type="button"
        className="text-bubble-btn"
        data-active={editor.isActive("bold") || undefined}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
        title="Bold"
      >
        <Bold className="size-3.5" />
      </button>
      <button
        type="button"
        className="text-bubble-btn"
        data-active={editor.isActive("italic") || undefined}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
        title="Italic"
      >
        <Italic className="size-3.5" />
      </button>
      <button
        type="button"
        className="text-bubble-btn"
        data-active={editor.isActive("strike") || undefined}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }}
        title="Strikethrough"
      >
        <Strikethrough className="size-3.5" />
      </button>
    </div>
  );
}
