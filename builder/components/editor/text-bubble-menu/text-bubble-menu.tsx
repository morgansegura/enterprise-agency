"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Palette,
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

      // Position above the selected text, with safe distance from top of viewport
      const desiredTop = start.top - 44;
      setPos({
        top: Math.max(60, desiredTop),
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
      <div className="text-bubble-divider" />
      {/* Color picker — select text, pick a color */}
      <div className="text-bubble-color-wrapper">
        <input
          type="color"
          className="text-bubble-color-input"
          value={editor.getAttributes("colorMark")?.color || "#000000"}
          onInput={(e) => {
            e.preventDefault();
            const color = (e.target as HTMLInputElement).value;
            editor.chain().focus().setMark("colorMark", { color }).run();
          }}
          title="Text color"
        />
        <Palette className="size-3.5 text-bubble-color-icon" />
      </div>
      <button
        type="button"
        className="text-bubble-btn"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.chain().focus().unsetMark("colorMark").run();
        }}
        title="Remove color"
      >
        ×
      </button>
    </div>
  );
}
