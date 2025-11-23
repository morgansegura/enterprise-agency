import type { FooterTokens } from "./footer-tokens";

/**
 * Generate CSS custom properties from footer tokens
 * Converts nested token object into flat CSS variables
 *
 * @param tokens - Footer token configuration
 * @param prefix - CSS variable prefix (default: "--footer")
 * @returns CSS string with custom properties
 */
export function generateFooterCSS(
  tokens: FooterTokens,
  prefix: string = "--footer",
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
  // LAYOUT & STRUCTURE
  // ==========================================

  addVar(varName("padding-x"), tokens.padding.x.default);
  addVar(varName("padding-x-mobile"), tokens.padding.x.mobile);
  addVar(varName("padding-y"), tokens.padding.y.default);
  addVar(varName("padding-y-mobile"), tokens.padding.y.mobile);

  addVar(varName("gap-sections"), tokens.gap.sections);
  addVar(varName("gap-mobile"), tokens.gap.mobile);

  addVar(varName("max-width-narrow"), tokens.maxWidth.narrow);
  addVar(varName("max-width-container"), tokens.maxWidth.container);
  addVar(varName("max-width-full"), tokens.maxWidth.full);

  // ==========================================
  // VISUAL STYLING
  // ==========================================

  addVar(varName("bg"), tokens.background.default);
  addVar(varName("bg-secondary"), tokens.background.secondary);

  addVar(varName("border-width"), tokens.border.width);
  addVar(varName("border-color"), tokens.border.color.default);
  addVar(varName("border-color-top"), tokens.border.color.top);

  // ==========================================
  // SECTIONS & COLUMNS
  // ==========================================

  addVar(varName("section-padding-y"), tokens.section.padding.y);
  addVar(varName("section-gap"), tokens.section.gap);

  addVar(varName("columns-gap"), tokens.columns.gap);
  addVar(varName("columns-min-width"), tokens.columns.minWidth);

  // ==========================================
  // SECTION HEADINGS
  // ==========================================

  addVar(varName("heading-font-size"), tokens.heading.fontSize);
  addVar(varName("heading-font-weight"), tokens.heading.fontWeight);
  addVar(varName("heading-line-height"), tokens.heading.lineHeight);
  addVar(varName("heading-color"), tokens.heading.color);
  addVar(varName("heading-margin-bottom"), tokens.heading.marginBottom);
  addVar(varName("heading-text-transform"), tokens.heading.textTransform);

  // ==========================================
  // LINKS
  // ==========================================

  addVar(varName("link-font-size"), tokens.link.fontSize);
  addVar(varName("link-font-weight"), tokens.link.fontWeight);
  addVar(varName("link-line-height"), tokens.link.lineHeight);
  addVar(varName("link-color"), tokens.link.color.default);
  addVar(varName("link-color-hover"), tokens.link.color.hover);
  addVar(varName("link-text-decoration"), tokens.link.textDecoration.default);
  addVar(
    varName("link-text-decoration-hover"),
    tokens.link.textDecoration.hover,
  );

  // ==========================================
  // TEXT
  // ==========================================

  addVar(varName("text-font-size"), tokens.text.fontSize);
  addVar(varName("text-font-weight"), tokens.text.fontWeight);
  addVar(varName("text-line-height"), tokens.text.lineHeight);
  addVar(varName("text-color"), tokens.text.color);

  // ==========================================
  // SOCIAL LINKS
  // ==========================================

  addVar(varName("social-gap"), tokens.social.gap);
  addVar(varName("social-icon-size"), tokens.social.iconSize);
  addVar(varName("social-color"), tokens.social.color.default);
  addVar(varName("social-color-hover"), tokens.social.color.hover);
  addVar(varName("social-bg"), tokens.social.background.default);
  addVar(varName("social-bg-hover"), tokens.social.background.hover);
  addVar(varName("social-border-radius"), tokens.social.borderRadius);
  addVar(varName("social-padding"), tokens.social.padding);

  // ==========================================
  // BOTTOM BAR
  // ==========================================

  addVar(varName("bottom-bar-padding-y"), tokens.bottomBar.padding.y);
  addVar(varName("bottom-bar-font-size"), tokens.bottomBar.fontSize);
  addVar(varName("bottom-bar-font-weight"), tokens.bottomBar.fontWeight);
  addVar(varName("bottom-bar-color"), tokens.bottomBar.color);
  addVar(varName("bottom-bar-bg"), tokens.bottomBar.background);
  addVar(varName("bottom-bar-border-width"), tokens.bottomBar.borderTop.width);
  addVar(varName("bottom-bar-border-color"), tokens.bottomBar.borderTop.color);

  // ==========================================
  // CTA SECTION
  // ==========================================

  addVar(varName("cta-padding-y"), tokens.cta.padding.y);
  addVar(varName("cta-bg"), tokens.cta.background);
  addVar(varName("cta-border-radius"), tokens.cta.borderRadius);
  addVar(varName("cta-title-font-size"), tokens.cta.title.fontSize);
  addVar(varName("cta-title-font-weight"), tokens.cta.title.fontWeight);
  addVar(varName("cta-title-color"), tokens.cta.title.color);
  addVar(varName("cta-title-margin-bottom"), tokens.cta.title.marginBottom);
  addVar(varName("cta-description-font-size"), tokens.cta.description.fontSize);
  addVar(varName("cta-description-color"), tokens.cta.description.color);
  addVar(
    varName("cta-description-margin-bottom"),
    tokens.cta.description.marginBottom,
  );

  // ==========================================
  // TEMPLATE VARIATIONS
  // ==========================================

  addVar(
    varName("template-centered-logo-margin-bottom"),
    tokens.templates.centered.logoMarginBottom,
  );
  addVar(
    varName("template-centered-text-align"),
    tokens.templates.centered.textAlign,
  );

  addVar(
    varName("template-stacked-section-gap"),
    tokens.templates.stacked.sectionGap,
  );

  addVar(
    varName("template-minimal-padding-y"),
    tokens.templates.minimal.padding.y,
  );

  // Wrap in :root selector
  return `:root {\n${cssVars.join("\n")}\n}`;
}

/**
 * Generate CSS for a specific tenant's footer tokens
 * Can be injected via <style> tag or saved to file
 */
export function generateTenantFooterCSS(
  tenantId: string,
  tokens: FooterTokens,
): string {
  const prefix = `--footer`;

  // Generate the CSS (same logic as above, but scoped to tenant if needed)
  const css = generateFooterCSS(tokens, prefix);

  // Could wrap in tenant-specific selector if multi-tenant on same page
  // return `[data-tenant="${tenantId}"] {\n${css}\n}`;

  return css;
}
