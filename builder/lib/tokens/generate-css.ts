import type { DesignTokens, ColorScale } from "./types";
import { platformDefaults } from "./platform-defaults";

/**
 * Generate CSS Variables from Design Tokens
 *
 * Converts design tokens into CSS custom properties that can be used
 * throughout the application. This allows runtime theming without
 * rebuilding CSS.
 *
 * @param tokens - Design tokens (defaults to platform defaults)
 * @returns CSS string with :root variable declarations
 */
export function generateTokenCSS(tokens: Partial<DesignTokens> = {}): string {
  // Merge custom tokens with platform defaults
  const mergedTokens: DesignTokens = {
    colors: { ...platformDefaults.colors, ...tokens.colors },
    typography: { ...platformDefaults.typography, ...tokens.typography },
    spacing: { ...platformDefaults.spacing, ...tokens.spacing },
    borderRadius: { ...platformDefaults.borderRadius, ...tokens.borderRadius },
    shadows: { ...platformDefaults.shadows, ...tokens.shadows },
    transitions: { ...platformDefaults.transitions, ...tokens.transitions },
  };

  const cssVars: string[] = [];

  // Color tokens
  cssVars.push(generateColorVariables("primary", mergedTokens.colors.primary));
  cssVars.push(
    generateColorVariables("secondary", mergedTokens.colors.secondary),
  );
  cssVars.push(generateColorVariables("accent", mergedTokens.colors.accent));
  cssVars.push(generateColorVariables("neutral", mergedTokens.colors.neutral));

  // Semantic colors
  cssVars.push(`--color-success: ${mergedTokens.colors.semantic.success};`);
  cssVars.push(`--color-warning: ${mergedTokens.colors.semantic.warning};`);
  cssVars.push(`--color-error: ${mergedTokens.colors.semantic.error};`);
  cssVars.push(`--color-info: ${mergedTokens.colors.semantic.info};`);

  // Typography - Font Family
  cssVars.push(
    `--font-sans: ${mergedTokens.typography.fontFamily.sans.join(", ")};`,
  );
  cssVars.push(
    `--font-serif: ${mergedTokens.typography.fontFamily.serif.join(", ")};`,
  );
  cssVars.push(
    `--font-mono: ${mergedTokens.typography.fontFamily.mono.join(", ")};`,
  );

  // Typography - Font Size
  Object.entries(mergedTokens.typography.fontSize).forEach(([key, value]) => {
    cssVars.push(`--font-size-${key}: ${value};`);
  });

  // Typography - Font Weight
  Object.entries(mergedTokens.typography.fontWeight).forEach(([key, value]) => {
    cssVars.push(`--font-weight-${key}: ${value};`);
  });

  // Typography - Line Height
  Object.entries(mergedTokens.typography.lineHeight).forEach(([key, value]) => {
    cssVars.push(`--line-height-${key}: ${value};`);
  });

  // Typography - Letter Spacing
  Object.entries(mergedTokens.typography.letterSpacing).forEach(
    ([key, value]) => {
      cssVars.push(`--letter-spacing-${key}: ${value};`);
    },
  );

  // Spacing
  Object.entries(mergedTokens.spacing).forEach(([key, value]) => {
    cssVars.push(`--spacing-${key}: ${value};`);
  });

  // Border Radius
  Object.entries(mergedTokens.borderRadius).forEach(([key, value]) => {
    cssVars.push(`--radius-${key}: ${value};`);
  });

  // Shadows
  Object.entries(mergedTokens.shadows).forEach(([key, value]) => {
    cssVars.push(`--shadow-${key}: ${value};`);
  });

  // Transitions
  Object.entries(mergedTokens.transitions).forEach(([key, value]) => {
    cssVars.push(`--transition-${key}: ${value};`);
  });

  // Wrap in :root selector
  return `:root {\n  ${cssVars.join("\n  ")}\n}`;
}

/**
 * Generate CSS variables for a color scale
 */
function generateColorVariables(name: string, scale: ColorScale): string {
  const vars: string[] = [];

  Object.entries(scale).forEach(([shade, value]) => {
    vars.push(`--color-${name}-${shade}: ${value};`);
  });

  return vars.join("\n  ");
}

/**
 * Generate CSS for a specific tenant
 *
 * @param tenantTokens - Tenant-specific token overrides
 * @returns CSS string ready to be injected
 */
export function generateTenantCSS(
  tenantTokens?: Partial<DesignTokens>,
): string {
  if (!tenantTokens) {
    return generateTokenCSS();
  }

  return generateTokenCSS(tenantTokens);
}

/**
 * Extract token value by CSS variable name
 *
 * Utility for getting a specific token value
 *
 * @example
 * getTokenValue('--color-primary-500', tokens) // => '#3b82f6'
 */
export function getTokenValue(
  varName: string,
  tokens: DesignTokens = platformDefaults,
): string | null {
  // Parse variable name (e.g., --color-primary-500)
  const match = varName.match(/^--(.+)$/);
  if (!match) return null;

  const path = match[1].split("-");

  // Handle nested access
  let value: any = tokens;
  for (const key of path) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return null;
    }
  }

  return typeof value === "string" ? value : null;
}
