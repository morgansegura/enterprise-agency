/**
 * Responsive Override System Utilities
 *
 * Shared utilities for handling responsive breakpoint overrides.
 * Used by both builder and client apps.
 */

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

import type { Breakpoint, ResponsiveOverrides } from "@enterprise/tokens";

/**
 * Get the effective value for a property at a given breakpoint
 *
 * Resolution order (most specific wins):
 * 1. mobile override (if breakpoint is mobile)
 * 2. tablet override (if breakpoint is tablet or mobile)
 * 3. base value (desktop or fallback)
 */
export function getResponsiveValue<T>(
  data: Record<string, unknown>,
  property: string,
  breakpoint: Breakpoint,
): T | undefined {
  const responsive = data._responsive as
    | ResponsiveOverrides<Record<string, unknown>>
    | undefined;
  const baseValue = data[property] as T | undefined;

  if (!responsive) {
    return baseValue;
  }

  // Mobile: check mobile override first
  if (breakpoint === "mobile") {
    const mobileValue = responsive.mobile?.[property] as T | undefined;
    if (mobileValue !== undefined) {
      return mobileValue;
    }
    // Fall through to tablet
    const tabletValue = responsive.tablet?.[property] as T | undefined;
    if (tabletValue !== undefined) {
      return tabletValue;
    }
  }

  // Tablet: check tablet override
  if (breakpoint === "tablet") {
    const tabletValue = responsive.tablet?.[property] as T | undefined;
    if (tabletValue !== undefined) {
      return tabletValue;
    }
  }

  // Desktop or no override found: use base value
  return baseValue;
}

/**
 * Get all effective values for block data at a given breakpoint
 */
export function getResponsiveData<T extends Record<string, unknown>>(
  data: T,
  breakpoint: Breakpoint,
): Omit<T, "_responsive"> {
  const result: Record<string, unknown> = {};
  const responsive = data._responsive as
    | ResponsiveOverrides<Record<string, unknown>>
    | undefined;

  // Copy all base properties except _responsive
  for (const key of Object.keys(data)) {
    if (key === "_responsive") continue;
    result[key] = data[key];
  }

  // Apply tablet overrides if breakpoint is tablet or mobile
  if (
    responsive?.tablet &&
    (breakpoint === "tablet" || breakpoint === "mobile")
  ) {
    Object.assign(result, responsive.tablet);
  }

  // Apply mobile overrides if breakpoint is mobile
  if (responsive?.mobile && breakpoint === "mobile") {
    Object.assign(result, responsive.mobile);
  }

  return result as Omit<T, "_responsive">;
}

/**
 * Set a responsive override for a specific breakpoint
 */
export function setResponsiveOverride<T extends Record<string, unknown>>(
  data: T,
  breakpoint: Breakpoint,
  property: string,
  value: unknown,
): T {
  // Desktop changes the base value directly
  if (breakpoint === "desktop") {
    return {
      ...data,
      [property]: value,
    };
  }

  // Tablet/Mobile: update the _responsive object
  const responsive = (data._responsive || {}) as ResponsiveOverrides<
    Record<string, unknown>
  >;

  return {
    ...data,
    _responsive: {
      ...responsive,
      [breakpoint]: {
        ...responsive[breakpoint],
        [property]: value,
      },
    },
  };
}

/**
 * Remove a responsive override for a specific breakpoint
 */
export function removeResponsiveOverride<T extends Record<string, unknown>>(
  data: T,
  breakpoint: Breakpoint,
  property: string,
): T {
  // Can't remove desktop base values
  if (breakpoint === "desktop") {
    return data;
  }

  const responsive = data._responsive as
    | ResponsiveOverrides<Record<string, unknown>>
    | undefined;

  if (!responsive || !responsive[breakpoint]) {
    return data;
  }

  const breakpointOverrides = { ...responsive[breakpoint] };
  delete breakpointOverrides[property];

  // If no more overrides for this breakpoint, remove the breakpoint key
  const newResponsive = { ...responsive };
  if (Object.keys(breakpointOverrides).length === 0) {
    delete newResponsive[breakpoint];
  } else {
    newResponsive[breakpoint] = breakpointOverrides;
  }

  // If no more responsive overrides at all, remove _responsive
  if (Object.keys(newResponsive).length === 0) {
    const { _responsive, ...rest } = data;
    return rest as T;
  }

  return {
    ...data,
    _responsive: newResponsive,
  };
}

/**
 * Check if a property has an override for a specific breakpoint
 */
export function hasResponsiveOverride(
  data: Record<string, unknown>,
  breakpoint: Breakpoint,
  property: string,
): boolean {
  if (breakpoint === "desktop") {
    return false; // Desktop is always the base, not an override
  }

  const responsive = data._responsive as
    | ResponsiveOverrides<Record<string, unknown>>
    | undefined;

  return responsive?.[breakpoint]?.[property] !== undefined;
}

/**
 * Get all properties that have overrides for a specific breakpoint
 */
export function getOverriddenProperties(
  data: Record<string, unknown>,
  breakpoint: Breakpoint,
): string[] {
  if (breakpoint === "desktop") {
    return [];
  }

  const responsive = data._responsive as
    | ResponsiveOverrides<Record<string, unknown>>
    | undefined;

  if (!responsive?.[breakpoint]) {
    return [];
  }

  return Object.keys(responsive[breakpoint]!);
}
