"use client";

import * as React from "react";
import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Palette,
  X,
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
      const editorEl = editor.view.dom.closest("[data-block-key]");
      if (!editorEl) return;

      // Position above the selected text, right-aligned to block edge
      const desiredTop = start.top - 44;
      const container = editorEl.parentElement?.parentElement;
      const refRight =
        container?.getBoundingClientRect().right ??
        editorEl.getBoundingClientRect().right;
      setPos({
        top: Math.max(60, desiredTop),
        left: refRight,
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
      style={{ top: pos.top, left: pos.left, transform: "translateX(-100%)" }}
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
        data-active={editor.isActive("underline") || undefined}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
        title="Underline"
      >
        <Underline className="size-3.5" />
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
      <button
        type="button"
        className="text-bubble-btn"
        data-active={editor.isActive("link") || undefined}
        onMouseDown={(e) => {
          e.preventDefault();
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          } else {
            const url = window.prompt("URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }
        }}
        title="Link"
      >
        <Link className="size-3.5" />
      </button>
      <div className="text-bubble-divider" />
      {/* Color picker — select text, pick a color */}
      <div className="text-bubble-color-wrapper">
        <input
          type="color"
          className="text-bubble-color-input"
          value={editor.getAttributes("colorMark")?.color || "#000000"}
          onChange={(e) => {
            const color = e.target.value;
            editor.chain().focus().setMark("colorMark", { color }).run();
          }}
          title="Text color"
        />
        <Palette className="size-3.5 text-bubble-color-icon" />
      </div>
      {editor.isActive("colorMark") && (
        <button
          type="button"
          className="text-bubble-btn"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetMark("colorMark").run();
          }}
          title="Remove color"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
