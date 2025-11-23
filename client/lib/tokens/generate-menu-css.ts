import type { MenuTokens } from "./menu-tokens";

/**
 * Generate CSS custom properties from menu tokens
 * Converts nested token object into flat CSS variables
 *
 * @param tokens - Menu token configuration
 * @param prefix - CSS variable prefix (default: "--menu")
 * @returns CSS string with custom properties
 */
export function generateMenuCSS(
  tokens: MenuTokens,
  prefix: string = "--menu",
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
  // LAYOUT & SPACING
  // ==========================================

  addVar(varName("gap", "horizontal"), tokens.gap.horizontal);
  addVar(varName("gap", "vertical"), tokens.gap.vertical);

  // ==========================================
  // MENU ITEMS
  // ==========================================

  addVar(varName("item-font-size"), tokens.item.fontSize);
  addVar(varName("item-font-weight"), tokens.item.fontWeight);
  addVar(varName("item-line-height"), tokens.item.lineHeight);
  addVar(varName("item-padding-x"), tokens.item.padding.x);
  addVar(varName("item-padding-y"), tokens.item.padding.y);
  addVar(varName("item-border-radius"), tokens.item.borderRadius);
  addVar(varName("item-border-width"), tokens.item.border.width);
  addVar(varName("item-border-color"), tokens.item.border.color.default);
  addVar(varName("item-border-color-hover"), tokens.item.border.color.hover);
  addVar(varName("item-border-color-active"), tokens.item.border.color.active);

  // ==========================================
  // COLORS
  // ==========================================

  addVar(varName("color"), tokens.color.default);
  addVar(varName("color-hover"), tokens.color.hover);
  addVar(varName("color-active"), tokens.color.active);

  addVar(varName("bg"), tokens.background.default);
  addVar(varName("bg-hover"), tokens.background.hover);
  addVar(varName("bg-active"), tokens.background.active);

  // ==========================================
  // VARIANTS - Pills
  // ==========================================

  addVar(
    varName("variant-pills-border-radius"),
    tokens.variants.pills.borderRadius,
  );
  addVar(varName("variant-pills-bg"), tokens.variants.pills.background.default);
  addVar(
    varName("variant-pills-bg-hover"),
    tokens.variants.pills.background.hover,
  );
  addVar(
    varName("variant-pills-bg-active"),
    tokens.variants.pills.background.active,
  );

  // ==========================================
  // VARIANTS - Underline
  // ==========================================

  addVar(
    varName("variant-underline-border-width"),
    tokens.variants.underline.borderWidth,
  );
  addVar(
    varName("variant-underline-border-color"),
    tokens.variants.underline.borderColor.default,
  );
  addVar(
    varName("variant-underline-border-color-hover"),
    tokens.variants.underline.borderColor.hover,
  );
  addVar(
    varName("variant-underline-border-color-active"),
    tokens.variants.underline.borderColor.active,
  );
  addVar(varName("variant-underline-offset"), tokens.variants.underline.offset);

  // ==========================================
  // VARIANTS - Bordered
  // ==========================================

  addVar(
    varName("variant-bordered-border-width"),
    tokens.variants.bordered.borderWidth,
  );
  addVar(
    varName("variant-bordered-border-color"),
    tokens.variants.bordered.borderColor.default,
  );
  addVar(
    varName("variant-bordered-border-color-hover"),
    tokens.variants.bordered.borderColor.hover,
  );
  addVar(
    varName("variant-bordered-border-color-active"),
    tokens.variants.bordered.borderColor.active,
  );

  // ==========================================
  // VARIANTS - Minimal
  // ==========================================

  addVar(
    varName("variant-minimal-padding-x"),
    tokens.variants.minimal.padding.x,
  );
  addVar(
    varName("variant-minimal-padding-y"),
    tokens.variants.minimal.padding.y,
  );

  // ==========================================
  // DROPDOWN
  // ==========================================

  addVar(varName("dropdown-width"), tokens.dropdown.width);
  addVar(varName("dropdown-padding"), tokens.dropdown.padding);
  addVar(varName("dropdown-gap"), tokens.dropdown.gap);
  addVar(varName("dropdown-bg"), tokens.dropdown.background);
  addVar(varName("dropdown-border-width"), tokens.dropdown.border.width);
  addVar(varName("dropdown-border-color"), tokens.dropdown.border.color);
  addVar(varName("dropdown-border-radius"), tokens.dropdown.border.radius);
  addVar(varName("dropdown-shadow"), tokens.dropdown.shadow);

  // Dropdown animation
  addVar(
    varName("dropdown-animation-duration"),
    tokens.dropdown.animation.duration,
  );
  addVar(
    varName("dropdown-animation-timing"),
    tokens.dropdown.animation.timing,
  );
  addVar(
    varName("dropdown-slide-distance"),
    tokens.dropdown.animation.slideDistance,
  );

  // Dropdown items
  addVar(varName("dropdown-item-font-size"), tokens.dropdown.item.fontSize);
  addVar(varName("dropdown-item-font-weight"), tokens.dropdown.item.fontWeight);
  addVar(varName("dropdown-item-padding-x"), tokens.dropdown.item.padding.x);
  addVar(varName("dropdown-item-padding-y"), tokens.dropdown.item.padding.y);
  addVar(
    varName("dropdown-item-border-radius"),
    tokens.dropdown.item.borderRadius,
  );
  addVar(varName("dropdown-item-color"), tokens.dropdown.item.color.default);
  addVar(
    varName("dropdown-item-color-hover"),
    tokens.dropdown.item.color.hover,
  );
  addVar(varName("dropdown-item-bg"), tokens.dropdown.item.background.default);
  addVar(
    varName("dropdown-item-bg-hover"),
    tokens.dropdown.item.background.hover,
  );

  // ==========================================
  // MEGA MENU
  // ==========================================

  addVar(varName("megamenu-width"), tokens.megaMenu.width);
  addVar(varName("megamenu-max-width"), tokens.megaMenu.maxWidth);
  addVar(varName("megamenu-padding"), tokens.megaMenu.padding);
  addVar(varName("megamenu-gap"), tokens.megaMenu.gap);
  addVar(varName("megamenu-bg"), tokens.megaMenu.background);
  addVar(varName("megamenu-border-width"), tokens.megaMenu.border.width);
  addVar(varName("megamenu-border-color"), tokens.megaMenu.border.color);
  addVar(varName("megamenu-border-radius"), tokens.megaMenu.border.radius);
  addVar(varName("megamenu-shadow"), tokens.megaMenu.shadow);

  // Mega menu headings
  addVar(
    varName("megamenu-heading-font-size"),
    tokens.megaMenu.heading.fontSize,
  );
  addVar(
    varName("megamenu-heading-font-weight"),
    tokens.megaMenu.heading.fontWeight,
  );
  addVar(varName("megamenu-heading-color"), tokens.megaMenu.heading.color);
  addVar(
    varName("megamenu-heading-margin-bottom"),
    tokens.megaMenu.heading.marginBottom,
  );

  // Mega menu items
  addVar(varName("megamenu-item-font-size"), tokens.megaMenu.item.fontSize);
  addVar(varName("megamenu-item-padding-x"), tokens.megaMenu.item.padding.x);
  addVar(varName("megamenu-item-padding-y"), tokens.megaMenu.item.padding.y);

  // ==========================================
  // BADGES
  // ==========================================

  addVar(varName("badge-font-size"), tokens.badge.fontSize);
  addVar(varName("badge-font-weight"), tokens.badge.fontWeight);
  addVar(varName("badge-padding-x"), tokens.badge.padding.x);
  addVar(varName("badge-padding-y"), tokens.badge.padding.y);
  addVar(varName("badge-border-radius"), tokens.badge.borderRadius);
  addVar(varName("badge-margin-left"), tokens.badge.marginLeft);

  // Badge variants
  addVar(varName("badge-new-bg"), tokens.badge.new.background);
  addVar(varName("badge-new-color"), tokens.badge.new.color);
  addVar(varName("badge-hot-bg"), tokens.badge.hot.background);
  addVar(varName("badge-hot-color"), tokens.badge.hot.color);
  addVar(varName("badge-sale-bg"), tokens.badge.sale.background);
  addVar(varName("badge-sale-color"), tokens.badge.sale.color);

  // ==========================================
  // ICONS
  // ==========================================

  addVar(varName("icon-size"), tokens.icon.size);
  addVar(varName("icon-margin-left"), tokens.icon.marginLeft);
  addVar(varName("icon-margin-right"), tokens.icon.marginRight);
  addVar(varName("icon-color"), tokens.icon.color.default);
  addVar(varName("icon-color-hover"), tokens.icon.color.hover);

  // ==========================================
  // MOBILE
  // ==========================================

  addVar(varName("mobile-font-size"), tokens.mobile.fontSize);
  addVar(varName("mobile-font-weight"), tokens.mobile.fontWeight);
  addVar(varName("mobile-padding-x"), tokens.mobile.padding.x);
  addVar(varName("mobile-padding-y"), tokens.mobile.padding.y);
  addVar(varName("mobile-gap"), tokens.mobile.gap);
  addVar(varName("mobile-border-radius"), tokens.mobile.borderRadius);

  // Mobile submenu
  addVar(varName("mobile-submenu-indent"), tokens.mobile.submenu.indent);
  addVar(
    varName("mobile-submenu-border-width"),
    tokens.mobile.submenu.borderLeft.width,
  );
  addVar(
    varName("mobile-submenu-border-color"),
    tokens.mobile.submenu.borderLeft.color,
  );
  addVar(varName("mobile-submenu-bg"), tokens.mobile.submenu.background);

  // ==========================================
  // CONTEXT OVERRIDES - Header
  // ==========================================

  if (tokens.contexts.header.fontSize) {
    addVar(
      varName("context-header-font-size"),
      tokens.contexts.header.fontSize,
    );
  }
  if (tokens.contexts.header.fontWeight) {
    addVar(
      varName("context-header-font-weight"),
      tokens.contexts.header.fontWeight,
    );
  }
  if (tokens.contexts.header.color?.default) {
    addVar(
      varName("context-header-color"),
      tokens.contexts.header.color.default,
    );
  }
  if (tokens.contexts.header.color?.hover) {
    addVar(
      varName("context-header-color-hover"),
      tokens.contexts.header.color.hover,
    );
  }
  if (tokens.contexts.header.color?.active) {
    addVar(
      varName("context-header-color-active"),
      tokens.contexts.header.color.active,
    );
  }

  // ==========================================
  // CONTEXT OVERRIDES - Footer
  // ==========================================

  if (tokens.contexts.footer.fontSize) {
    addVar(
      varName("context-footer-font-size"),
      tokens.contexts.footer.fontSize,
    );
  }
  if (tokens.contexts.footer.fontWeight) {
    addVar(
      varName("context-footer-font-weight"),
      tokens.contexts.footer.fontWeight,
    );
  }
  if (tokens.contexts.footer.color?.default) {
    addVar(
      varName("context-footer-color"),
      tokens.contexts.footer.color.default,
    );
  }
  if (tokens.contexts.footer.color?.hover) {
    addVar(
      varName("context-footer-color-hover"),
      tokens.contexts.footer.color.hover,
    );
  }
  if (tokens.contexts.footer.color?.active) {
    addVar(
      varName("context-footer-color-active"),
      tokens.contexts.footer.color.active,
    );
  }

  // ==========================================
  // CONTEXT OVERRIDES - Sidebar
  // ==========================================

  if (tokens.contexts.sidebar.fontSize) {
    addVar(
      varName("context-sidebar-font-size"),
      tokens.contexts.sidebar.fontSize,
    );
  }
  if (tokens.contexts.sidebar.fontWeight) {
    addVar(
      varName("context-sidebar-font-weight"),
      tokens.contexts.sidebar.fontWeight,
    );
  }
  if (tokens.contexts.sidebar.padding?.x) {
    addVar(
      varName("context-sidebar-padding-x"),
      tokens.contexts.sidebar.padding.x,
    );
  }
  if (tokens.contexts.sidebar.padding?.y) {
    addVar(
      varName("context-sidebar-padding-y"),
      tokens.contexts.sidebar.padding.y,
    );
  }

  // Wrap in :root selector
  return `:root {\n${cssVars.join("\n")}\n}`;
}

/**
 * Generate CSS for a specific tenant's menu tokens
 * Can be injected via <style> tag or saved to file
 */
export function generateTenantMenuCSS(
  tenantId: string,
  tokens: MenuTokens,
): string {
  const prefix = `--menu`;

  // Generate the CSS (same logic as above, but scoped to tenant if needed)
  const css = generateMenuCSS(tokens, prefix);

  // Could wrap in tenant-specific selector if multi-tenant on same page
  // return `[data-tenant="${tenantId}"] {\n${css}\n}`;

  return css;
}
