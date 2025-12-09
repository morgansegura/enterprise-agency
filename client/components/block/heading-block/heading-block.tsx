import type { HeadingBlockData } from "@/lib/blocks";
import { Heading } from "@/components/ui/heading";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";

type HeadingBlockProps = {
  data: HeadingBlockData;
};

// Size class maps for responsive
const sizeClasses: Record<string, string> = {
  xs: "heading-size-xs",
  sm: "heading-size-sm",
  base: "heading-size-base",
  lg: "heading-size-lg",
  xl: "heading-size-xl",
  "2xl": "heading-size-2xl",
  "3xl": "heading-size-3xl",
  "4xl": "heading-size-4xl",
  "5xl": "heading-size-5xl",
  "6xl": "heading-size-6xl",
  "7xl": "heading-size-7xl",
  "8xl": "heading-size-8xl",
  "9xl": "heading-size-9xl",
};

// Align class maps for responsive
const alignClasses: Record<string, string> = {
  left: "heading-align-left",
  center: "heading-align-center",
  right: "heading-align-right",
};

/**
 * HeadingBlock - Data adapter for Heading UI component
 * Content block (leaf node) - cannot have children
 * Wraps ui/Heading component with CMS data
 *
 * Supports responsive overrides:
 * - size: Different sizes per breakpoint
 * - align: Different alignment per breakpoint
 */
export function HeadingBlock({ data }: HeadingBlockProps) {
  const {
    text,
    level = "h2",
    size,
    align = "left",
    weight,
    variant = "default",
  } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    return (
      <Heading
        as={level}
        size={size}
        align={align}
        weight={weight}
        variant={variant}
      >
        {text}
      </Heading>
    );
  }

  // Get responsive values
  const sizeValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "size",
  );
  const alignValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "align",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    // Size responsive classes
    generateResponsiveClasses(sizeClasses, sizeValues, size),
    // Align responsive classes
    generateResponsiveClasses(alignClasses, alignValues, align),
  );

  return (
    <Heading
      as={level}
      // Don't pass size/align as props since we handle them via classes
      weight={weight}
      variant={variant}
      className={responsiveClasses}
    >
      {text}
    </Heading>
  );
}

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

  // Determine effective values at each breakpoint
  // Mobile-first: mobile -> tablet -> desktop
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
