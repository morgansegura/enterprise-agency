import type {
  ContentBlock,
  ShallowContainerBlock,
  GridLayoutData,
} from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./grid-block.css";

type GridBlockProps = {
  data: GridLayoutData;
  blocks: (ContentBlock | ShallowContainerBlock)[];
  renderBlock: (block: ContentBlock | ShallowContainerBlock) => React.ReactNode;
};

// Column class maps for responsive
const columnClasses: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
  "3": "grid-cols-3",
  "4": "grid-cols-4",
  "5": "grid-cols-5",
  "6": "grid-cols-6",
};

// Gap class maps for responsive
const gapClasses: Record<string, string> = {
  none: "grid-gap-none",
  xs: "grid-gap-xs",
  sm: "grid-gap-sm",
  md: "grid-gap-md",
  lg: "grid-gap-lg",
  xl: "grid-gap-xl",
  "2xl": "grid-gap-2xl",
};

/**
 * GridBlock - Arranges child blocks in a responsive CSS grid
 * Container block - can hold content blocks or shallow container blocks
 *
 * Supports responsive overrides for columns and gap
 */
export function GridBlock({ data, blocks, renderBlock }: GridBlockProps) {
  const { columns, gap = "md", align, justify } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // Get base column value (handle both number and object types)
  const getBaseColValue = (): string => {
    if (typeof columns === "number") return String(columns);
    if (typeof columns === "object" && columns !== null) {
      // ResponsiveColumns object - use desktop value as base
      return String(columns.desktop || columns.tablet || columns.mobile || 2);
    }
    return "2";
  };

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    const colValue = getBaseColValue();
    return (
      <div
        data-slot="grid-block"
        data-gap={gap}
        data-align={align}
        data-justify={justify}
        className={columnClasses[colValue] || "grid-cols-2"}
      >
        {blocks.map((block) => renderBlock(block))}
      </div>
    );
  }

  // Get responsive values
  const colValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "columns",
  );
  const gapValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "gap",
  );

  // Generate responsive classes
  const colValue = getBaseColValue();
  const responsiveClasses = cn(
    generateResponsiveClasses(columnClasses, colValues, colValue),
    generateResponsiveClasses(gapClasses, gapValues, gap),
  );

  return (
    <div
      data-slot="grid-block"
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
