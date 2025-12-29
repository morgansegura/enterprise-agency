/**
 * CSS Variable Generation
 *
 * Utilities to generate CSS custom properties from token scales.
 * These are used in the client app to map data attributes to styles.
 */

import { spacing } from "../primitives";
import {
  sizeScale,
  sectionSizeScale,
  textSizeScale,
  headingSizeScale,
  weightScale,
  leadingScale,
  radiusScale,
  shadowScale,
  containerScale,
  gapScale,
} from "./scales";

// =============================================================================
// CSS Variable Name Generators
// =============================================================================

/**
 * Generate a CSS variable name with optional prefix
 */
export function cssVar(name: string, prefix = ""): string {
  return prefix ? `--${prefix}-${name}` : `--${name}`;
}

/**
 * Generate a CSS variable reference
 */
export function cssVarRef(
  name: string,
  prefix = "",
  fallback?: string,
): string {
  const varName = cssVar(name, prefix);
  return fallback ? `var(${varName}, ${fallback})` : `var(${varName})`;
}

// =============================================================================
// Spacing CSS Variables
// =============================================================================

/**
 * Generate all spacing CSS variables
 */
export function generateSpacingVariables(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(spacing)) {
    vars[`--spacing-${key || "DEFAULT"}`] = value;
  }
  return vars;
}

// =============================================================================
// Scale-to-CSS Variable Mappers
// =============================================================================

/**
 * Generate CSS variable declarations for a scale
 */
export function scaleToCSS<T extends Record<string, { value: string }>>(
  scale: T,
  prefix: string,
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, config] of Object.entries(scale)) {
    vars[`--${prefix}-${key}`] = config.value;
  }
  return vars;
}

// =============================================================================
// Data Attribute Selectors
// =============================================================================

/**
 * CSS selectors that map data attributes to CSS variables
 * Example: [data-padding-y="lg"] { --padding-y: var(--spacing-6); }
 */
export const dataAttributeSelectors = {
  // Padding Y
  paddingY: Object.entries(sizeScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-padding-y="${key}"]`] = {
        "--padding-y": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Padding X
  paddingX: Object.entries(sizeScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-padding-x="${key}"]`] = {
        "--padding-x": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Section Padding Y (extended scale)
  sectionPaddingY: Object.entries(sectionSizeScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-section-padding-y="${key}"]`] = {
        "--section-padding-y": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Gap
  gap: Object.entries(gapScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-gap="${key}"]`] = {
        "--gap": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Border Radius
  radius: Object.entries(radiusScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-radius="${key}"]`] = {
        "--radius": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Shadow
  shadow: Object.entries(shadowScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-shadow="${key}"]`] = {
        "--shadow": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Container Width
  container: Object.entries(containerScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-container="${key}"]`] = {
        "--container-width": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Text Size
  textSize: Object.entries(textSizeScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-text-size="${key}"]`] = {
        "--text-size": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Heading Size
  headingSize: Object.entries(headingSizeScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-heading-size="${key}"]`] = {
        "--heading-size": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Font Weight
  weight: Object.entries(weightScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-weight="${key}"]`] = {
        "--font-weight": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),

  // Line Height
  leading: Object.entries(leadingScale).reduce(
    (acc, [key, config]) => {
      acc[`[data-leading="${key}"]`] = {
        "--line-height": config.value,
      };
      return acc;
    },
    {} as Record<string, Record<string, string>>,
  ),
} as const;

// =============================================================================
// CSS Generation Utilities
// =============================================================================

/**
 * Generate CSS string from data attribute selectors
 */
export function generateDataAttributeCSS(): string {
  const lines: string[] = [];

  for (const [category, selectors] of Object.entries(dataAttributeSelectors)) {
    lines.push(`/* ${category} */`);
    for (const [selector, properties] of Object.entries(selectors)) {
      const props = Object.entries(properties)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join("\n");
      lines.push(`${selector} {\n${props}\n}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate all CSS variables as a single block
 */
export function generateAllCSSVariables(): string {
  const sections: string[] = [];

  // Spacing variables
  sections.push("/* Spacing Scale */");
  for (const [key, value] of Object.entries(spacing)) {
    const varName = key || "DEFAULT";
    sections.push(`--spacing-${varName}: ${value};`);
  }

  // Size scale
  sections.push("\n/* Size Scale */");
  for (const [key, config] of Object.entries(sizeScale)) {
    sections.push(`--size-${key}: ${config.value};`);
  }

  // Section size scale
  sections.push("\n/* Section Size Scale */");
  for (const [key, config] of Object.entries(sectionSizeScale)) {
    sections.push(`--section-size-${key}: ${config.value};`);
  }

  // Text size scale
  sections.push("\n/* Text Size Scale */");
  for (const [key, config] of Object.entries(textSizeScale)) {
    sections.push(`--text-size-${key}: ${config.value};`);
  }

  // Heading size scale
  sections.push("\n/* Heading Size Scale */");
  for (const [key, config] of Object.entries(headingSizeScale)) {
    sections.push(`--heading-size-${key}: ${config.value};`);
  }

  // Weight scale
  sections.push("\n/* Weight Scale */");
  for (const [key, config] of Object.entries(weightScale)) {
    sections.push(`--weight-${key}: ${config.value};`);
  }

  // Leading scale
  sections.push("\n/* Leading Scale */");
  for (const [key, config] of Object.entries(leadingScale)) {
    sections.push(`--leading-${key}: ${config.value};`);
  }

  // Radius scale
  sections.push("\n/* Radius Scale */");
  for (const [key, config] of Object.entries(radiusScale)) {
    sections.push(`--radius-${key}: ${config.value};`);
  }

  // Shadow scale
  sections.push("\n/* Shadow Scale */");
  for (const [key, config] of Object.entries(shadowScale)) {
    sections.push(`--shadow-${key}: ${config.value};`);
  }

  // Container scale
  sections.push("\n/* Container Scale */");
  for (const [key, config] of Object.entries(containerScale)) {
    sections.push(`--container-${key}: ${config.value};`);
  }

  // Gap scale
  sections.push("\n/* Gap Scale */");
  for (const [key, config] of Object.entries(gapScale)) {
    sections.push(`--gap-${key}: ${config.value};`);
  }

  return sections.join("\n");
}
