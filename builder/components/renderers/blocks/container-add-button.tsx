"use client";

import { AddBlockPopover } from "@/components/editor/add-block-popover/add-block-popover";
import { blockRegistry } from "@/lib/editor/block-registry";
import { Plus } from "lucide-react";
import type { Block } from "@/lib/hooks/use-pages";
import "./container-add-button.css";

interface ContainerAddButtonProps {
  block: Block;
  blocks: Block[];
  onChange?: (updated: Block) => void;
  isEditing?: boolean;
}

/**
 * Shared "Add block inside container" trigger.
 *
 * Two visual states:
 * - **Empty**: full-width dashed drop-zone with a centered circular "+" button.
 * - **Non-empty**: compact inline "+" row.
 *
 * In both cases, clicking opens the shared AddBlockPopover modal to pick the
 * block type. The block is inserted into *this* container — no events, no
 * cross-container side effects.
 */
export function ContainerAddButton({
  block,
  blocks,
  onChange,
  isEditing,
}: ContainerAddButtonProps) {
  if (!isEditing || !onChange) return null;

  const handleAdd = (blockType: string) => {
    const normalizedType = blockType.endsWith("-block")
      ? blockType
      : `${blockType}-block`;
    const newBlock = blockRegistry.createDefault(normalizedType) || {
      _key: `block-${Date.now()}`,
      _type: normalizedType,
      data: {},
    };
    onChange({
      ...block,
      data: { ...block.data, blocks: [...blocks, newBlock] },
    });
  };

  const isEmpty = blocks.length === 0;

  return (
    <AddBlockPopover onAddBlock={handleAdd}>
      {isEmpty ? (
        <button
          type="button"
          className="container-add-empty"
          onClick={(e) => e.stopPropagation()}
          aria-label="Add first block"
        >
          <span className="container-add-empty-fab">
            <Plus className="size-4" />
          </span>
        </button>
      ) : (
        <button
          type="button"
          className="container-add-inline"
          onClick={(e) => e.stopPropagation()}
          aria-label="Add block"
        >
          <Plus className="size-3" />
        </button>
      )}
    </AddBlockPopover>
  );
}
