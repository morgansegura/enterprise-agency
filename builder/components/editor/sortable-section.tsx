"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Pencil,
  LayoutGrid,
  Copy,
  Heart,
  ChevronUp,
  ChevronDown,
  Trash2,
  Layers,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section } from "@/lib/hooks/use-pages";
import { SectionSettingsPopover } from "./section-settings-popover";
import { AddBlockPopover } from "./add-block-popover";
import { LayersPopover } from "./layers-popover";

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
  onSelectBlock?: (key: string) => void;
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
 * Features:
 * - ADD SECTION buttons above/below on hover (overlaid)
 * - Floating action panel on right side
 * - Settings popover with tabs
 * - Visual feedback during dragging
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
  hoveredBlockKey,
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
    container: "max-w-5xl mx-auto px-4",
    wide: "max-w-7xl mx-auto px-4",
    full: "w-full",
  };

  // Map background values to CSS classes
  const backgroundClasses: Record<string, string> = {
    none: "",
    primary: "bg-(--primary)",
    secondary: "bg-(--secondary)",
    accent: "bg-(--accent)",
    muted: "bg-(--muted)",
    card: "bg-(--card)",
  };

  const sectionSpacing =
    spacingClasses[section.spacing || "md"] || spacingClasses.md;
  const sectionWidth = widthClasses[section.width || "wide"] || "";
  const sectionBackground =
    backgroundClasses[section.background || "none"] || "";

  // Check if any block in this section is selected
  const hasSelectedBlock = selectedBlockKey
    ? section.blocks.some((block) => block._key === selectedBlockKey)
    : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "sortable-section",
        isDragging && "is-dragging",
        hasSelectedBlock && "has-selected-block",
        sectionBackground,
      )}
    >
      {/* Section Content with border */}
      <div className="section-content">
        {/* Layers Button - Left side (always visible) */}
        <LayersPopover
          blocks={section.blocks}
          selectedBlockKey={selectedBlockKey ?? null}
          onSelectBlock={onSelectBlock ?? (() => {})}
          onHoverBlock={onHoverBlock}
        >
          <button className="section-drag-handle" aria-label="View layers">
            <Layers className="h-5 w-5" />
          </button>
        </LayersPopover>

        {/* Section controls - hidden when a block is selected */}
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

            {/* Add Block Button - Top left */}
            <div className="section-add-block">
              <AddBlockPopover onAddBlock={onAddBlock ?? (() => {})}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  ADD BLOCK
                </Button>
              </AddBlockPopover>
            </div>

            {/* Floating Action Panel - Right side */}
            <div className="section-panel">
              {/* Edit Section */}
              <SectionSettingsPopover
                section={section}
                onChange={onSectionChange}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="section-panel-item"
                >
                  <Pencil className="h-4 w-4" />
                  <span>EDIT SECTION</span>
                </Button>
              </SectionSettingsPopover>

              {/* View Layouts */}
              <Button variant="ghost" size="sm" className="section-panel-item">
                <LayoutGrid className="h-4 w-4" />
                <span>VIEW LAYOUTS</span>
              </Button>

              {/* Quick Actions Row */}
              <div className="section-panel-row">
                {onDuplicate && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onDuplicate}
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon-sm" title="Favorite">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onMoveUp}
                  title="Move up"
                  disabled={isFirst}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onMoveDown}
                  title="Move down"
                  disabled={isLast}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Remove */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="section-panel-item section-panel-delete"
              >
                <Trash2 className="h-4 w-4" />
                <span>REMOVE</span>
              </Button>
            </div>
          </>
        )}

        {/* Section Inner Content - renders exactly as live site */}
        <div className={cn("section-inner", sectionSpacing, sectionWidth)}>
          {children}
        </div>
      </div>
    </div>
  );
}
