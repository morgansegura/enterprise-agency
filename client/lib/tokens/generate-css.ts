import type { MergedTokens } from "./merge-tokens";
import { generateHeaderCSS } from "./generate-header-css";
import { generateMenuCSS } from "./generate-menu-css";
import { generateFooterCSS } from "./generate-footer-css";
import { generateSectionCSS } from "./generate-section-css";

/**
 * Generate Complete CSS from Merged Tokens
 *
 * Takes a complete set of merged tokens (defaults + overrides)
 * and generates all CSS custom properties for injection into the app.
 *
 * Output format:
 * ```css
 * :root {
 *   --header-height-desktop: 72px;
 *   --header-height-mobile: 64px;
 *   --menu-item-spacing: 1rem;
 *   --section-spacing-md-top: 4rem;
 *   ...
 * }
 * ```
 *
 * Usage:
 * ```tsx
 * const mergedTokens = mergeTokens(tenantOverrides);
 * const css = generateCSS(mergedTokens);
 * // Inject css into <style> tag in app
 * ```
 *
 * @param tokens - Complete merged token set
 * @returns CSS string with all custom properties
 */
export function generateCSS(tokens: MergedTokens): string {
  // Generate CSS for each token category
  const headerCSS = generateHeaderCSS(tokens.header);
  const menuCSS = generateMenuCSS(tokens.menu);
  const footerCSS = generateFooterCSS(tokens.footer);
  const sectionCSS = generateSectionCSS(tokens.section);

  // Extract variable declarations (remove :root { ... } wrappers)
  const extractVars = (css: string): string => {
    const match = css.match(/:root\s*\{([\s\S]+)\}/);
    return match ? match[1].trim() : "";
  };

  const headerVars = extractVars(headerCSS);
  const menuVars = extractVars(menuCSS);
  const footerVars = extractVars(footerCSS);
  const sectionVars = extractVars(sectionCSS);

  // Combine all variables into a single :root block
  return `:root {
${headerVars}

${menuVars}

${footerVars}

${sectionVars}
}`;
}

/**
 * Generate Tenant-Specific CSS
 *
 * Useful for multi-tenant scenarios where multiple tenants
 * might be rendered on the same page (e.g., admin preview).
 *
 * Wraps tokens in a tenant-specific selector:
 * ```css
 * [data-tenant="tenant-slug"] {
 *   --header-height-desktop: 80px;
 *   ...
 * }
 * ```
 *
 * @param tenantSlug - Tenant identifier
 * @param tokens - Complete merged token set
 * @returns CSS string scoped to tenant
 */
export function generateTenantCSS(
  tenantSlug: string,
  tokens: MergedTokens,
): string {
  const css = generateCSS(tokens);

  // Replace :root with tenant-specific selector
  return css.replace(":root", `[data-tenant="${tenantSlug}"]`);
}
