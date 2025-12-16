/**
 * Google Fonts Utilities
 *
 * Utilities for dynamically loading Google Fonts based on tenant configuration.
 */

import type { FontConfig, FontDefinition, FontRole } from "./types";

/**
 * Get fallback stack for a font category
 */
export function getFallbackStack(
  category: FontDefinition["category"] = "sans-serif",
): string {
  switch (category) {
    case "sans-serif":
      return "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    case "serif":
      return "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
    case "monospace":
      return "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
    case "display":
      return "ui-sans-serif, system-ui, sans-serif";
    case "handwriting":
      return "cursive, ui-sans-serif, sans-serif";
    default:
      return "sans-serif";
  }
}

/**
 * Build full font-family value with fallbacks
 */
export function buildFontFamily(
  family: string,
  category: FontDefinition["category"] = "sans-serif",
): string {
  const fallback = getFallbackStack(category);
  return `'${family}', ${fallback}`;
}

/**
 * Build Google Fonts URL for loading multiple fonts
 */
export function buildGoogleFontsUrl(definitions: FontDefinition[]): string {
  if (definitions.length === 0) return "";

  const families = definitions
    .map((def) => {
      const family = def.family.replace(/ /g, "+");
      const weights = def.weights.join(";");
      return `family=${family}:wght@${weights}`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Generate CSS variables for font configuration
 */
export function generateFontCSS(fontConfig: FontConfig): string {
  const cssVars: string[] = [];

  // Generate font-family variables for each definition
  fontConfig.definitions.forEach((def) => {
    const fontFamily = buildFontFamily(def.family, def.category);
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
 * Generate Google Fonts preconnect links
 * These improve loading performance
 */
export function getGoogleFontsPreconnectLinks(): string {
  return `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
`;
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
