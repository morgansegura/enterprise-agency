"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { BlockEditorRenderer } from "./block-editor-renderer";
import type { Block } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";

interface SortableBlockItemProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
  tenantId?: string;
}

/**
 * Sortable Block Item
 *
 * Wraps BlockEditorRenderer with drag-and-drop functionality.
 * Displays a drag handle on hover and provides visual feedback during dragging.
 *
 * Features:
 * - Hover-reveal drag handle
 * - Smooth drag animations
 * - Visual feedback during dragging (opacity change)
 * - Accessibility support (keyboard navigation)
 *
 * Usage:
 * ```tsx
 * <SortableBlockItem
 *   block={block}
 *   onChange={handleChange}
 *   onDelete={handleDelete}
 *   tenantId={tenantId}
 * />
 * ```
 */
export function SortableBlockItem({
  block,
  onChange,
  onDelete,
  tenantId,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block._key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative",
        isDragging && "opacity-50 cursor-grabbing",
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "p-2 cursor-grab active:cursor-grabbing",
          "text-muted-foreground hover:text-foreground",
          "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md",
          "-ml-2",
        )}
        aria-label="Drag to reorder block"
        title="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Block Editor */}
      <BlockEditorRenderer
        block={block}
        onChange={onChange}
        onDelete={onDelete}
        tenantId={tenantId}
      />
    </div>
  );
}
