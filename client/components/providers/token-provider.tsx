import {
  publicApi,
  createPublicApiClientForTenant,
} from "@/lib/public-api-client";
import { mergeTokens, generateCSS, type TenantTokens } from "@/lib/tokens";
import {
  generateTenantCSS,
  type DesignTokens,
} from "@/lib/tokens/design-system";
import { logger } from "@/lib/logger";

interface TokenProviderProps {
  tenantSlug?: string;
}

/**
 * Token Provider
 *
 * Server component that:
 * 1. Fetches tenant token overrides from API
 * 2. Merges with platform defaults (old + new system)
 * 3. Generates CSS custom properties
 * 4. Injects CSS into app via <style> tag
 *
 * Supports two token systems:
 * - Legacy: header, menu, footer, section tokens
 * - New: complete design system (colors, typography, spacing, etc.)
 *
 * Enterprise practices:
 * - Server-side rendering for instant CSS availability
 * - Cached API responses (5 minutes) for performance
 * - Graceful fallback to defaults on error
 * - Type-safe token merging
 * - Zero layout shift (CSS available before first paint)
 *
 * Usage in layout.tsx:
 * ```tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <head>
 *         <TokenProvider />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 *
 * For tenant-specific tokens:
 * ```tsx
 * <TokenProvider tenantSlug="my-tenant" />
 * ```
 */
export async function TokenProvider({ tenantSlug }: TokenProviderProps = {}) {
  let tenantTokens: TenantTokens & Partial<DesignTokens> = {};

  try {
    // Fetch tenant token overrides from API
    // Use tenant-specific client if slug provided, otherwise use default
    const api = tenantSlug
      ? createPublicApiClientForTenant(tenantSlug)
      : publicApi;
    const apiTokens = await api.getTokens();
    tenantTokens = apiTokens as TenantTokens & Partial<DesignTokens>;
  } catch (error) {
    // Graceful fallback: use platform defaults only
    logger.error(
      "Failed to fetch tenant tokens, using defaults",
      error as Error,
    );
  }

  // Separate old and new token systems
  const {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    transitions,
    ...legacyTokens
  } = tenantTokens;

  // Generate CSS for legacy token system (header, menu, footer, section)
  const mergedLegacyTokens = mergeTokens(legacyTokens as TenantTokens);
  const legacyCSS = generateCSS(mergedLegacyTokens);

  // Generate CSS for new design token system
  const newDesignTokens: Partial<DesignTokens> = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    transitions,
  };
  const newCSS = generateTenantCSS(newDesignTokens);

  // Combine both CSS outputs
  const combinedCSS = `${newCSS}\n\n${legacyCSS}`;

  // Inject CSS into <head> via <style> tag
  // This ensures tokens are available before any component renders
  return (
    <style
      id="design-tokens"
      dangerouslySetInnerHTML={{ __html: combinedCSS }}
      suppressHydrationWarning
    />
  );
}
