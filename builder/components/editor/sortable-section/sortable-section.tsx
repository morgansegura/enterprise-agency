"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  Section,
  Container,
  SectionBackground,
} from "@/lib/hooks/use-pages";
import { SortableContainer } from "../sortable-container";
import { toast } from "sonner";
import { useUIStore } from "@/lib/stores/ui-store";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";

// Re-export for use by page editor
export type { Container };

import "./sortable-section.css";

import {
  ArrowDown,
  ArrowUp,
  CopyPlus,
  SquareDashed,
  Trash2,
} from "lucide-react";

interface SortableSectionProps {
  section: Section;
  /** Index of this section in the sections array */
  sectionIndex: number;
  onSectionChange: (section: Section) => void;
  onDelete: () => void;
  onAddSectionAbove?: () => void;
  onAddSectionBelow?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddContainer?: () => void;
  selectedBlockKey?: string | null;
  onSelectBlock?: (key: string | null) => void;
  hoveredBlockKey?: string | null;
  onHoverBlock?: (key: string | null) => void;
  isFirst?: boolean;
  isLast?: boolean;
  /** Render blocks for a specific container */
  renderContainerBlocks: (
    containerIndex: number,
    container: Container,
  ) => React.ReactNode;
  /** Called when a block is added to a container */
  onAddBlockToContainer: (containerIndex: number, blockType: string) => void;
}

/**
 * Background presets that map to data-background attribute values
 */
const backgroundPresets = [
  "none",
  "white",
  "gray",
  "dark",
  "primary",
  "secondary",
  "muted",
  "accent",
];

/**
 * Generate background styles from SectionBackground object
 * Returns data attribute value and inline styles for custom backgrounds
 */
function getBackgroundStyles(background?: string | SectionBackground): {
  dataBackground: string;
  style: React.CSSProperties;
} {
  if (!background) {
    return { dataBackground: "none", style: {} };
  }

  // Legacy string format - check if it's a preset
  if (typeof background === "string") {
    if (backgroundPresets.includes(background)) {
      return { dataBackground: background, style: {} };
    }
    // Custom color string
    return { dataBackground: "none", style: { backgroundColor: background } };
  }

  // Object format
  switch (background.type) {
    case "none":
      return { dataBackground: "none", style: {} };

    case "color":
      // Check if it's a preset color name
      if (background.color && backgroundPresets.includes(background.color)) {
        return { dataBackground: background.color, style: {} };
      }
      // Custom color
      return {
        dataBackground: "none",
        style: { backgroundColor: background.color || "transparent" },
      };

    case "gradient":
      if (background.gradient) {
        const gradient = background.gradient;

        // Check if it's a Tailwind gradient (has 'direction' property)
        if ("direction" in gradient) {
          // Tailwind gradient - apply via class names, return undefined for inline
          // The section-renderer will handle the Tailwind classes
          return { dataBackground: "none", style: {} };
        }

        // Legacy CSS gradient
        const { type, angle, stops } = gradient;
        const stopStr = stops
          .map((s) => `${s.color} ${s.position}%`)
          .join(", ");
        const gradientCss =
          type === "linear"
            ? `linear-gradient(${angle || 180}deg, ${stopStr})`
            : `radial-gradient(circle, ${stopStr})`;
        return { dataBackground: "none", style: { background: gradientCss } };
      }
      return { dataBackground: "none", style: {} };

    case "image":
      if (background.image?.src) {
        const imageStyle: React.CSSProperties = {
          backgroundImage: `url(${background.image.src})`,
          backgroundSize: background.image.size || "cover",
          backgroundPosition: background.image.position || "center",
          backgroundRepeat: background.image.repeat || "no-repeat",
        };
        return { dataBackground: "none", style: imageStyle };
      }
      return { dataBackground: "none", style: {} };

    default:
      return { dataBackground: "none", style: {} };
  }
}

/**
 * Sortable Section Component
 *
 * Wraps a section with drag-and-drop functionality and section-level controls.
 * Renders content using data-* attributes for WYSIWYG parity with client.
 *
 * Structure matches client Section component:
 * <div.section-visual data-*>  <- Section wrapper (background, padding, border, shadow)
 *   <div.section-container data-*>[]  <- Container(s) with layout and blocks
 *     {blocks}
 *   </div>
 * </div>
 */
export function SortableSection({
  section,
  sectionIndex,
  onSectionChange,
  onDelete,
  onAddSectionAbove,
  onAddSectionBelow,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddContainer,
  selectedBlockKey,
  onSelectBlock,
  hoveredBlockKey: _hoveredBlockKey,
  onHoverBlock,
  isFirst = false,
  isLast = false,
  renderContainerBlocks,
  onAddBlockToContainer,
}: SortableSectionProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: section._key,
  });

  // UI Store for section/container selection
  const { selectedElement, selectSection, selectContainer } = useUIStore();

  // Get current breakpoint for responsive values
  const breakpoint = useCurrentBreakpoint();

  // Helper to get responsive section value
  const getSectionValue = <T,>(field: string, defaultValue: T): T => {
    const sectionData = section as unknown as Record<string, unknown>;
    return (
      getResponsiveValue<T>(sectionData, field, breakpoint) ?? defaultValue
    );
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get responsive padding values
  const paddingY = getSectionValue<string>("paddingY", "md");
  const effectivePaddingTop =
    getSectionValue<string>("paddingTop", "") || paddingY;
  const effectivePaddingBottom =
    getSectionValue<string>("paddingBottom", "") || paddingY;

  // Get other responsive values
  const width = getSectionValue<string>("width", "full");
  const gapY = getSectionValue<string>("gapY", "");
  const align = getSectionValue<string>("align", "left");
  const minHeight = getSectionValue<string>("minHeight", "none");
  const verticalAlign = getSectionValue<string>("verticalAlign", "top");
  const borderTop = getSectionValue<string>("borderTop", "none");
  const borderBottom = getSectionValue<string>("borderBottom", "none");
  const shadow = getSectionValue<string>("shadow", "none");

  // Get background styles
  const { dataBackground, style: bgStyle } = getBackgroundStyles(
    section.background,
  );

  // Check if any block in any container is selected
  const hasSelectedBlock = selectedBlockKey
    ? section.containers?.some((container) =>
        container.blocks?.some((block) => block._key === selectedBlockKey),
      )
    : false;

  // Check if this section is selected in the right panel
  const isSectionSelected =
    selectedElement?.type === "section" &&
    selectedElement?.sectionIndex === sectionIndex;

  // Handle section click - select it for the right panel
  const handleSectionClick = (e: React.MouseEvent) => {
    // Only select if clicking directly on section (not on nested elements)
    const target = e.target as HTMLElement;
    if (
      target.closest(".sortable-container") ||
      target.closest(".block-wrapper") ||
      target.closest("button") ||
      target.closest('[role="dialog"]') ||
      target.closest("[data-radix-popper-content-wrapper]")
    ) {
      return;
    }
    e.stopPropagation();
    selectSection(sectionIndex, section._key);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "sortable-section",
        isDragging && "is-dragging",
        hasSelectedBlock && "has-selected-block",
      )}
    >
      <div
        className={cn(
          "sortable-section-label",
          isSectionSelected && "is-selected",
        )}
      >
        <span>Section {sectionIndex + 1}</span>
        <Button variant="ghost" size="icon-sm" onClick={onMoveUp}>
          <ArrowUp />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onMoveDown}>
          <ArrowDown />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onDuplicate}>
          <CopyPlus />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onDelete}>
          <Trash2 />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onAddContainer}>
          <SquareDashed />
        </Button>
      </div>
      {/* Section Visual - renders with same data attributes as client Section component */}
      <div
        className={cn(
          "section-visual section",
          isSectionSelected && "is-selected",
        )}
        onClick={handleSectionClick}
        // Section-level data attributes (matches client/components/layout/section/section.tsx)
        // All values are responsive-aware via getSectionValue()
        data-padding-top={effectivePaddingTop}
        data-padding-bottom={effectivePaddingBottom}
        data-gap-y={gapY || undefined}
        data-background={dataBackground}
        data-width={width}
        data-align={align}
        data-border-top={borderTop}
        data-border-bottom={borderBottom}
        data-shadow={shadow}
        data-min-height={minHeight}
        data-vertical-align={minHeight !== "none" ? verticalAlign : undefined}
        style={bgStyle}
      >
        {/* Section boundary controls - only when no block selected */}
        {!hasSelectedBlock && (
          <>
            {/* ADD SECTION - Above (overlaid) - hidden for first section */}
            {onAddSectionAbove && !isFirst ? (
              <>
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
              </>
            ) : null}

            {/* ADD SECTION - Below (overlaid) */}
            {onAddSectionBelow ? (
              <>
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
              </>
            ) : null}
          </>
        )}

        {/* Render all containers */}
        <div className="section-containers">
          {(section.containers ?? []).map((container, containerIndex) => (
            <SortableContainer
              key={container._key}
              container={container}
              containerIndex={containerIndex}
              sectionIndex={sectionIndex}
              onContainerChange={(updatedContainer) => {
                const newContainers = [...(section.containers ?? [])];
                newContainers[containerIndex] = updatedContainer;
                onSectionChange({ ...section, containers: newContainers });
              }}
              onDelete={() => {
                const newContainers = (section.containers ?? []).filter(
                  (_, idx) => idx !== containerIndex,
                );
                onSectionChange({ ...section, containers: newContainers });
                toast.success("Container deleted");
              }}
              onAddBlock={(blockType) =>
                onAddBlockToContainer(containerIndex, blockType)
              }
              selectedBlockKey={selectedBlockKey}
              onSelectBlock={onSelectBlock}
              isOnly={(section.containers ?? []).length === 1}
            >
              {renderContainerBlocks(containerIndex, container)}
            </SortableContainer>
          ))}
        </div>
      </div>
    </div>
  );
}
