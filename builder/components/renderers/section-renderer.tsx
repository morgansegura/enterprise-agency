import * as React from "react";
import type { Section } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "./block-renderer";
import { stylesToCSSVars, hasStyles } from "@/lib/types/section";

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
      className={cn(sectionBackground, sectionAlign)}
      data-block-key={section._key}
      data-block-label={`Section ${sectionIndex + 1}`}
      data-styled={hasStyles(section.styles) || undefined}
      style={hasStyles(section.styles) ? (stylesToCSSVars(section.styles) as React.CSSProperties) : undefined}
    >
      <div className={cn(sectionSpacing, sectionWidth)}>
        {containers.map((container, containerIndex) => {
          const containerStyled = hasStyles(container.styles);
          const containerVars = containerStyled ? stylesToCSSVars(container.styles) : undefined;
          return (
          <div
            key={container._key}
            className="space-y-4"
            data-block-key={container._key}
            data-block-label={`Container ${containerIndex + 1}`}
            data-styled={containerStyled || undefined}
            style={containerVars ? (containerVars as React.CSSProperties) : undefined}
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
