"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Layers, Settings2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/hooks/use-pages";
import { LayersPopover } from "../layers-popover";
import { SectionActionsPopover } from "../section-actions-popover";
import { AddBlockPopover } from "../add-block-popover";

import "./sortable-section.css";

interface SortableSectionProps {
  section: Section;
  onSectionChange: (section: Section) => void;
  onDelete: () => void;
  onAddSectionAbove?: () => void;
  onAddSectionBelow?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddBlock?: (blockType: string) => void;
  selectedBlockKey?: string | null;
  onSelectBlock?: (key: string | null) => void;
  hoveredBlockKey?: string | null;
  onHoverBlock?: (key: string | null) => void;
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}

/**
 * Sortable Section Component
 *
 * Wraps a section with drag-and-drop functionality and section-level controls.
 * Renders content exactly as it will appear on the live site (WYSIWYG).
 *
 * Section Props (matches client Section component):
 * - background: "none" | "white" | "gray" | "dark" | "primary" | "secondary"
 * - spacing: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
 * - width: "narrow" | "wide" | "full"
 * - align: "left" | "center" | "right"
 */
export function SortableSection({
  section,
  onSectionChange,
  onDelete,
  onAddSectionAbove,
  onAddSectionBelow,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  selectedBlockKey,
  onSelectBlock,
  hoveredBlockKey: _hoveredBlockKey,
  onHoverBlock,
  isFirst = false,
  isLast = false,
  children,
}: SortableSectionProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: section._key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Map spacing values to CSS classes
  const spacingClasses: Record<string, string> = {
    none: "",
    xs: "py-2",
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
    xl: "py-16",
    "2xl": "py-24",
  };

  // Map width values to CSS classes
  const widthClasses: Record<string, string> = {
    narrow: "max-w-3xl mx-auto px-4",
    wide: "max-w-7xl mx-auto px-4",
    full: "w-full",
  };

  // Map background values to CSS classes
  const backgroundClasses: Record<string, string> = {
    none: "",
    white: "bg-white",
    gray: "bg-gray-100",
    dark: "bg-gray-900",
    primary: "bg-(--primary)",
    secondary: "bg-(--secondary)",
  };

  // Map alignment values to CSS classes
  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Get section properties with defaults
  const sectionSpacing =
    spacingClasses[section.spacing || "md"] || spacingClasses.md;
  const sectionWidth =
    widthClasses[section.width || "full"] || widthClasses.full;
  // Handle background - can be string or SectionBackground object
  const bgValue =
    typeof section.background === "string"
      ? section.background
      : section.background?.type === "color"
        ? section.background.color
        : "none";
  const sectionBackground = backgroundClasses[bgValue || "none"] || "";
  const sectionAlign = alignClasses[section.align || "left"] || "";

  // Check if any block in this section is selected
  const hasSelectedBlock = selectedBlockKey
    ? section.blocks.some((block) => block._key === selectedBlockKey)
    : false;

  // Track popover open state to keep buttons visible
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "sortable-section",
        isDragging && "is-dragging",
        hasSelectedBlock && "has-selected-block",
        isPopoverOpen && "is-popover-open",
        sectionBackground,
      )}
    >
      {/* Section Content with border */}
      <div className={cn("section-content", sectionAlign)}>
        {/* Layers Button - Left side */}
        <LayersPopover
          blocks={section.blocks}
          selectedBlockKey={selectedBlockKey ?? null}
          onSelectBlock={onSelectBlock ?? (() => {})}
          onHoverBlock={onHoverBlock}
          onOpenChange={setIsPopoverOpen}
        >
          <button className="section-drag-handle" aria-label="View layers">
            <Layers className="h-4 w-4" />
          </button>
        </LayersPopover>

        {/* Add Block Button - Left side, next to layers */}
        {onAddBlock && !hasSelectedBlock && (
          <div className="section-add-block">
            <AddBlockPopover onAddBlock={onAddBlock}>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Block
              </Button>
            </AddBlockPopover>
          </div>
        )}

        {/* Section Actions Button - Right side */}
        <SectionActionsPopover
          section={section}
          onSectionChange={onSectionChange}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenChange={setIsPopoverOpen}
          isFirst={isFirst}
          isLast={isLast}
        >
          <button
            className="section-actions-handle"
            aria-label="Section actions"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </SectionActionsPopover>

        {/* Section boundary controls - only when no block selected */}
        {!hasSelectedBlock && (
          <>
            {/* ADD SECTION - Above (overlaid) - hidden for first section */}
            {onAddSectionAbove && !isFirst ? (
              <div className="section-add-above">
                <Button
                  variant="default"
                  size="sm"
                  onClick={onAddSectionAbove}
                  className="section-add-btn"
                >
                  Add Section
                </Button>
              </div>
            ) : null}

            {/* ADD SECTION - Below (overlaid) */}
            {onAddSectionBelow ? (
              <div className="section-add-below">
                <Button
                  variant="default"
                  size="sm"
                  onClick={onAddSectionBelow}
                  className="section-add-btn"
                >
                  Add Section
                </Button>
              </div>
            ) : null}
          </>
        )}

        {/* Section Inner Content - renders exactly as live site */}
        <div
          className={cn("section-inner", sectionSpacing, sectionWidth)}
          onClick={(e) => {
            // Only deselect if clicking directly on section-inner, not on a child block
            if (e.target === e.currentTarget) {
              onSelectBlock?.(null);
            }
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
