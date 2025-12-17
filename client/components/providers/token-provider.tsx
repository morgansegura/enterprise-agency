import {
  createPublicApiClient,
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

// Semantic color tokens saved from Global Settings
interface SemanticColors {
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  accent?: string;
  accentForeground?: string;
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  muted?: string;
  mutedForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
  destructive?: string;
}

/**
 * Generate CSS from semantic colors
 * Maps Global Settings semantic colors to CSS custom properties
 */
function generateSemanticCSS(semantic: SemanticColors): string {
  const cssVars: string[] = [];

  // Map camelCase keys to kebab-case CSS variable names
  const keyMap: Record<keyof SemanticColors, string> = {
    primary: "--primary",
    primaryForeground: "--primary-foreground",
    secondary: "--secondary",
    secondaryForeground: "--secondary-foreground",
    accent: "--accent",
    accentForeground: "--accent-foreground",
    background: "--background",
    foreground: "--foreground",
    card: "--card",
    cardForeground: "--card-foreground",
    popover: "--popover",
    popoverForeground: "--popover-foreground",
    muted: "--muted",
    mutedForeground: "--muted-foreground",
    border: "--border",
    input: "--input",
    ring: "--ring",
    destructive: "--destructive",
  };

  for (const [key, cssVar] of Object.entries(keyMap)) {
    const value = semantic[key as keyof SemanticColors];
    if (value) {
      cssVars.push(`${cssVar}: ${value};`);
    }
  }

  if (cssVars.length === 0) {
    return "";
  }

  return `:root {\n  ${cssVars.join("\n  ")}\n}`;
}

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
    Partial<DesignTokens> & { fonts?: FontConfig; semantic?: SemanticColors } =
    {};

  try {
    // Fetch tenant token overrides from API
    // Use tenant-specific client if slug provided, otherwise resolve dynamically
    const api = tenantSlug
      ? await createPublicApiClientForTenant(tenantSlug)
      : await createPublicApiClient();
    const apiTokens = await api.getTokens();
    tenantTokens = apiTokens as TenantTokens &
      Partial<DesignTokens> & { fonts?: FontConfig; semantic?: SemanticColors };
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
    semantic,
    ...legacyTokens
  } = tenantTokens;

  // Generate CSS for semantic colors (primary, secondary, background, etc.)
  // These come from Global Settings and override the base colors
  const semanticCSS = semantic ? generateSemanticCSS(semantic) : "";

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
  // Semantic CSS comes last to override any defaults
  const combinedCSS = `${newCSS}\n\n/* Font Variables */\n:root {\n  ${fontCSS}\n}\n\n${legacyCSS}\n\n/* Semantic Colors (Global Settings) */\n${semanticCSS}`;

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
        <link rel="stylesheet" href={googleFontsUrl} fetchPriority="high" />
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
