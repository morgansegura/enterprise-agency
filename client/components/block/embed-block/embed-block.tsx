import type { EmbedBlockData } from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import "./embed-block.css";

type EmbedBlockProps = {
  data: EmbedBlockData;
};

// Aspect ratio class maps for responsive
const aspectClasses: Record<string, string> = {
  "16:9": "embed-aspect-16-9",
  "4:3": "embed-aspect-4-3",
  "1:1": "embed-aspect-1-1",
  auto: "embed-aspect-auto",
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
 * EmbedBlock - Renders generic iframe embeds
 * Content block (leaf node) - cannot have children
 *
 * Supports responsive overrides for aspectRatio
 */
export function EmbedBlock({ data }: EmbedBlockProps) {
  const { url, title, aspectRatio = "16:9", height } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // If no responsive overrides, use simple rendering
  if (!hasOverrides) {
    return (
      <div data-slot="embed-block">
        <div
          data-slot="embed-block-wrapper"
          data-aspect-ratio={aspectRatio}
          style={height ? { height: `${height}px` } : undefined}
        >
          <iframe
            data-slot="embed-block-iframe"
            src={url}
            title={title || "Embedded content"}
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Get responsive values
  const aspectValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "aspectRatio",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    generateResponsiveClasses(aspectClasses, aspectValues, aspectRatio),
  );

  return (
    <div data-slot="embed-block">
      <div
        data-slot="embed-block-wrapper"
        className={responsiveClasses}
        style={height ? { height: `${height}px` } : undefined}
      >
        <iframe
          data-slot="embed-block-iframe"
          src={url}
          title={title || "Embedded content"}
          allowFullScreen
        />
      </div>
    </div>
  );
}
