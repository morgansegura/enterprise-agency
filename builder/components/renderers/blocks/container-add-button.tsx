"use client";

import { AddBlockPopover } from "@/components/editor/add-block-popover/add-block-popover";
import { blockRegistry } from "@/lib/editor/block-registry";
import { Plus } from "lucide-react";
import type { Block } from "@/lib/hooks/use-pages";

interface ContainerAddButtonProps {
  block: Block;
  blocks: Block[];
  onChange?: (updated: Block) => void;
  isEditing?: boolean;
}

/**
 * Shared "Add block inside container" button.
 * Used by Stack, Flex, Grid, Columns block renderers.
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
    window.dispatchEvent(new Event("add-block"));
  };

  return (
    <AddBlockPopover onAddBlock={handleAdd}>
      <button
        type="button"
        className="flex items-center justify-center w-full py-2 border border-dashed border-(--el-300) rounded-md text-(--el-400) hover:border-(--accent-primary) hover:text-(--accent-primary) transition-colors cursor-pointer bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <Plus className="size-3.5 mr-1" />
        <span className="text-[11px] font-medium">
          {blocks.length === 0 ? "Add block" : "+"}
        </span>
      </button>
    </AddBlockPopover>
  );
}
