"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { BlockPickerDialog } from "@/components/editor/add-block-popover/block-picker-dialog";
import "./container-add-button.css";

interface SectionContainerAddButtonProps {
  onAddBlock: (blockType: string) => void;
}

/**
 * Tiny "+" FAB that sits next to a container's label chip at the top-right
 * of its outline. Opens the block picker when clicked.
 */
export function SectionContainerAddButton({
  onAddBlock,
}: SectionContainerAddButtonProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        className="layer-overlay-fab"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Add block"
      >
        <Plus />
      </button>

      <BlockPickerDialog
        open={open}
        onOpenChange={setOpen}
        onAddBlock={(type) => onAddBlock(type)}
        title="Add a block"
      />
    </>
  );
}
