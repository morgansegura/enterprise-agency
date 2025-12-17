"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlockWrapper } from "@/components/editor/block-wrapper";
import { BlockEditorRenderer } from "./block-editor-renderer";
import type { Block } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";

interface SortableBlockItemProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  tenantId?: string;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * Sortable Block Item - WYSIWYG Version
 *
 * Wraps blocks with:
 * - Drag-and-drop functionality
 * - Selection state with floating toolbar
 * - Settings popover for block configuration
 * - Quick actions (edit, duplicate, delete)
 *
 * The content renders exactly as it will appear to end users.
 */
export function SortableBlockItem({
  block,
  onChange,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  tenantId,
  isSelected = false,
  isHovered = false,
  onSelect,
  isFirst = false,
  isLast = false,
}: SortableBlockItemProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: block._key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "opacity-50 cursor-grabbing")}
    >
      <BlockWrapper
        block={block}
        onBlockChange={onChange}
        isSelected={isSelected}
        isHovered={isHovered}
        onSelect={onSelect}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}
      >
        <BlockEditorRenderer
          block={block}
          onChange={onChange}
          onDelete={onDelete}
          isSelected={isSelected}
        />
      </BlockWrapper>
    </div>
  );
}
