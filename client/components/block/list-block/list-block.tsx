import type { ListBlockData } from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./list-block.css";

type ListBlockProps = {
  data: ListBlockData;
};

// Spacing class maps for responsive
const spacingClasses: Record<string, string> = {
  tight: "list-spacing-tight",
  normal: "list-spacing-normal",
  relaxed: "list-spacing-relaxed",
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
 * ListBlock - Renders ordered or unordered lists
 * Content block (leaf node) - cannot have children
 *
 * Supports responsive overrides for spacing
 */
export function ListBlock({ data }: ListBlockProps) {
  const {
    items,
    ordered = false,
    style = "default",
    spacing = "normal",
  } = data;

  const ListTag = ordered ? "ol" : "ul";

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    return (
      <ListTag data-slot="list-block" data-style={style} data-spacing={spacing}>
        {items.map((item, index) => (
          <li key={index} data-slot="list-block-item">
            {item}
          </li>
        ))}
      </ListTag>
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
    <ListTag
      data-slot="list-block"
      data-style={style}
      className={responsiveClasses}
    >
      {items.map((item, index) => (
        <li key={index} data-slot="list-block-item">
          {item}
        </li>
      ))}
    </ListTag>
  );
}
