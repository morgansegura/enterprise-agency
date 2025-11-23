import type { SectionTokens } from "./section-tokens";

/**
 * Generate CSS custom properties from section tokens
 * Converts nested token object into flat CSS variables
 *
 * @param tokens - Section token configuration
 * @param prefix - CSS variable prefix (default: "--section")
 * @returns CSS string with custom properties
 */
export function generateSectionCSS(
  tokens: SectionTokens,
  prefix: string = "--section",
): string {
  const cssVars: string[] = [];

  // Helper to create CSS variable name
  const varName = (...parts: string[]) =>
    [prefix, ...parts].filter(Boolean).join("-");

  // Helper to add CSS variable
  const addVar = (name: string, value: string) => {
    cssVars.push(`  ${name}: ${value};`);
  };

  // ==========================================
  // SPACING SCALE - Desktop
  // ==========================================

  Object.entries(tokens.spacing).forEach(([size, values]) => {
    addVar(varName("spacing", size, "top"), values.top);
    addVar(varName("spacing", size, "bottom"), values.bottom);
  });

  // ==========================================
  // SPACING - Mobile
  // ==========================================

  Object.entries(tokens.spacingMobile).forEach(([size, values]) => {
    addVar(varName("spacing-mobile", size, "top"), values.top);
    addVar(varName("spacing-mobile", size, "bottom"), values.bottom);
  });

  // ==========================================
  // SPACING - Tablet
  // ==========================================

  Object.entries(tokens.spacingTablet).forEach(([size, values]) => {
    addVar(varName("spacing-tablet", size, "top"), values.top);
    addVar(varName("spacing-tablet", size, "bottom"), values.bottom);
  });

  // ==========================================
  // CONTAINER WIDTHS
  // ==========================================

  Object.entries(tokens.width).forEach(([size, value]) => {
    addVar(varName("width", size), value);
  });

  // ==========================================
  // HORIZONTAL PADDING
  // ==========================================

  addVar(varName("padding-x"), tokens.paddingX.default);
  addVar(varName("padding-x-mobile"), tokens.paddingX.mobile);
  addVar(varName("padding-x-tablet"), tokens.paddingX.tablet);

  // ==========================================
  // HEIGHT
  // ==========================================

  Object.entries(tokens.height.min).forEach(([size, value]) => {
    addVar(varName("height-min", size), value);
  });

  Object.entries(tokens.height.max).forEach(([size, value]) => {
    addVar(varName("height-max", size), value);
  });

  // ==========================================
  // BACKGROUNDS - SOLID COLORS
  // ==========================================

  Object.entries(tokens.background).forEach(([name, value]) => {
    addVar(varName("bg", name), value);
  });

  // ==========================================
  // GRADIENTS
  // ==========================================

  Object.entries(tokens.gradient).forEach(([name, value]) => {
    addVar(varName("gradient", name), value);
  });

  // ==========================================
  // BACKGROUND IMAGES
  // ==========================================

  Object.entries(tokens.backgroundImage.attachment).forEach(([name, value]) => {
    addVar(varName("bg-attachment", name), value);
  });

  Object.entries(tokens.backgroundImage.position).forEach(([name, value]) => {
    addVar(varName("bg-position", name), value);
  });

  Object.entries(tokens.backgroundImage.size).forEach(([name, value]) => {
    addVar(varName("bg-size", name), value);
  });

  Object.entries(tokens.backgroundImage.repeat).forEach(([name, value]) => {
    addVar(varName("bg-repeat", name), value);
  });

  // ==========================================
  // OVERLAYS
  // ==========================================

  addVar(varName("overlay", "none"), tokens.overlay.none);
  addVar(varName("overlay", "light"), tokens.overlay.light);
  addVar(varName("overlay", "dark"), tokens.overlay.dark);
  addVar(varName("overlay", "primary"), tokens.overlay.primary);

  Object.entries(tokens.overlay.opacity).forEach(([level, value]) => {
    addVar(varName("overlay-opacity", level), value);
  });

  // ==========================================
  // BORDERS
  // ==========================================

  Object.entries(tokens.border.width).forEach(([size, value]) => {
    addVar(varName("border-width", size), value);
  });

  Object.entries(tokens.border.style).forEach(([name, value]) => {
    addVar(varName("border-style", name), value);
  });

  Object.entries(tokens.border.color).forEach(([name, value]) => {
    addVar(varName("border-color", name), value);
  });

  // ==========================================
  // DIVIDERS
  // ==========================================

  addVar(varName("divider-height"), tokens.divider.height);

  Object.entries(tokens.divider.width).forEach(([size, value]) => {
    addVar(varName("divider-width", size), value);
  });

  Object.entries(tokens.divider.style).forEach(([name, value]) => {
    addVar(varName("divider-style", name), value);
  });

  Object.entries(tokens.divider.color).forEach(([name, value]) => {
    addVar(varName("divider-color", name), value);
  });

  addVar(varName("divider-opacity"), tokens.divider.opacity);

  // ==========================================
  // SHADOWS
  // ==========================================

  Object.entries(tokens.shadow).forEach(([size, value]) => {
    addVar(varName("shadow", size), value);
  });

  // ==========================================
  // BORDER RADIUS
  // ==========================================

  Object.entries(tokens.borderRadius).forEach(([size, value]) => {
    addVar(varName("border-radius", size), value);
  });

  // ==========================================
  // BACKDROP EFFECTS
  // ==========================================

  Object.entries(tokens.backdrop.blur).forEach(([size, value]) => {
    addVar(varName("backdrop-blur", size), value);
  });

  // ==========================================
  // CONTENT ALIGNMENT
  // ==========================================

  Object.entries(tokens.align.horizontal).forEach(([name, value]) => {
    addVar(varName("align-horizontal", name), value);
  });

  Object.entries(tokens.align.vertical).forEach(([name, value]) => {
    addVar(varName("align-vertical", name), value);
  });

  // ==========================================
  // TEXT ALIGNMENT
  // ==========================================

  Object.entries(tokens.textAlign).forEach(([name, value]) => {
    addVar(varName("text-align", name), value);
  });

  // ==========================================
  // TRANSITIONS
  // ==========================================

  Object.entries(tokens.transition.duration).forEach(([speed, value]) => {
    addVar(varName("transition-duration", speed), value);
  });

  addVar(varName("transition-timing"), tokens.transition.timing);

  // ==========================================
  // Z-INDEX
  // ==========================================

  Object.entries(tokens.zIndex).forEach(([layer, value]) => {
    addVar(varName("z-index", layer), value);
  });

  // ==========================================
  // PATTERNS
  // ==========================================

  addVar(varName("pattern", "none"), tokens.pattern.none);

  // Dots
  Object.entries(tokens.pattern.dots).forEach(([prop, value]) => {
    addVar(varName("pattern-dots", prop), value);
  });

  // Grid
  Object.entries(tokens.pattern.grid).forEach(([prop, value]) => {
    addVar(varName("pattern-grid", prop), value);
  });

  // Lines
  Object.entries(tokens.pattern.lines).forEach(([prop, value]) => {
    addVar(varName("pattern-lines", prop), value);
  });

  // ==========================================
  // BREAKPOINTS
  // ==========================================

  Object.entries(tokens.breakpoints).forEach(([name, value]) => {
    addVar(varName("breakpoint", name), value);
  });

  // Wrap in :root selector
  return `:root {\n${cssVars.join("\n")}\n}`;
}

/**
 * Generate CSS for a specific tenant's section tokens
 * Can be injected via <style> tag or saved to file
 */
export function generateTenantSectionCSS(
  tenantId: string,
  tokens: SectionTokens,
): string {
  const prefix = `--section`;

  // Generate the CSS (same logic as above, but scoped to tenant if needed)
  const css = generateSectionCSS(tokens, prefix);

  // Could wrap in tenant-specific selector if multi-tenant on same page
  // return `[data-tenant="${tenantId}"] {\n${css}\n}`;

  return css;
}
