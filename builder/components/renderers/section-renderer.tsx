import type { Section } from "@/lib/hooks/use-pages";
import { cn } from "@/lib/utils";
import { BlockRenderer } from "./block-renderer";

interface SectionRendererProps {
  section: Section;
  breakpoint?: "desktop" | "tablet" | "mobile";
}

const backgroundClasses: Record<string, string> = {
  none: "",
  white: "bg-white",
  gray: "bg-gray-50 dark:bg-gray-900",
  dark: "bg-gray-900 text-white dark:bg-gray-950",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

const spacingClasses: Record<string, string> = {
  none: "py-0",
  xs: "py-4",
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
  xl: "py-20",
  "2xl": "py-24",
};

const widthClasses: Record<string, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-full",
};

const alignClasses: Record<string, string> = {
  left: "text-left",
  center: "text-center mx-auto",
  right: "text-right ml-auto",
};

/**
 * SectionRenderer - Renders a page section with its blocks
 *
 * Applies section-level styling (background, spacing, width, alignment)
 * and renders all child blocks.
 */
export function SectionRenderer({ section, breakpoint = "desktop" }: SectionRendererProps) {
  const {
    background = "none",
    spacing = "md",
    width = "default",
    align = "left",
    blocks = [],
  } = section;

  return (
    <section
      className={cn(
        backgroundClasses[background] || "",
        spacingClasses[spacing] || spacingClasses.md,
      )}
    >
      <div
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          widthClasses[width] || widthClasses.default,
          alignClasses[align] || "",
        )}
      >
        <div className="space-y-6">
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
