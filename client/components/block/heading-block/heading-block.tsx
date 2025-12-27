import type { HeadingBlockData } from "@/lib/blocks";
import { Heading } from "@/components/ui/heading";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";

type HeadingBlockProps = {
  data: HeadingBlockData;
};

// Size class maps for responsive overrides
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

// Align class maps for responsive overrides
const alignClasses: Record<string, string> = {
  left: "heading-align-left",
  center: "heading-align-center",
  right: "heading-align-right",
};

// Map opacity number to preset string
function getOpacityPreset(opacity: number | undefined): string | undefined {
  if (opacity === undefined) return undefined;
  // Map to nearest preset
  if (opacity <= 10) return "10";
  if (opacity <= 25) return "25";
  if (opacity <= 50) return "50";
  if (opacity <= 75) return "75";
  if (opacity <= 90) return "90";
  return "100";
}

/**
 * HeadingBlock - Data adapter for Heading UI component
 * Content block (leaf node) - cannot have children
 * Wraps ui/Heading component with CMS data
 *
 * Supports comprehensive typography properties via data-* attributes:
 * - Size & Spacing: size, letterSpacing, lineHeight
 * - Style: weight, fontStyle, textTransform, textDecoration, variant
 * - Font: color (presets only)
 * - Layout: align, maxWidth, whiteSpace
 * - Effects: opacity
 * - Responsive overrides for size and align
 */
export function HeadingBlock({ data }: HeadingBlockProps) {
  const {
    text,
    level = "h2",
    size,
    align = "left",
    weight,
    variant = "default",
    letterSpacing,
    lineHeight,
    fontStyle,
    textTransform,
    textDecoration,
    color,
    maxWidth,
    whiteSpace,
    opacity,
  } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // Convert opacity number to preset string
  const opacityPreset = getOpacityPreset(opacity);

  // If no responsive overrides, use simple rendering with data-* attributes
  if (!hasOverrides) {
    return (
      <Heading
        as={level}
        size={size}
        align={align}
        weight={weight}
        variant={variant}
        letterSpacing={letterSpacing}
        lineHeight={lineHeight}
        fontStyle={fontStyle}
        textTransform={textTransform}
        textDecoration={textDecoration}
        color={
          color as
            | "default"
            | "primary"
            | "secondary"
            | "muted"
            | "accent"
            | "destructive"
            | undefined
        }
        maxWidth={
          maxWidth as
            | "xs"
            | "sm"
            | "md"
            | "lg"
            | "xl"
            | "2xl"
            | "prose"
            | "none"
            | undefined
        }
        whiteSpace={whiteSpace}
        opacity={
          opacityPreset as "10" | "25" | "50" | "75" | "90" | "100" | undefined
        }
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
    generateResponsiveClasses(sizeClasses, sizeValues, size),
    generateResponsiveClasses(alignClasses, alignValues, align),
  );

  return (
    <Heading
      as={level}
      weight={weight}
      variant={variant}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      fontStyle={fontStyle}
      textTransform={textTransform}
      textDecoration={textDecoration}
      color={
        color as
          | "default"
          | "primary"
          | "secondary"
          | "muted"
          | "accent"
          | "destructive"
          | undefined
      }
      maxWidth={
        maxWidth as
          | "xs"
          | "sm"
          | "md"
          | "lg"
          | "xl"
          | "2xl"
          | "prose"
          | "none"
          | undefined
      }
      whiteSpace={whiteSpace}
      opacity={
        opacityPreset as "10" | "25" | "50" | "75" | "90" | "100" | undefined
      }
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
