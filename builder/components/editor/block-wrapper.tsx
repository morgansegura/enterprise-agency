"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Copy,
  MoveUp,
  Pencil,
  PaintBucket,
  Pin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockSettingsPopover } from "./block-settings-popover";
import type { Block } from "@/lib/hooks/use-pages";

import "./block-wrapper.css";

interface BlockWrapperProps {
  children: React.ReactNode;
  block?: Block;
  onBlockChange?: (block: Block) => void;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  className?: string;
}

/**
 * BlockWrapper
 *
 * Wraps blocks with selection UI and floating toolbar.
 * Provides a clean WYSIWYG editing experience:
 * - Selection outline with resize handles
 * - Toolbar above selected block with quick actions
 * - Settings popover for block configuration
 */
export function BlockWrapper({
  children,
  block,
  onBlockChange,
  isSelected = false,
  isHovered = false,
  onSelect,
  onDelete,
  onDuplicate,
  className,
}: BlockWrapperProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "block-wrapper",
        isSelected && "is-selected",
        isHovered && "is-hovered",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Floating Toolbar - appears above selected block */}
      {isSelected && (
        <div className="block-toolbar">
          {/* Edit - with settings popover */}
          {block && onBlockChange ? (
            <BlockSettingsPopover
              block={block}
              onChange={onBlockChange}
              open={showSettings}
              onOpenChange={setShowSettings}
            >
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </BlockSettingsPopover>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => e.stopPropagation()}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}

          {/* Separator */}
          <div className="block-toolbar-separator" />

          {/* Fill/Style */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
            title="Fill"
          >
            <PaintBucket className="h-4 w-4" />
          </Button>

          {/* Move */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
            title="Move"
          >
            <MoveUp className="h-4 w-4" />
          </Button>

          {/* Pin */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => e.stopPropagation()}
            title="Pin"
          >
            <Pin className="h-4 w-4" />
          </Button>

          {/* Separator */}
          <div className="block-toolbar-separator" />

          {/* Duplicate */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate?.();
            }}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="Delete"
            className="block-toolbar-delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Selection handles */}
      {isSelected && (
        <>
          <div className="block-handle top-left" />
          <div className="block-handle top-right" />
          <div className="block-handle bottom-left" />
          <div className="block-handle bottom-right" />
          <div className="block-handle top" />
          <div className="block-handle bottom" />
          <div className="block-handle left" />
          <div className="block-handle right" />
        </>
      )}

      {/* Block Content */}
      <div className="block-content">
        {children}
      </div>
    </div>
  );
}
