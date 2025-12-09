import type { TextBlockData } from "@/lib/blocks";
import { Text } from "@/components/ui/text";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";

type TextBlockProps = {
  data: TextBlockData;
};

// Size class maps for responsive
const sizeClasses: Record<string, string> = {
  xs: "text-size-xs",
  sm: "text-size-sm",
  base: "text-size-base",
  lg: "text-size-lg",
  xl: "text-size-xl",
  "2xl": "text-size-2xl",
  "3xl": "text-size-3xl",
  "4xl": "text-size-4xl",
};

// Align class maps for responsive
const alignClasses: Record<string, string> = {
  left: "text-align-left",
  center: "text-align-center",
  right: "text-align-right",
  justify: "text-align-justify",
};

/**
 * TextBlock - Data adapter for Text UI component
 * Content block (leaf node) - cannot have children
 * Wraps ui/Text component with CMS data
 *
 * Supports responsive overrides for size and alignment
 */
export function TextBlock({ data }: TextBlockProps) {
  const { content, size = "base", align = "left", variant = "default" } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    return (
      <Text as="p" size={size} align={align} variant={variant}>
        {content}
      </Text>
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
    generateResponsiveClasses(sizeClasses, sizeValues, size),
    generateResponsiveClasses(alignClasses, alignValues, align),
  );

  return (
    <Text as="p" variant={variant} className={responsiveClasses}>
      {content}
    </Text>
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
