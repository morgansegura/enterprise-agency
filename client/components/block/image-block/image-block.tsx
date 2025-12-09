import type { ImageBlockData } from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import Image from "next/image";
import "./image-block.css";

type ImageBlockProps = {
  data: ImageBlockData;
};

// Object fit class maps for responsive
const objectFitClasses: Record<string, string> = {
  contain: "img-fit-contain",
  cover: "img-fit-cover",
  fill: "img-fit-fill",
  none: "img-fit-none",
};

/**
 * ImageBlock - Renders images with optional captions
 * Content block (leaf node) - cannot have children
 *
 * Supports responsive overrides for objectFit
 */
export function ImageBlock({ data }: ImageBlockProps) {
  const { url, alt = "", caption, width, height, objectFit = "cover" } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  if (!url || !alt) return null;

  // Simple rendering without responsive overrides
  if (!hasOverrides) {
    return (
      <figure data-slot="image-block">
        <div data-slot="image-block-wrapper" data-object-fit={objectFit}>
          <Image
            src={url}
            alt={alt}
            width={width || 1200}
            height={height || 630}
            data-slot="image-block-image"
          />
        </div>
        {caption ? (
          <figcaption data-slot="image-block-caption">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  // Get responsive values for objectFit
  const fitValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "objectFit",
  );

  // Generate responsive classes
  const responsiveClasses = generateResponsiveClasses(
    objectFitClasses,
    fitValues,
    objectFit,
  );

  return (
    <figure data-slot="image-block">
      <div data-slot="image-block-wrapper" className={responsiveClasses}>
        <Image
          src={url}
          alt={alt}
          width={width || 1200}
          height={height || 630}
          data-slot="image-block-image"
        />
      </div>
      {caption ? (
        <figcaption data-slot="image-block-caption">{caption}</figcaption>
      ) : null}
    </figure>
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
