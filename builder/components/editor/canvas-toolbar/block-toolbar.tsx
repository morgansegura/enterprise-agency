"use client";

import * as React from "react";
import {
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
  GripVertical,
} from "lucide-react";
import "./block-toolbar.css";

interface BlockToolbarProps {
  blockKey: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

/**
 * BlockToolbar — floating toolbar above selected element on canvas
 * Positioned absolutely based on the element's DOM position
 */
export function BlockToolbar({
  blockKey,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp = true,
  canMoveDown = true,
}: BlockToolbarProps) {
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [hasTextSelection, setHasTextSelection] = React.useState(false);

  React.useEffect(() => {
    const el = document.querySelector(
      `[data-block-key="${blockKey}"]`,
    );
    if (!el) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const rect = el.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const toolbarWidth = 36;

      // Position vertically centered on the block
      // Prefer right side; fall back to left side if not enough space
      const rightSpace = viewportWidth - rect.right;
      const useRight = rightSpace >= toolbarWidth + 16;
      const left = useRight ? rect.right + 8 : Math.max(8, rect.left - toolbarWidth - 8);

      setPosition({
        top: rect.top + rect.height / 2,
        left,
        width: rect.width,
      });
    };

    updatePosition();

    // Update on scroll/resize
    const canvas = el.closest(".page-editor-canvas");
    canvas?.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      canvas?.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [blockKey]);

  // Hide block toolbar when text is being actively selected/edited
  React.useEffect(() => {
    const checkSelection = () => {
      const sel = window.getSelection();
      setHasTextSelection(!!sel && !sel.isCollapsed && sel.toString().length > 0);
    };
    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
  }, []);

  if (!position || hasTextSelection) return null;

  return (
    <div
      className="block-toolbar"
      style={{
        top: Math.max(60, position.top),
        left: position.left,
        transform: "translateY(-50%)",
      }}
    >
      <button className="block-toolbar-btn block-toolbar-grip" title="Drag to move">
        <GripVertical className="size-3.5" />
      </button>
      <div className="block-toolbar-divider" />
      <button
        className="block-toolbar-btn"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        title="Move up"
      >
        <ChevronUp className="size-3.5" />
      </button>
      <button
        className="block-toolbar-btn"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        title="Move down"
      >
        <ChevronDown className="size-3.5" />
      </button>
      <div className="block-toolbar-divider" />
      <button
        className="block-toolbar-btn"
        onClick={onDuplicate}
        title="Duplicate"
      >
        <Copy className="size-3.5" />
      </button>
      <button
        className="block-toolbar-btn block-toolbar-delete"
        onClick={onDelete}
        title="Delete"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}
