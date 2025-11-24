import { publicApi } from "@/lib/public-api-client";
import { mergeTokens, generateCSS, type TenantTokens } from "@/lib/tokens";

/**
 * Token Provider
 *
 * Server component that:
 * 1. Fetches tenant token overrides from API
 * 2. Merges with platform defaults
 * 3. Generates CSS custom properties
 * 4. Injects CSS into app via <style> tag
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
 */
export async function TokenProvider() {
  let tenantTokens: TenantTokens = {};

  try {
    // Fetch tenant token overrides from API
    // This is cached for 5 minutes via Next.js fetch cache
    tenantTokens = (await publicApi.getTokens()) as TenantTokens;
  } catch (error) {
    // Graceful fallback: use platform defaults only
    console.error("Failed to fetch tenant tokens, using defaults:", error);
  }

  // Merge tenant overrides with platform defaults
  const mergedTokens = mergeTokens(tenantTokens);

  // Generate CSS custom properties from merged tokens
  const css = generateCSS(mergedTokens);

  // Inject CSS into <head> via <style> tag
  // This ensures tokens are available before any component renders
  return (
    <style
      id="design-tokens"
      dangerouslySetInnerHTML={{ __html: css }}
      suppressHydrationWarning
    />
  );
}
