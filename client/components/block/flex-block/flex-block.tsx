import type {
  ContentBlock,
  ShallowContainerBlock,
  FlexLayoutData,
} from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./flex-block.css";

type FlexBlockProps = {
  data: FlexLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

// Direction class maps for responsive
const directionClasses: Record<string, string> = {
  row: "flex-dir-row",
  col: "flex-dir-col",
  column: "flex-dir-col",
  "row-reverse": "flex-dir-row-reverse",
  "column-reverse": "flex-dir-col-reverse",
};

// Gap class maps for responsive
const gapClasses: Record<string, string> = {
  none: "flex-gap-none",
  xs: "flex-gap-xs",
  sm: "flex-gap-sm",
  md: "flex-gap-md",
  lg: "flex-gap-lg",
  xl: "flex-gap-xl",
  "2xl": "flex-gap-2xl",
};

/**
 * FlexBlock - Arranges child blocks using flexbox
 * Container block - can hold content blocks or shallow container blocks
 *
 * Supports responsive overrides for direction and gap
 */
export function FlexBlock({ data, blocks, renderBlock }: FlexBlockProps) {
  const { direction = "row", wrap = false, gap = "md", align, justify } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // Simple rendering without responsive overrides
  if (!hasOverrides) {
    return (
      <div
        data-slot="flex-block"
        data-direction={direction}
        data-wrap={wrap ? "wrap" : "nowrap"}
        data-gap={gap}
        data-align={align}
        data-justify={justify}
      >
        {blocks.map((block) => renderBlock(block))}
      </div>
    );
  }

  // Get responsive values
  const directionValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "direction",
  );
  const gapValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "gap",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    generateResponsiveClasses(directionClasses, directionValues, direction),
    generateResponsiveClasses(gapClasses, gapValues, gap),
  );

  return (
    <div
      data-slot="flex-block"
      data-wrap={wrap ? "wrap" : "nowrap"}
      data-align={align}
      data-justify={justify}
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
