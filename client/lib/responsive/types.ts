/**
 * Responsive Override Types
 *
 * Shared type definitions for responsive block data
 */

/**
 * Responsive overrides for block data
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
