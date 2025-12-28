"use client";

import * as React from "react";
import { GripVertical, Plus, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Container, SectionBackground } from "@/lib/hooks/use-pages";
import { useCurrentBreakpoint } from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";
import { ContainerSettingsPopover } from "../container-settings-popover";
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
  const [settingsOpen, setSettingsOpen] = React.useState(false);
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

  // Helper to get responsive layout value
  const getLayoutValue = <T,>(field: string, defaultValue: T): T => {
    if (!container.layout) return defaultValue;
    const layoutData = container.layout as unknown as Record<string, unknown>;
    return getResponsiveValue<T>(layoutData, field, breakpoint) ?? defaultValue;
  };

  const showControls = isHovered || settingsOpen || addBlockOpen;

  return (
    <div
      className={cn(
        "sortable-container",
        hasSelectedBlock && "has-selected-block",
        showControls && "is-hovered",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container Visual */}
      <div
        className={cn("container-visual container", isContainerSelected && "is-selected")}
        onClick={handleContainerClick}
        // Layout attributes
        data-layout-type={container.layout?.type || "stack"}
        data-layout-direction={container.layout?.direction}
        data-layout-wrap={container.layout?.wrap}
        data-layout-gap={getLayoutValue<string>("gap", "md")}
        data-layout-columns={container.layout?.columns}
        data-layout-justify={container.layout?.justify}
        data-layout-align={container.layout?.align}
        // Size attributes
        data-max-width={container.maxWidth || "none"}
        data-min-height={container.minHeight || "none"}
        // Padding attributes
        data-padding-x={container.paddingX}
        data-padding-y={container.paddingY}
        // Border attributes
        data-border-top={container.borderTop || "none"}
        data-border-bottom={container.borderBottom || "none"}
        data-border-left={container.borderLeft || "none"}
        data-border-right={container.borderRight || "none"}
        data-border-radius={container.borderRadius || "none"}
        // Shadow
        data-shadow={container.shadow || "none"}
        // Content alignment
        data-align={container.align || "left"}
        data-vertical-align={container.verticalAlign || "top"}
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
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </AddBlockPopover>
          </div>
        )}
      </div>

      {/* Container Controls - shown on hover */}
      {showControls && (
        <div className="container-controls">
          <div className="container-controls-bar">
            {/* Container label */}
            <span className="container-label">
              Container {containerIndex + 1}
            </span>

            {/* Add Block */}
            <AddBlockPopover
              onAddBlock={(blockType) => {
                onAddBlock(blockType);
                setAddBlockOpen(false);
              }}
              open={addBlockOpen}
              onOpenChange={setAddBlockOpen}
            >
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(addBlockOpen && "is-active")}
                title="Add Block"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </AddBlockPopover>

            {/* Container Settings */}
            <ContainerSettingsPopover
              container={container}
              onChange={onContainerChange}
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
            >
              <Button
                variant="ghost"
                size="icon-sm"
                className={cn(settingsOpen && "is-active")}
                title="Container Settings"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </ContainerSettingsPopover>

            {/* Delete Container - only if not the only one */}
            {!isOnly && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onDelete}
                title="Delete Container"
                className="container-delete-btn"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
