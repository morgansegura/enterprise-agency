"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { BlockPickerDialog } from "@/components/editor/add-block-popover/block-picker-dialog";
import "./container-add-button.css";

interface LayerOverlayChipProps {
  label: string;
  onAddBlock?: (blockType: string) => void;
  /** Block type ids hidden from the picker (e.g., Box excludes container-block) */
  excludeTypes?: string[];
  /** Picker dialog title */
  pickerTitle?: string;
}

/**
 * Overlay chip (label + optional "+" FAB) that sits at the top-right of a
 * section / container / box on the canvas. Visibility is controlled by the
 * parent's `.is-preview-selected` / `.is-preview-hovered` classes via CSS.
 */
export function LayerOverlayChip({
  label,
  onAddBlock,
  excludeTypes,
  pickerTitle = "Add a block",
}: LayerOverlayChipProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="layer-overlay-chip">
      <span className="layer-overlay-label">{label}</span>
      {onAddBlock ? (
        <>
          <button
            type="button"
            className="layer-overlay-fab"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            aria-label={`Add block to ${label}`}
          >
            <Plus />
          </button>
          <BlockPickerDialog
            open={open}
            onOpenChange={setOpen}
            onAddBlock={(type) => onAddBlock(type)}
            excludeTypes={excludeTypes}
            title={pickerTitle}
          />
        </>
      ) : null}
    </div>
  );
}
