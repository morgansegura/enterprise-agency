import type {
  ContentBlock,
  ShallowContainerBlock,
  ContainerLayoutData,
} from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./container-block.css";

type ContainerBlockProps = {
  data: ContainerLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

// Width class maps for responsive
const widthClasses: Record<string, string> = {
  narrow: "container-width-narrow",
  wide: "container-width-wide",
  full: "container-width-full",
};

// Spacing class maps for responsive
const spacingClasses: Record<string, string> = {
  none: "container-spacing-none",
  xs: "container-spacing-xs",
  sm: "container-spacing-sm",
  md: "container-spacing-md",
  lg: "container-spacing-lg",
  xl: "container-spacing-xl",
  "2xl": "container-spacing-2xl",
};

/**
 * ContainerBlock - Width constraint wrapper without layout logic
 * Container block - can hold content blocks or shallow container blocks
 *
 * Supports responsive overrides for width and spacing
 */
export function ContainerBlock({
  data,
  blocks,
  renderBlock,
}: ContainerBlockProps) {
  const { width = "wide", spacing = "none" } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // Simple rendering without responsive overrides
  if (!hasOverrides) {
    return (
      <div
        data-slot="container-block"
        data-width={width}
        data-spacing={spacing}
      >
        {blocks.map((block) => renderBlock(block))}
      </div>
    );
  }

  // Get responsive values
  const widthValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "width",
  );
  const spacingValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "spacing",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    generateResponsiveClasses(widthClasses, widthValues, width),
    generateResponsiveClasses(spacingClasses, spacingValues, spacing),
  );

  return (
    <div data-slot="container-block" className={responsiveClasses}>
      {blocks.map((block) => renderBlock(block))}
    </div>
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
