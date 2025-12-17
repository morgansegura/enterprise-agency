"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section, SectionBackground, ContainerSettings } from "@/lib/hooks/use-pages";
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

// =============================================================================
// Style Mappings (matches client/components/layout/section/section.tsx)
// =============================================================================

const paddingTopClasses: Record<string, string> = {
  none: "pt-0",
  xs: "pt-2",
  sm: "pt-4",
  md: "pt-8",
  lg: "pt-12",
  xl: "pt-16",
  "2xl": "pt-24",
  "3xl": "pt-32",
  "4xl": "pt-40",
  "5xl": "pt-48",
  "6xl": "pt-56",
  "7xl": "pt-64",
};

const paddingBottomClasses: Record<string, string> = {
  none: "pb-0",
  xs: "pb-2",
  sm: "pb-4",
  md: "pb-8",
  lg: "pb-12",
  xl: "pb-16",
  "2xl": "pb-24",
  "3xl": "pb-32",
  "4xl": "pb-40",
  "5xl": "pb-48",
  "6xl": "pb-56",
  "7xl": "pb-64",
};

const sectionBorderClasses: Record<string, string> = {
  none: "",
  thin: "border-[1px] border-gray-200",
  medium: "border-[2px] border-gray-200",
  thick: "border-[4px] border-gray-200",
};

const sectionShadowClasses: Record<string, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  inner: "shadow-inner",
};

const widthClasses: Record<string, string> = {
  narrow: "max-w-3xl",
  container: "max-w-5xl",
  wide: "max-w-7xl",
  full: "w-full",
};

const backgroundPresetClasses: Record<string, string> = {
  none: "",
  white: "bg-white",
  gray: "bg-gray-100",
  dark: "bg-gray-900 text-white",
  primary: "bg-[var(--primary)] text-[var(--primary-foreground)]",
  secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
};

const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const minHeightClasses: Record<string, string> = {
  none: "",
  sm: "min-h-[300px]",
  md: "min-h-[400px]",
  lg: "min-h-[500px]",
  xl: "min-h-[600px]",
  screen: "min-h-screen",
};

const verticalAlignClasses: Record<string, string> = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
};

// Container style mappings
const containerPaddingXClasses: Record<string, string> = {
  none: "px-0",
  xs: "px-2",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
  xl: "px-12",
};

const containerPaddingYClasses: Record<string, string> = {
  none: "py-0",
  xs: "py-2",
  sm: "py-4",
  md: "py-6",
  lg: "py-8",
  xl: "py-12",
};

const containerWidthClasses: Record<string, string> = {
  narrow: "max-w-3xl",
  container: "max-w-5xl",
  wide: "max-w-7xl",
  full: "w-full",
};

const gapClasses: Record<string, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

const borderRadiusClasses: Record<string, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const shadowClasses: Record<string, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

/**
 * Generate background styles from SectionBackground object
 */
function getBackgroundStyles(background?: string | SectionBackground): {
  className: string;
  style: React.CSSProperties;
} {
  if (!background) {
    return { className: "", style: {} };
  }

  // Legacy string format
  if (typeof background === "string") {
    return {
      className: backgroundPresetClasses[background] || "",
      style: {},
    };
  }

  // Object format
  switch (background.type) {
    case "none":
      return { className: "", style: {} };

    case "color":
      // Check if it's a preset color name
      if (background.color && backgroundPresetClasses[background.color]) {
        return {
          className: backgroundPresetClasses[background.color],
          style: {},
        };
      }
      // Custom color
      return {
        className: "",
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
        return { className: "", style: { background: gradientCss } };
      }
      return { className: "", style: {} };

    case "image":
      if (background.image?.src) {
        const imageStyle: React.CSSProperties = {
          backgroundImage: `url(${background.image.src})`,
          backgroundSize: background.image.size || "cover",
          backgroundPosition: background.image.position || "center",
          backgroundRepeat: background.image.repeat || "no-repeat",
        };
        return { className: "", style: imageStyle };
      }
      return { className: "", style: {} };

    default:
      return { className: "", style: {} };
  }
}

/**
 * Sortable Section Component
 *
 * Wraps a section with drag-and-drop functionality and section-level controls.
 * Renders content exactly as it will appear on the live site (WYSIWYG).
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

  // Get section wrapper styles (paddingTop, paddingBottom, background)
  const effectivePaddingTop = section.paddingTop || section.spacing || "md";
  const effectivePaddingBottom =
    section.paddingBottom || section.spacing || "md";
  const sectionPaddingTop =
    paddingTopClasses[effectivePaddingTop] || paddingTopClasses.md;
  const sectionPaddingBottom =
    paddingBottomClasses[effectivePaddingBottom] || paddingBottomClasses.md;
  const sectionAlign = alignClasses[section.align || "left"] || "";
  const sectionMinHeight = minHeightClasses[section.minHeight || "none"] || "";
  const sectionVerticalAlign =
    section.minHeight && section.minHeight !== "none"
      ? verticalAlignClasses[section.verticalAlign || "top"] || ""
      : "";

  // Get section border and shadow classes
  const sectionBorderTop =
    section.borderTop && section.borderTop !== "none"
      ? `border-t-[${section.borderTop === "thin" ? "1px" : section.borderTop === "medium" ? "2px" : "4px"}] border-t-gray-200`
      : "";
  const sectionBorderBottom =
    section.borderBottom && section.borderBottom !== "none"
      ? `border-b-[${section.borderBottom === "thin" ? "1px" : section.borderBottom === "medium" ? "2px" : "4px"}] border-b-gray-200`
      : "";
  const sectionShadow = sectionShadowClasses[section.shadow || "none"] || "";

  // Get background styles
  const { className: bgClassName, style: bgStyle } = getBackgroundStyles(
    section.background,
  );

  // Helper to get responsive container value
  const getContainerValue = <T,>(field: string, defaultValue: T): T => {
    if (!section.container) return defaultValue;
    const containerData = section.container as unknown as Record<string, unknown>;
    return getResponsiveValue<T>(containerData, field, breakpoint) ?? defaultValue;
  };

  // Helper to get responsive layout value
  const getLayoutValue = <T,>(field: string, defaultValue: T): T => {
    if (!section.container?.layout) return defaultValue;
    const layoutData = section.container.layout as unknown as Record<string, unknown>;
    return getResponsiveValue<T>(layoutData, field, breakpoint) ?? defaultValue;
  };

  // Check if any block in this section is selected
  const hasSelectedBlock = selectedBlockKey
    ? section.blocks.some((block) => block._key === selectedBlockKey)
    : false;

  // Track popover open state to keep buttons visible
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Get section width class (constrains entire section including background)
  // Uses section.width (from Section Settings), not container.maxWidth
  const sectionWidthClass = section.width && section.width !== "full"
    ? widthClasses[section.width] || ""
    : "";

  // Build inner container classes (for layout only, not width)
  const innerContainerClasses: string[] = [];

  if (section.container?.layout) {
    const type = getLayoutValue<string>("type", "stack");
    const direction = getLayoutValue<string>("direction", "column");
    const gap = getLayoutValue<string>("gap", "md");
    const columns = section.container.layout.columns;
    const justify = section.container.layout.justify;
    const align = section.container.layout.align;

    if (type === "flex") {
      innerContainerClasses.push("flex");
      innerContainerClasses.push(direction === "row" ? "flex-row" : "flex-col");
    } else if (type === "grid") {
      innerContainerClasses.push("grid");
      if (typeof columns === "number") {
        innerContainerClasses.push(`grid-cols-${columns}`);
      } else if (columns === "auto-fit") {
        innerContainerClasses.push(
          "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
        );
      }
    } else {
      // stack (default)
      innerContainerClasses.push("flex flex-col");
    }

    if (gap) {
      innerContainerClasses.push(gapClasses[gap] || "");
    }
    if (justify) {
      innerContainerClasses.push(`justify-${justify}`);
    }
    if (align) {
      innerContainerClasses.push(`items-${align}`);
    }
  }

  // Get container padding (for inner container)
  const containerPaddingX = section.container
    ? getContainerValue<string>("paddingX", "sm")
    : "sm";
  const containerPaddingY = section.container
    ? getContainerValue<string | undefined>("paddingY", undefined)
    : undefined;

  // Build container style
  const containerInlineStyle: React.CSSProperties = {};
  if (section.container?.background) {
    if (typeof section.container.background === "string" && section.container.background !== "transparent") {
      containerInlineStyle.backgroundColor = section.container.background;
    }
    // TODO: Support SectionBackground object for container (gradient/image)
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
      {/* Section Visual - constrained width with SECTION background, padding, border */}
      <div
        className={cn(
          "section-visual",
          // Width constraint (constrains entire visible section)
          sectionWidthClass,
          sectionWidthClass && "mx-auto",
          // SECTION Background
          bgClassName,
          // SECTION Padding (top/bottom only - from section settings)
          sectionPaddingTop,
          sectionPaddingBottom,
          // SECTION Border & shadow
          sectionBorderTop,
          sectionBorderBottom,
          sectionShadow,
          // Min height & alignment
          sectionMinHeight,
          sectionMinHeight && "flex flex-col",
          sectionVerticalAlign,
          sectionAlign,
        )}
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

        {/* Inner Container - applies CONTAINER styles and layout */}
        <div
          className={cn(
            "section-container",
            // Container padding
            containerPaddingXClasses[containerPaddingX] || "px-4",
            containerPaddingY && containerPaddingYClasses[containerPaddingY],
            section.container?.paddingTop && paddingTopClasses[section.container.paddingTop],
            section.container?.paddingBottom && paddingBottomClasses[section.container.paddingBottom],
            // Container border
            section.container?.borderTop && section.container.borderTop !== "none" &&
              `border-t-[${section.container.borderTop === "thin" ? "1px" : section.container.borderTop === "medium" ? "2px" : "4px"}] border-t-gray-200`,
            section.container?.borderBottom && section.container.borderBottom !== "none" &&
              `border-b-[${section.container.borderBottom === "thin" ? "1px" : section.container.borderBottom === "medium" ? "2px" : "4px"}] border-b-gray-200`,
            // Container effects
            section.container?.borderRadius && borderRadiusClasses[section.container.borderRadius],
            section.container?.shadow && shadowClasses[section.container.shadow],
            // Container min height
            section.container?.minHeight && minHeightClasses[section.container.minHeight],
            section.container?.minHeight && section.container.minHeight !== "none" && "flex flex-col",
            section.container?.verticalAlign && section.container.minHeight && verticalAlignClasses[section.container.verticalAlign],
            // Container alignment
            section.container?.align && alignClasses[section.container.align],
            // Layout classes
            ...innerContainerClasses,
          )}
          style={Object.keys(containerInlineStyle).length > 0 ? containerInlineStyle : undefined}
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
