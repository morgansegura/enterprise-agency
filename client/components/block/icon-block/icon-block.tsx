import type { IconBlockData } from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./icon-block.css";

type IconBlockProps = {
  data: IconBlockData;
};

// Size class maps for responsive
const sizeClasses: Record<string, string> = {
  sm: "icon-size-sm",
  md: "icon-size-md",
  lg: "icon-size-lg",
  xl: "icon-size-xl",
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
 * IconBlock - Renders icons with optional text
 * Content block (leaf node) - cannot have children
 *
 * Supports responsive overrides for size
 */
export function IconBlock({ data }: IconBlockProps) {
  const { icon, size = "md", color, text, position = "top" } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    return (
      <div
        data-slot="icon-block"
        data-size={size}
        data-position={position}
        style={color ? { color } : undefined}
      >
        <span data-slot="icon-block-icon" aria-hidden="true">
          {icon}
        </span>
        {text ? <span data-slot="icon-block-text">{text}</span> : null}
      </div>
    );
  }

  // Get responsive values
  const sizeValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "size",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    generateResponsiveClasses(sizeClasses, sizeValues, size),
  );

  return (
    <div
      data-slot="icon-block"
      data-position={position}
      className={responsiveClasses}
      style={color ? { color } : undefined}
    >
      <span data-slot="icon-block-icon" aria-hidden="true">
        {icon}
      </span>
      {text ? <span data-slot="icon-block-text">{text}</span> : null}
    </div>
  );
}
