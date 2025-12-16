"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Section, SectionBackground } from "@/lib/hooks/use-pages";
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

  // Build container classes
  const containerClasses: string[] = ["mx-auto px-4"];
  const containerStyle: React.CSSProperties = {};

  if (section.container) {
    const { container } = section;

    // Max width
    if (container.maxWidth) {
      containerClasses.push(containerWidthClasses[container.maxWidth] || "");
    } else {
      containerClasses.push("max-w-7xl"); // Default wide
    }

    // Padding
    if (container.paddingX) {
      containerClasses.push(containerPaddingXClasses[container.paddingX] || "");
    }
    if (container.paddingY) {
      containerClasses.push(containerPaddingYClasses[container.paddingY] || "");
    }

    // Border radius
    if (container.borderRadius) {
      containerClasses.push(borderRadiusClasses[container.borderRadius] || "");
    }

    // Shadow
    if (container.shadow) {
      containerClasses.push(shadowClasses[container.shadow] || "");
    }

    // Background color
    if (container.background && container.background !== "transparent") {
      containerStyle.backgroundColor = container.background;
    }

    // Layout
    if (container.layout) {
      const { type, direction, gap, columns, justify, align } =
        container.layout;

      if (type === "flex") {
        containerClasses.push("flex");
        containerClasses.push(direction === "row" ? "flex-row" : "flex-col");
      } else if (type === "grid") {
        containerClasses.push("grid");
        if (typeof columns === "number") {
          containerClasses.push(`grid-cols-${columns}`);
        } else if (columns === "auto-fit") {
          containerClasses.push(
            "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
          );
        }
      } else {
        // stack (default)
        containerClasses.push("flex flex-col");
      }

      if (gap) {
        containerClasses.push(gapClasses[gap] || "");
      }
      if (justify) {
        containerClasses.push(`justify-${justify}`);
      }
      if (align) {
        containerClasses.push(`items-${align}`);
      }
    }
  } else {
    // Default container width
    const defaultWidth = section.width || "wide";
    containerClasses.push(widthClasses[defaultWidth] || widthClasses.wide);
  }

  // Check if any block in this section is selected
  const hasSelectedBlock = selectedBlockKey
    ? section.blocks.some((block) => block._key === selectedBlockKey)
    : false;

  // Track popover open state to keep buttons visible
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Combine section styles
  const sectionStyle: React.CSSProperties = {
    ...bgStyle,
    ...style,
  };

  return (
    <div
      ref={setNodeRef}
      style={sectionStyle}
      className={cn(
        "sortable-section",
        isDragging && "is-dragging",
        hasSelectedBlock && "has-selected-block",
        isPopoverOpen && "is-popover-open",
        // Section wrapper styles
        sectionPaddingTop,
        sectionPaddingBottom,
        sectionBorderTop,
        sectionBorderBottom,
        sectionShadow,
        bgClassName,
      )}
    >
      {/* Section Content with border */}
      <div className={cn("section-content", sectionAlign)}>
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

        {/* Container - applies container settings */}
        <div
          className={cn("section-container", ...containerClasses)}
          style={
            Object.keys(containerStyle).length > 0 ? containerStyle : undefined
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
