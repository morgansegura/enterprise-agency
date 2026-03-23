"use client";

import * as React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Container, SectionBackground } from "@/lib/hooks/use-pages";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import { AddBlockPopover } from "../add-block-popover";
import { useUIStore } from "@/lib/stores/ui-store";

import "./sortable-container.css";

interface SortableContainerProps {
  container: Container;
  containerIndex: number;
  sectionIndex: number;
  onContainerChange: (container: Container) => void;
  onDelete: () => void;
  onAddBlock: (blockType: string) => void;
  selectedBlockKey?: string | null;
  onSelectBlock?: (key: string | null) => void;
  isOnly?: boolean;
  children: React.ReactNode;
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
    const gradient = background.gradient;

    // Check if it's a Tailwind gradient (has 'direction' property)
    if ("direction" in gradient) {
      // Tailwind gradient - apply via class names, return undefined for inline
      // The section-renderer will handle the Tailwind classes
      return undefined;
    }

    // Legacy CSS gradient
    const { type, angle, stops } = gradient;
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
 * SortableContainer Component
 *
 * Renders a single container within a section with:
 * - Container settings popover
 * - Add block functionality
 * - Delete container (if not the only one)
 * - Container layout rendering
 */
export function SortableContainer({
  container,
  containerIndex,
  sectionIndex,
  onContainerChange,
  onDelete,
  onAddBlock,
  selectedBlockKey,
  onSelectBlock,
  isOnly = false,
  children,
}: SortableContainerProps) {
  const breakpoint = useCurrentBreakpoint();
  const [isHovered, setIsHovered] = React.useState(false);
  const [addBlockOpen, setAddBlockOpen] = React.useState(false);

  // UI Store for container selection
  const { selectedElement, selectContainer } = useUIStore();

  // Check if any block in this container is selected
  const hasSelectedBlock = selectedBlockKey
    ? container.blocks?.some((block) => block._key === selectedBlockKey)
    : false;

  // Check if this container is selected in the right panel
  const isContainerSelected =
    selectedElement?.type === "container" &&
    selectedElement?.sectionIndex === sectionIndex &&
    selectedElement?.containerIndex === containerIndex;

  // Handle container click - select it for the right panel
  const handleContainerClick = (e: React.MouseEvent) => {
    // Only select if clicking directly on container (not on a child block or button)
    const target = e.target as HTMLElement;
    if (
      target.closest(".block-wrapper") ||
      target.closest("button") ||
      target.closest('[role="dialog"]') ||
      target.closest("[data-radix-popper-content-wrapper]")
    ) {
      return;
    }
    e.stopPropagation();
    selectContainer(sectionIndex, containerIndex, container._key);
  };

  // Helper to get responsive container value
  const getContainerValue = <T,>(field: string, defaultValue: T): T => {
    const containerData = container as unknown as Record<string, unknown>;
    return (
      getResponsiveValue<T>(containerData, field, breakpoint) ?? defaultValue
    );
  };

  // Helper to get responsive layout value
  const getLayoutValue = <T,>(field: string, defaultValue: T): T => {
    if (!container.layout) return defaultValue;
    const layoutData = container.layout as unknown as Record<string, unknown>;
    return getResponsiveValue<T>(layoutData, field, breakpoint) ?? defaultValue;
  };

  // Get all responsive container values
  const paddingX = getContainerValue<string>("paddingX", "");
  const paddingY = getContainerValue<string>("paddingY", "");
  const maxWidth = getContainerValue<string>("maxWidth", "none");
  const minHeight = getContainerValue<string>("minHeight", "none");
  const align = getContainerValue<string>("align", "left");
  const verticalAlign = getContainerValue<string>("verticalAlign", "top");
  const borderTop = getContainerValue<string>("borderTop", "none");
  const borderBottom = getContainerValue<string>("borderBottom", "none");
  const borderLeft = getContainerValue<string>("borderLeft", "none");
  const borderRight = getContainerValue<string>("borderRight", "none");
  const borderRadius = getContainerValue<string>("borderRadius", "none");
  const shadow = getContainerValue<string>("shadow", "none");

  // Get responsive layout values
  const layoutType = getLayoutValue<string>("type", "stack");
  const layoutDirection = getLayoutValue<string>("direction", "");
  const layoutWrap = getLayoutValue<string>("wrap", "");
  const layoutGap = getLayoutValue<string>("gap", "md");
  const layoutColumns = getLayoutValue<string>("columns", "");
  const layoutJustify = getLayoutValue<string>("justify", "");
  const layoutAlign = getLayoutValue<string>("align", "");

  return (
    <div
      className={cn(
        "sortable-container",
        hasSelectedBlock && "has-selected-block",
        isHovered && "is-hovered",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container Visual */}
      <div
        className={cn(
          "container-visual section-container",
          isContainerSelected && "is-selected",
        )}
        onClick={handleContainerClick}
        // Layout attributes - all responsive
        data-layout-type={layoutType}
        data-layout-direction={layoutDirection || undefined}
        data-layout-wrap={layoutWrap || undefined}
        data-layout-gap={layoutGap}
        data-layout-columns={layoutColumns || undefined}
        data-layout-justify={layoutJustify || undefined}
        data-layout-align={layoutAlign || undefined}
        // Size attributes - responsive
        data-max-width={maxWidth}
        data-min-height={minHeight}
        // Padding attributes - responsive
        data-padding-x={paddingX || undefined}
        data-padding-y={paddingY || undefined}
        // Border attributes - responsive
        data-border-top={borderTop}
        data-border-bottom={borderBottom}
        data-border-left={borderLeft}
        data-border-right={borderRight}
        data-border-radius={borderRadius}
        // Shadow - responsive
        data-shadow={shadow}
        // Content alignment - responsive
        data-align={align}
        data-vertical-align={verticalAlign}
        style={getContainerBackgroundStyle(container.background)}
      >
        {children}

        {/* Empty state - show when no blocks */}
        {(!container.blocks || container.blocks.length === 0) && (
          <div className="container-empty">
            <AddBlockPopover
              onAddBlock={(blockType) => {
                onAddBlock(blockType);
                setAddBlockOpen(false);
              }}
              open={addBlockOpen}
              onOpenChange={setAddBlockOpen}
            >
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 " />
                Add Block
              </Button>
            </AddBlockPopover>
          </div>
        )}
      </div>
    </div>
  );
}
