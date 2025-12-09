import type { DividerBlockData } from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./divider-block.css";

type DividerBlockProps = {
  data: DividerBlockData;
};

// Spacing class maps for responsive
const spacingClasses: Record<string, string> = {
  sm: "divider-spacing-sm",
  md: "divider-spacing-md",
  lg: "divider-spacing-lg",
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
 * DividerBlock - Renders a horizontal divider/separator
 * Content block (leaf node) - cannot have children
 *
 * Supports responsive overrides for spacing
 */
export function DividerBlock({ data }: DividerBlockProps) {
  const {
    style = "solid",
    weight = "normal",
    spacing = "md",
    variant = "default",
  } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    return (
      <hr
        data-slot="divider-block"
        data-style={style}
        data-weight={weight}
        data-spacing={spacing}
        data-variant={variant}
      />
    );
  }

  // Get responsive values
  const spacingValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "spacing",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    generateResponsiveClasses(spacingClasses, spacingValues, spacing),
  );

  return (
    <hr
      data-slot="divider-block"
      data-style={style}
      data-weight={weight}
      data-variant={variant}
      className={responsiveClasses}
    />
  );
}
