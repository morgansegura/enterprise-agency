import type {
  ContentBlock,
  ShallowContainerBlock,
  StackLayoutData,
} from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import "./stack-block.css";

type StackBlockProps = {
  data: StackLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

// Gap class maps for responsive
const gapClasses: Record<string, string> = {
  none: "stack-gap-none",
  xs: "stack-gap-xs",
  sm: "stack-gap-sm",
  md: "stack-gap-md",
  lg: "stack-gap-lg",
  xl: "stack-gap-xl",
  "2xl": "stack-gap-2xl",
};

/**
 * StackBlock - Simplified vertical stacking (flex column)
 * Container block - can hold content blocks or shallow container blocks
 *
 * Supports responsive overrides for gap
 */
export function StackBlock({ data, blocks, renderBlock }: StackBlockProps) {
  const { gap = "md", align = "stretch" } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // Simple rendering without responsive overrides
  if (!hasOverrides) {
    return (
      <div data-slot="stack-block" data-gap={gap} data-align={align}>
        {blocks.map((block) => renderBlock(block))}
      </div>
    );
  }

  // Get responsive values
  const gapValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "gap",
  );

  // Generate responsive classes
  const responsiveClasses = generateResponsiveClasses(
    gapClasses,
    gapValues,
    gap,
  );

  return (
    <div
      data-slot="stack-block"
      data-align={align}
      className={responsiveClasses}
    >
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
