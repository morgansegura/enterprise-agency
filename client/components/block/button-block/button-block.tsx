import type { ButtonBlockData } from "@/lib/blocks";
import { getResponsiveValues, hasResponsiveOverrides } from "@/lib/responsive";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./button-block.css";

type ButtonBlockProps = {
  data: ButtonBlockData & {
    fullWidth?: boolean;
    _responsive?: {
      tablet?: { size?: string; fullWidth?: boolean };
      mobile?: { size?: string; fullWidth?: boolean };
    };
  };
};

// Size class maps for responsive
const sizeClasses: Record<string, string> = {
  sm: "btn-size-sm",
  default: "btn-size-default",
  lg: "btn-size-lg",
};

/**
 * ButtonBlock - Renders call-to-action buttons
 * Content block (leaf node) - cannot have children
 *
 * Supports responsive overrides for size and fullWidth
 */
export function ButtonBlock({ data }: ButtonBlockProps) {
  const {
    text,
    href,
    onClick,
    variant = "default",
    size = "default",
    fullWidth = false,
  } = data;

  // Check if we have responsive overrides
  const hasOverrides = hasResponsiveOverrides(data as Record<string, unknown>);

  // Simple rendering without responsive overrides
  if (!hasOverrides) {
    const buttonElement = (
      <Button
        asChild={!!href}
        variant={variant}
        size={size}
        data-slot="button-block"
        data-action={!href ? onClick : undefined}
        className={fullWidth ? "w-full" : ""}
      >
        {href ? <Link href={href}>{text}</Link> : text}
      </Button>
    );

    return buttonElement;
  }

  // Get responsive values
  const sizeValues = getResponsiveValues<string>(
    data as Record<string, unknown>,
    "size",
  );
  const fullWidthValues = getResponsiveValues<boolean>(
    data as Record<string, unknown>,
    "fullWidth",
  );

  // Generate responsive classes
  const responsiveClasses = cn(
    generateResponsiveClasses(sizeClasses, sizeValues, size),
    generateResponsiveBoolClasses(fullWidthValues, fullWidth),
  );

  return (
    <Button
      asChild={!!href}
      variant={variant}
      data-slot="button-block"
      data-action={!href ? onClick : undefined}
      className={responsiveClasses}
    >
      {href ? <Link href={href}>{text}</Link> : text}
    </Button>
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

/**
 * Generate responsive classes for boolean fullWidth property
 */
function generateResponsiveBoolClasses(
  values: { base?: boolean; tablet?: boolean; mobile?: boolean },
  defaultValue?: boolean,
): string {
  const classes: string[] = [];
  const { base, tablet, mobile } = values;

  // Determine effective values at each breakpoint (mobile-first)
  const mobileValue = mobile ?? tablet ?? base ?? defaultValue;
  const tabletValue = tablet ?? base ?? defaultValue;
  const desktopValue = base ?? defaultValue;

  // If all values are the same, just return base class
  if (mobileValue === tabletValue && tabletValue === desktopValue) {
    return desktopValue ? "btn-full-width" : "";
  }

  // Mobile base (no prefix)
  if (mobileValue) {
    classes.push("btn-full-width");
  } else {
    classes.push("btn-auto-width");
  }

  // Tablet override (md: prefix)
  if (tabletValue !== mobileValue) {
    classes.push(tabletValue ? "md:btn-full-width" : "md:btn-auto-width");
  }

  // Desktop override (lg: prefix)
  if (desktopValue !== tabletValue) {
    classes.push(desktopValue ? "lg:btn-full-width" : "lg:btn-auto-width");
  }

  return classes.join(" ");
}
