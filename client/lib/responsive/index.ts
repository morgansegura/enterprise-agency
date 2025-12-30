/**
 * Responsive Utilities for Client-Side Rendering
 *
 * Handles responsive block data by generating appropriate CSS classes
 * that apply at different breakpoints using Tailwind's responsive prefixes.
 */

import type { ResponsiveOverrides } from "@enterprise/tokens";

// Re-export types from @enterprise/tokens
export type {
  Breakpoint,
  BreakpointConfig,
  ResponsiveOverrides,
  ResponsiveBlockData,
} from "@enterprise/tokens";

export {
  BREAKPOINT_WIDTHS,
  hasResponsiveOverrides,
  isBreakpoint,
} from "@enterprise/tokens";

/**
 * Get the base value and responsive overrides from block data
 */
export function getResponsiveValues<T>(
  data: Record<string, unknown>,
  property: string,
): { base: T | undefined; tablet?: T; mobile?: T } {
  const baseValue = data[property] as T | undefined;
  const responsive = data._responsive as
    | ResponsiveOverrides<Record<string, unknown>>
    | undefined;

  return {
    base: baseValue,
    tablet: responsive?.tablet?.[property] as T | undefined,
    mobile: responsive?.mobile?.[property] as T | undefined,
  };
}

/**
 * Generate responsive class string for a property
 *
 * Uses Tailwind responsive prefixes:
 * - base: applies to all breakpoints
 * - md: applies at tablet and above (768px+)
 * - lg: applies at desktop and above (1024px+)
 *
 * Since Tailwind is mobile-first, we need to reverse the logic:
 * - Mobile value is the base (default)
 * - Tablet value uses md: prefix
 * - Desktop value uses lg: prefix
 *
 * @param classMap - Map of value to class name (e.g., { "left": "text-left" })
 * @param values - The responsive values object
 * @returns Combined class string
 */
export function getResponsiveClass<T extends string>(
  classMap: Record<T, string>,
  values: { base?: T; tablet?: T; mobile?: T },
): string {
  const classes: string[] = [];
  const { base, tablet, mobile } = values;

  // Determine effective values at each breakpoint
  // Mobile-first: mobile -> tablet -> desktop
  const mobileValue = mobile ?? tablet ?? base;
  const tabletValue = tablet ?? base;
  const desktopValue = base;

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
