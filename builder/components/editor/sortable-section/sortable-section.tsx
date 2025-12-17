"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  Section,
  SectionBackground,
  ContainerSettings,
} from "@/lib/hooks/use-pages";
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
 * Sortable Section Component
 *
 * Wraps a section with drag-and-drop functionality and section-level controls.
 * Renders content using data-* attributes for WYSIWYG parity with client.
 *
 * Structure matches client Section component:
 * <div.section-visual data-*>  <- Section wrapper (background, padding, border, shadow)
 *   <div.section-container data-*>  <- Inner container (layout, container styles)
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
  const effectivePaddingTop = section.paddingTop || section.spacing || "md";
  const effectivePaddingBottom =
    section.paddingBottom || section.spacing || "md";

  // Get background styles
  const { dataBackground, style: bgStyle } = getBackgroundStyles(
    section.background,
  );

  // Helper to get responsive container value
  const getContainerValue = <T,>(field: string, defaultValue: T): T => {
    if (!section.container) return defaultValue;
    const containerData = section.container as unknown as Record<
      string,
      unknown
    >;
    return (
      getResponsiveValue<T>(containerData, field, breakpoint) ?? defaultValue
    );
  };

  // Helper to get responsive layout value
  const getLayoutValue = <T,>(field: string, defaultValue: T): T => {
    if (!section.container?.layout) return defaultValue;
    const layoutData = section.container.layout as unknown as Record<
      string,
      unknown
    >;
    return getResponsiveValue<T>(layoutData, field, breakpoint) ?? defaultValue;
  };

  // Check if any block in this section is selected
  const hasSelectedBlock = selectedBlockKey
    ? section.blocks.some((block) => block._key === selectedBlockKey)
    : false;

  // Track popover open state to keep buttons visible
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Get container padding
  const containerPaddingX = section.container
    ? getContainerValue<string>("paddingX", undefined)
    : undefined;
  const containerPaddingY = section.container
    ? getContainerValue<string | undefined>("paddingY", undefined)
    : undefined;

  // Build container inline style for custom background
  const containerInlineStyle: React.CSSProperties = {};
  if (section.container?.background) {
    if (
      typeof section.container.background === "string" &&
      section.container.background !== "transparent"
    ) {
      containerInlineStyle.backgroundColor = section.container.background;
    }
  }

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

        {/* Inner Container - renders with same data attributes as client */}
        <div
          className="section-container"
          // Container-level data attributes
          data-container-padding-x={containerPaddingX}
          data-container-padding-y={containerPaddingY}
          data-container-padding-top={section.container?.paddingTop}
          data-container-padding-bottom={section.container?.paddingBottom}
          data-container-border-top={section.container?.borderTop}
          data-container-border-bottom={section.container?.borderBottom}
          data-container-border-radius={section.container?.borderRadius}
          data-container-shadow={section.container?.shadow}
          data-container-min-height={section.container?.minHeight}
          data-container-align={section.container?.align}
          data-container-vertical-align={section.container?.verticalAlign}
          // Layout attributes
          data-layout-type={section.container?.layout?.type || "stack"}
          data-layout-direction={section.container?.layout?.direction}
          data-layout-gap={getLayoutValue<string>("gap", undefined)}
          data-layout-columns={section.container?.layout?.columns}
          data-layout-justify={section.container?.layout?.justify}
          data-layout-align={section.container?.layout?.align}
          style={
            Object.keys(containerInlineStyle).length > 0
              ? containerInlineStyle
              : undefined
          }
          onClick={(e) => {
            // Only deselect if clicking directly on container, not on a child block
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
