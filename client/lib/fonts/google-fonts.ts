/**
 * Google Fonts Utilities
 *
 * Utilities for dynamically loading Google Fonts based on tenant configuration.
 * Core font utilities are from @enterprise/tokens.
 */

import type { FontConfig, FontRole } from "@enterprise/tokens";
import { buildFontFamily as buildFontFamilyFn } from "@enterprise/tokens";

// Re-export core utilities from tokens
export {
  getFallbackStack,
  buildFontFamily,
  buildGoogleFontsUrl,
  getGoogleFontsPreconnectLinks,
} from "@enterprise/tokens";

/**
 * Generate CSS variables for font configuration
 */
export function generateFontCSS(fontConfig: FontConfig): string {
  const cssVars: string[] = [];

  // Generate font-family variables for each definition
  fontConfig.definitions.forEach((def) => {
    const fontFamily = buildFontFamilyFn(def.family, def.category);
    cssVars.push(`--font-${def.id}: ${fontFamily};`);
  });

  // Add system font fallback
  cssVars.push(
    `--font-system: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;`,
  );

  // Generate role-based font variables
  const getRoleFont = (role: FontRole): string => {
    if (role === "system") return "var(--font-system)";
    return `var(--font-${role})`;
  };

  cssVars.push(`--font-heading: ${getRoleFont(fontConfig.roles.heading)};`);
  cssVars.push(`--font-body: ${getRoleFont(fontConfig.roles.body)};`);
  cssVars.push(`--font-button: ${getRoleFont(fontConfig.roles.button)};`);
  cssVars.push(`--font-link: ${getRoleFont(fontConfig.roles.link)};`);
  cssVars.push(`--font-caption: ${getRoleFont(fontConfig.roles.caption)};`);
  cssVars.push(
    `--font-navigation: ${getRoleFont(fontConfig.roles.navigation)};`,
  );

  return cssVars.join("\n  ");
}

/**
 * Default font configuration (matches builder defaults)
 */
export const defaultFontConfig: FontConfig = {
  definitions: [
    {
      id: "primary",
      family: "Inter",
      weights: [400, 500, 600, 700],
      category: "sans-serif",
    },
    {
      id: "secondary",
      family: "Open Sans",
      weights: [400, 500, 600],
      category: "sans-serif",
    },
    {
      id: "accent",
      family: "Roboto Condensed",
      weights: [400, 700],
      category: "sans-serif",
    },
  ],
  roles: {
    heading: "primary",
    body: "secondary",
    button: "accent",
    link: "accent",
    caption: "secondary",
    navigation: "primary",
  },
};
