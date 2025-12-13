import type { Section } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "./block-renderer";

interface SectionRendererProps {
  section: Section;
  breakpoint?: "desktop" | "tablet" | "mobile";
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
 * SectionRenderer - Renders a page section with its blocks
 *
 * Applies section-level styling (background, spacing, width, alignment)
 * and renders all child blocks.
 *
 * Matches the editor's SortableSection component exactly for WYSIWYG parity.
 */
export function SectionRenderer({
  section,
  breakpoint = "desktop",
}: SectionRendererProps) {
  const {
    background = "none",
    spacing = "md",
    width = "full",
    align = "left",
    blocks = [],
  } = section;

  const sectionBackground = backgroundClasses[background] || "";
  const sectionSpacing = spacingClasses[spacing] || spacingClasses.md;
  const sectionWidth = widthClasses[width] || widthClasses.full;
  const sectionAlign = alignClasses[align] || "";

  return (
    <section className={cn(sectionBackground, sectionAlign)}>
      <div className={cn(sectionSpacing, sectionWidth)}>
        <div className="space-y-4">
          {blocks.map((block) => (
            <BlockRenderer
              key={block._key}
              block={block}
              breakpoint={breakpoint}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
