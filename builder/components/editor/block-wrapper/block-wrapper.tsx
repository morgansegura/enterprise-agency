"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Pencil,
  Bold,
  Italic,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextFormatting } from "../block-editor-context";

import type { Block } from "@/lib/hooks/use-pages";

import "./block-wrapper.css";
import { BlockSettingsPopover } from "../block-settings-popover";

interface BlockWrapperProps {
  children: React.ReactNode;
  block?: Block;
  onBlockChange?: (block: Block) => void;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
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
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  className,
}: BlockWrapperProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [isLocalHovered, setIsLocalHovered] = React.useState(false);

  // Get text formatting functions from context
  const {
    canFormat,
    toggleBold,
    toggleItalic,
    setLink,
    removeLink,
    isBold,
    isItalic,
    isLink,
  } = useTextFormatting();

  // Show hover state from either direct hover or layers popover hover
  const showHoverState = (isLocalHovered || isHovered) && !isSelected;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "block-wrapper",
        isSelected && "is-selected",
        showHoverState && "is-hovered",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onMouseEnter={() => setIsLocalHovered(true)}
      onMouseLeave={() => setIsLocalHovered(false)}
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

          {/* Move Up */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp?.();
            }}
            disabled={isFirst}
            title="Move Up"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          {/* Move Down */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown?.();
            }}
            disabled={isLast}
            title="Move Down"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Text Formatting - only shown for text blocks with selection */}
          {canFormat && (
            <>
              <div className="block-toolbar-separator" />
              <Button
                variant={isBold ? "default" : "ghost"}
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBold();
                }}
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={isItalic ? "default" : "ghost"}
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItalic();
                }}
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              {isLink ? (
                <Button
                  variant="default"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLink();
                  }}
                  title="Remove link"
                >
                  <Unlink className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLink();
                  }}
                  title="Add link"
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
              )}
            </>
          )}

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
      <div className="block-content">{children}</div>
    </div>
  );
}
