"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link as LinkIcon, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextFormatting } from "../block-editor-context";

import "./block-wrapper.css";

interface BlockWrapperProps {
  children: React.ReactNode;
  /** Unique key for this block - used to track which block has active editor */
  blockKey?: string;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  className?: string;
}

/**
 * BlockWrapper
 *
 * Wraps blocks with selection UI and floating text formatting toolbar.
 * Provides a clean WYSIWYG editing experience:
 * - Selection highlight with background tint
 * - Text formatting toolbar (only when text is selected in THIS block)
 * - Actions (move, clone, delete) are in the sidebar settings panel
 */
export function BlockWrapper({
  children,
  blockKey,
  isSelected = false,
  isHovered = false,
  onSelect,
  className,
}: BlockWrapperProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isLocalHovered, setIsLocalHovered] = React.useState(false);

  // Get text formatting functions from context - pass blockKey to only show toolbar for this block
  const {
    canFormat,
    toggleBold,
    toggleItalic,
    setLink,
    removeLink,
    isBold,
    isItalic,
    isLink,
  } = useTextFormatting(blockKey);

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
      {/* Text Formatting Toolbar - only shown when text is selected in text block */}
      {canFormat && (
        <div className="block-toolbar">
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
        </div>
      )}

      {/* Block Content */}
      <div className="block-content">{children}</div>
    </div>
  );
}
