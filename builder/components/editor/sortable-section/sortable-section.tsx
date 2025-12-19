"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section, SectionBackground } from "@/lib/hooks/use-pages";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import { SectionActionsPopover } from "../section-actions-popover";

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
        const { type, angle, stops } = background.gradient;
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
 * Get container background style
 */
function getContainerBackgroundStyle(
  background?: string | SectionBackground,
): React.CSSProperties | undefined {
  if (!background) return undefined;

  if (typeof background === "string") {
    if (background === "transparent" || background === "none") return undefined;
    return { backgroundColor: background };
  }

  if (background.type === "color" && background.color) {
    return { backgroundColor: background.color };
  }

  if (background.type === "gradient" && background.gradient) {
    const { type, angle, stops } = background.gradient;
    const stopStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
    const gradientCss =
      type === "linear"
        ? `linear-gradient(${angle || 180}deg, ${stopStr})`
        : `radial-gradient(circle, ${stopStr})`;
    return { background: gradientCss };
  }

  if (background.type === "image" && background.image?.src) {
    return {
      backgroundImage: `url(${background.image.src})`,
      backgroundSize: background.image.size || "cover",
      backgroundPosition: background.image.position || "center",
      backgroundRepeat: background.image.repeat || "no-repeat",
    };
  }

  return undefined;
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

  // Get current breakpoint for responsive values
  const breakpoint = useCurrentBreakpoint();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Get effective padding values
  const effectivePaddingTop = section.paddingTop || section.paddingY || "md";
  const effectivePaddingBottom =
    section.paddingBottom || section.paddingY || "md";

  // Get background styles
  const { dataBackground, style: bgStyle } = getBackgroundStyles(
    section.background,
  );

  // Get first container for backwards compatibility
  // Future: support rendering multiple containers
  const primaryContainer = section.containers?.[0];

  // Helper to get responsive layout value
  const getLayoutValue = <T,>(field: string, defaultValue: T): T => {
    if (!primaryContainer?.layout) return defaultValue;
    const layoutData = primaryContainer.layout as unknown as Record<
      string,
      unknown
    >;
    return getResponsiveValue<T>(layoutData, field, breakpoint) ?? defaultValue;
  };

  // Check if any block in any container is selected
  const hasSelectedBlock = selectedBlockKey
    ? section.containers?.some((container) =>
        container.blocks?.some((block) => block._key === selectedBlockKey),
      )
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
      )}
    >
      {/* Section Visual - renders with same data attributes as client Section component */}
      <div
        className="section-visual section"
        // Section-level data attributes (matches client/components/layout/section/section.tsx)
        data-padding-top={effectivePaddingTop}
        data-padding-bottom={effectivePaddingBottom}
        data-gap-y={section.gapY}
        data-background={dataBackground}
        data-width={section.width || "full"}
        data-align={section.align || "left"}
        data-border-top={section.borderTop || "none"}
        data-border-bottom={section.borderBottom || "none"}
        data-shadow={section.shadow || "none"}
        data-min-height={section.minHeight || "none"}
        data-vertical-align={
          section.minHeight && section.minHeight !== "none"
            ? section.verticalAlign || "top"
            : undefined
        }
        style={bgStyle}
      >
        {/* Drag Handle - Left side */}
        <button className="section-drag-handle" aria-label="Drag section">
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Section Actions Button - Right side */}
        <SectionActionsPopover
          section={section}
          onSectionChange={onSectionChange}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onAddBlock={onAddBlock}
          selectedBlockKey={selectedBlockKey}
          onSelectBlock={onSelectBlock}
          onHoverBlock={onHoverBlock}
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

        {/* Render containers - for now, render first container for backwards compatibility */}
        {primaryContainer && (
          <div
            className="section-container container"
            // Layout attributes
            data-layout-type={primaryContainer.layout?.type || "stack"}
            data-layout-direction={primaryContainer.layout?.direction}
            data-layout-wrap={primaryContainer.layout?.wrap}
            data-layout-gap={getLayoutValue<string>("gap", "md")}
            data-layout-columns={primaryContainer.layout?.columns}
            data-layout-justify={primaryContainer.layout?.justify}
            data-layout-align={primaryContainer.layout?.align}
            // Size attributes
            data-max-width={primaryContainer.maxWidth || "none"}
            data-min-height={primaryContainer.minHeight || "none"}
            // Padding attributes
            data-padding-x={primaryContainer.paddingX}
            data-padding-y={primaryContainer.paddingY}
            // Border attributes
            data-border-top={primaryContainer.borderTop || "none"}
            data-border-bottom={primaryContainer.borderBottom || "none"}
            data-border-left={primaryContainer.borderLeft || "none"}
            data-border-right={primaryContainer.borderRight || "none"}
            data-border-radius={primaryContainer.borderRadius || "none"}
            // Shadow
            data-shadow={primaryContainer.shadow || "none"}
            // Content alignment
            data-align={primaryContainer.align || "left"}
            data-vertical-align={primaryContainer.verticalAlign || "top"}
            style={getContainerBackgroundStyle(primaryContainer.background)}
            onClick={(e) => {
              // Only deselect if clicking directly on container, not on a child block
              if (e.target === e.currentTarget) {
                onSelectBlock?.(null);
              }
            }}
          >
            {children}
          </div>
        )}

        {/* Fallback if no containers */}
        {!primaryContainer && (
          <div
            className="section-container container"
            data-layout-type="stack"
            data-layout-gap="md"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onSelectBlock?.(null);
              }
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
