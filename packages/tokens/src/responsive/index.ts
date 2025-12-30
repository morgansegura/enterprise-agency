/**
 * Responsive Override System Types
 *
 * Shared type definitions for responsive block data.
 * Used by both builder (for editing) and client (for rendering).
 *
 * Data structure:
 * ```typescript
 * data: {
 *   size: "lg",           // Base value (desktop)
 *   align: "center",
 *   _responsive: {
 *     tablet: { size: "md" },
 *     mobile: { size: "sm", align: "left" }
 *   }
 * }
 * ```
 */

// =============================================================================
// Breakpoint Types
// =============================================================================

/**
 * Breakpoint identifiers
 */
export type Breakpoint = "desktop" | "tablet" | "mobile";

/**
 * Breakpoint configuration
 */
export interface BreakpointConfig {
  label: string;
  width: number;
  icon?: string;
}

/**
 * Default breakpoint widths (matches Tailwind defaults)
 */
export const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

// =============================================================================
// Responsive Override Types
// =============================================================================

/**
 * Responsive overrides for block data
 * Allows tablet and mobile to override base (desktop) values
 */
export type ResponsiveOverrides<T extends Record<string, unknown>> = {
  tablet?: Partial<T>;
  mobile?: Partial<T>;
};

/**
 * Block data with optional responsive overrides
 */
export type ResponsiveBlockData<T extends Record<string, unknown>> = T & {
  _responsive?: ResponsiveOverrides<T>;
};

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Check if data has responsive overrides
 */
export function hasResponsiveOverrides(data: Record<string, unknown>): boolean {
  return "_responsive" in data && data._responsive !== undefined;
}

/**
 * Check if value is a valid breakpoint
 */
export function isBreakpoint(value: unknown): value is Breakpoint {
  return value === "desktop" || value === "tablet" || value === "mobile";
}
