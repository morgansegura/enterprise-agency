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
import {
  buildGoogleFontsUrl,
  generateFontCSS,
  defaultFontConfig,
  type FontConfig,
} from "@/lib/fonts";

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
  let tenantTokens: TenantTokens &
    Partial<DesignTokens> & { fonts?: FontConfig } = {};

  try {
    // Fetch tenant token overrides from API
    // Use tenant-specific client if slug provided, otherwise use default
    const api = tenantSlug
      ? await createPublicApiClientForTenant(tenantSlug)
      : publicApi;
    const apiTokens = await api.getTokens();
    tenantTokens = apiTokens as TenantTokens &
      Partial<DesignTokens> & { fonts?: FontConfig };
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
    fonts,
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

  // Handle font configuration
  const fontConfig = fonts || defaultFontConfig;
  const googleFontsUrl = buildGoogleFontsUrl(fontConfig.definitions);
  const fontCSS = generateFontCSS(fontConfig);

  // Combine all CSS outputs
  const combinedCSS = `${newCSS}\n\n/* Font Variables */\n:root {\n  ${fontCSS}\n}\n\n${legacyCSS}`;

  // Inject CSS and Google Fonts into <head>
  // This ensures tokens and fonts are available before any component renders
  return (
    <>
      {/* Google Fonts preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Google Fonts stylesheet */}
      {googleFontsUrl && (
        <link
          rel="stylesheet"
          href={googleFontsUrl}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - fetchpriority is valid but not in types
          fetchpriority="high"
        />
      )}

      {/* Design tokens CSS */}
      <style
        id="design-tokens"
        dangerouslySetInnerHTML={{ __html: combinedCSS }}
        suppressHydrationWarning
      />
    </>
  );
}
