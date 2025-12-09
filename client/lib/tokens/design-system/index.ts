/**
 * Design Token System
 *
 * Complete token-based design system for the agency platform.
 *
 * Features:
 * - Platform default tokens (professional design system)
 * - Tenant-specific token overrides
 * - CSS variable generation
 * - Type-safe token definitions
 *
 * @example
 * ```ts
 * import { platformDefaults, generateTenantCSS } from '@/lib/tokens/design-system';
 *
 * // Generate CSS for a tenant
 * const css = generateTenantCSS(tenant.designTokens);
 * ```
 */

export * from "./types";
export * from "./platform-defaults";
export * from "./generate-css";
