"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Type, Image } from "lucide-react";
import type { Block } from "@/lib/hooks/use-pages";

import "./layers-popover.css";

interface LayersPopoverProps {
  blocks: Block[];
  selectedBlockKey: string | null;
  onSelectBlock: (key: string) => void;
  onHoverBlock?: (key: string | null) => void;
  children: React.ReactNode;
}

function getBlockIcon(blockType: string) {
  switch (blockType) {
    case "heading-block":
    case "text-block":
      return <Type className="h-4 w-4" />;
    case "image-block":
      return <Image className="h-4 w-4" />;
    default:
      return <Type className="h-4 w-4" />;
  }
}

function getBlockLabel(block: Block): string {
  // Try to get a meaningful label from block data
  if (block.data?.text) {
    const text = block.data.text as string;
    return text.length > 30 ? text.substring(0, 30) + "..." : text;
  }
  if (block.data?.alt) {
    return block.data.alt as string;
  }
  // Fallback to block type
  return block._type.replace("-block", "").charAt(0).toUpperCase() +
         block._type.replace("-block", "").slice(1);
}

export function LayersPopover({
  blocks,
  selectedBlockKey,
  onSelectBlock,
  onHoverBlock,
  children,
}: LayersPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelectBlock = (key: string) => {
    onSelectBlock(key);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    // Clear hover state when closing
    if (!isOpen && onHoverBlock) {
      onHoverBlock(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <span className={open ? "layers-trigger-open" : ""}>
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="layers-popover" align="start" sideOffset={8}>
        <h4 className="layers-title">Layers</h4>

        <div className="layers-list">
          {blocks.length === 0 ? (
            <p className="layers-empty">No blocks in this section</p>
          ) : (
            blocks.map((block) => (
              <button
                key={block._key}
                className={`layers-item ${
                  selectedBlockKey === block._key ? "is-selected" : ""
                }`}
                onClick={() => handleSelectBlock(block._key)}
                onMouseEnter={() => onHoverBlock?.(block._key)}
                onMouseLeave={() => onHoverBlock?.(null)}
              >
                {getBlockIcon(block._type)}
                <span>{getBlockLabel(block)}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
