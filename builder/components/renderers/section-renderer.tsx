// Section renderer for builder preview canvas
import type { Section } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "./block-renderer";
import { hasStyles } from "@/lib/types/section";
import { getElementClass } from "@enterprise/tokens";

interface SectionRendererProps {
  section: Section;
  breakpoint?: "desktop" | "tablet" | "mobile";
  onBlockChange?: (sectionIndex: number, containerIndex: number, blockIndex: number, updatedBlock: Section["containers"][0]["blocks"][0]) => void;
  sectionIndex?: number;
  isEditing?: boolean;
}

// Match editor's SortableSection classes exactly
const backgroundClasses: Record<string, string> = {
  none: "",
  white: "bg-white",
  gray: "bg-gray-100",
  dark: "bg-gray-900",
  primary: "bg-(--primary)",
  secondary: "bg-(--secondary)",
};

const spacingClasses: Record<string, string> = {
  none: "",
  xs: "py-2",
  sm: "py-4",
  md: "py-8",
  lg: "py-12",
  xl: "py-16",
  "2xl": "py-24",
};

const widthClasses: Record<string, string> = {
  narrow: "max-w-3xl mx-auto px-4",
  wide: "max-w-7xl mx-auto px-4",
  full: "w-full",
};

const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

/**
 * SectionRenderer - Renders a page section with its containers and blocks
 *
 * Applies section-level styling (background, spacing, width, alignment)
 * and renders all containers with their child blocks.
 *
 * Matches the editor's SortableSection component exactly for WYSIWYG parity.
 */
export function SectionRenderer({
  section,
  breakpoint = "desktop",
  onBlockChange,
  sectionIndex = 0,
  isEditing,
}: SectionRendererProps) {
  const {
    background = "none",
    paddingY = "md",
    width = "full",
    align = "left",
    containers = [],
  } = section;

  // Handle background - can be string or SectionBackground object
  const bgValue =
    typeof background === "string"
      ? background
      : background?.type === "color"
        ? background.color
        : "none";
  const sectionBackground = backgroundClasses[bgValue || "none"] || "";
  const sectionSpacing = spacingClasses[paddingY] || spacingClasses.md;
  const sectionWidth = widthClasses[width] || widthClasses.full;
  const sectionAlign = alignClasses[align] || "";

  return (
    <section
      className={cn(
        getElementClass(section._key),
        sectionBackground,
        sectionAlign,
      )}
      data-block-key={section._key}
      data-block-label={`Section ${sectionIndex + 1}`}
    >
      <div className={cn(sectionSpacing, sectionWidth)}>
        {containers.map((container, containerIndex) => {
          const _containerStyled = hasStyles(container.styles);

          // Build layout classes from container.layout
          const layout = container.layout as Record<string, unknown> | undefined;
          const layoutType = (layout?.type as string) || "stack";
          const layoutDirection = (layout?.direction as string) || "column";
          const layoutGap = (layout?.gap as string) || "md";

          const gapClasses: Record<string, string> = {
            xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8",
          };
          const layoutClasses = layoutType === "flex"
            ? `flex ${layoutDirection === "row" ? "flex-row" : "flex-col"} ${gapClasses[layoutGap] || "gap-4"}`
            : layoutType === "grid"
              ? `grid ${layout?.columns ? `grid-cols-${layout.columns}` : "grid-cols-2"} ${gapClasses[layoutGap] || "gap-4"}`
              : `flex flex-col ${gapClasses[layoutGap] || "gap-4"}`;

          return (
          <div
            key={container._key}
            className={cn(getElementClass(container._key), layoutClasses)}
            data-block-key={container._key}
            data-block-label={`Container ${containerIndex + 1}`}
          >
            {container.blocks?.map((block, blockIndex) => (
              <BlockRenderer
                key={block._key}
                block={block}
                breakpoint={breakpoint}
                isEditing={isEditing}
                onChange={
                  onBlockChange
                    ? (updatedBlock) =>
                        onBlockChange(
                          sectionIndex,
                          containerIndex,
                          blockIndex,
                          updatedBlock,
                        )
                    : undefined
                }
              />
            ))}
          </div>
          );
        })}
      </div>
    </section>
  );
}
