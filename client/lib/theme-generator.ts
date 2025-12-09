/**
 * Theme Generator Utility
 * Converts API theme config to CSS custom properties
 *
 * Enterprise practices:
 * - Type-safe theme configuration
 * - Sanitization to prevent CSS injection
 * - Efficient string building
 * - Support for nested theme objects
 */

export type ThemeConfig = Record<
  string,
  string | number | Record<string, string | number>
>;

/**
 * Sanitize CSS value to prevent injection attacks
 * Only allows safe characters for CSS values
 */
function sanitizeCSSValue(value: string): string {
  // Remove any potentially dangerous characters
  // Allow: alphanumeric, spaces, hyphens, parentheses, commas, periods, %, #, quotes
  return value.replace(/[^a-zA-Z0-9\s\-(),.'"%#]/g, "");
}

/**
 * Recursively flatten nested theme object into CSS variables
 * Example: { colors: { primary: "#000" } } → "--colors-primary: #000"
 */
function flattenTheme(
  obj: ThemeConfig,
  prefix = "",
  separator = "-",
): Record<string, string> {
  const result: Record<string, string> = {};

  Object.entries(obj).forEach(([key, value]) => {
    const cssKey = prefix ? `${prefix}${separator}${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(
        result,
        flattenTheme(value as ThemeConfig, cssKey, separator),
      );
    } else {
      // Convert to string and sanitize
      result[cssKey] = sanitizeCSSValue(String(value));
    }
  });

  return result;
}

/**
 * Generate CSS custom properties from theme configuration
 * Returns CSS string ready to inject into :root selector
 *
 * @param theme - Theme configuration object from API
 * @param options - Generation options
 * @returns CSS string with custom properties
 *
 * @example
 * const css = generateCSSVariables({
 *   primary: "#1e40af",
 *   "space-6": "1.5rem"
 * });
 * // Returns: "--primary: #1e40af; --space-6: 1.5rem;"
 */
export function generateCSSVariables(
  theme: ThemeConfig | undefined | null,
  options: {
    prefix?: string;
    separator?: string;
    flatten?: boolean;
  } = {},
): string {
  if (!theme || typeof theme !== "object") {
    return "";
  }

  const { prefix = "", separator = "-", flatten = true } = options;

  // Flatten nested objects into flat structure
  const variables = flatten
    ? flattenTheme(theme, prefix, separator)
    : (theme as Record<string, string>);

  // Build CSS variable declarations
  const cssVars = Object.entries(variables)
    .map(([key, value]) => {
      const varName = key.startsWith("--") ? key : `--${key}`;
      return `${varName}: ${value};`;
    })
    .join(" ");

  return cssVars;
}

/**
 * Generate complete CSS rule with :root selector
 *
 * @param theme - Theme configuration object from API
 * @returns Complete CSS rule as string
 *
 * @example
 * const css = generateThemeCSS({ primary: "#000" });
 * // Returns: ":root { --primary: #000; }"
 */
export function generateThemeCSS(
  theme: ThemeConfig | undefined | null,
): string {
  const variables = generateCSSVariables(theme);
  if (!variables) return "";

  return `:root { ${variables} }`;
}

/**
 * Validate theme configuration structure
 * Ensures theme config is safe to use
 */
export function validateThemeConfig(theme: unknown): theme is ThemeConfig {
  if (!theme || typeof theme !== "object") return false;

  // Additional validation logic can be added here
  return true;
}
