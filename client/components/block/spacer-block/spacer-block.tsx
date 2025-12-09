import type { SpacerBlockData } from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./spacer-block.css";

type SpacerBlockProps = {
  data: SpacerBlockData;
};

// Height class maps for responsive
const heightClasses: Record<string, string> = {
  xs: "spacer-h-xs",
  sm: "spacer-h-sm",
  md: "spacer-h-md",
  lg: "spacer-h-lg",
  xl: "spacer-h-xl",
  "2xl": "spacer-h-2xl",
  "3xl": "spacer-h-3xl",
};

/**
 * Generate responsive CSS classes using Tailwind prefixes
 */
function generateResponsiveClasses(
  classMap: Record<string, string>,
  values: { base?: string; tablet?: string; mobile?: string },
  defaultValue?: string,
): string {
  const classes: string[] = [];
  const { base, tablet, mobile } = values;

  // Determine effective values at each breakpoint (mobile-first)
  const mobileValue = mobile ?? tablet ?? base ?? defaultValue;
  const tabletValue = tablet ?? base ?? defaultValue;
  const desktopValue = base ?? defaultValue;

  // If all values are the same, just return base class
  if (mobileValue === tabletValue && tabletValue === desktopValue) {
    if (desktopValue && classMap[desktopValue]) {
      return classMap[desktopValue];
    }
    return "";
  }

  // Mobile base (no prefix)
  if (mobileValue && classMap[mobileValue]) {
    classes.push(classMap[mobileValue]);
  }

  // Tablet override (md: prefix)
  if (tabletValue && tabletValue !== mobileValue && classMap[tabletValue]) {
    classes.push(`md:${classMap[tabletValue]}`);
  }

  // Desktop override (lg: prefix)
  if (desktopValue && desktopValue !== tabletValue && classMap[desktopValue]) {
    classes.push(`lg:${classMap[desktopValue]}`);
  }

  return classes.join(" ");
}

/**
 * SpacerBlock - Renders vertical spacing
 * Content block (leaf node) - cannot have children
 *
 * Supports responsive overrides for height
 */
export function SpacerBlock({ data }: SpacerBlockProps) {
  const { height = "md" } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    return <div data-slot="spacer-block" data-height={height} />;
  }

  // Get responsive values
  const heightValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "height",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    generateResponsiveClasses(heightClasses, heightValues, height),
  );

  return <div data-slot="spacer-block" className={responsiveClasses} />;
}
