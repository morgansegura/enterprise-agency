import type { HeaderTokens } from "./header-tokens";

/**
 * Generate CSS custom properties from header tokens
 * Converts nested token object into flat CSS variables
 *
 * @param tokens - Header token configuration
 * @param prefix - CSS variable prefix (default: "--header")
 * @returns CSS string with custom properties
 */
export function generateHeaderCSS(
  tokens: HeaderTokens,
  prefix: string = "--header",
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

  addVar(varName("height"), tokens.height.default);
  addVar(varName("height", "shrunk"), tokens.height.shrunk);
  addVar(varName("height", "mobile"), tokens.height.mobile);

  addVar(varName("max-width", "narrow"), tokens.maxWidth.narrow);
  addVar(varName("max-width", "container"), tokens.maxWidth.container);
  addVar(varName("max-width", "full"), tokens.maxWidth.full);

  addVar(varName("padding-x"), tokens.padding.x.default);
  addVar(varName("padding-x", "mobile"), tokens.padding.x.mobile);
  addVar(varName("padding-y"), tokens.padding.y.default);
  addVar(varName("padding-y", "shrunk"), tokens.padding.y.shrunk);
  addVar(varName("padding-y", "mobile"), tokens.padding.y.mobile);

  addVar(varName("gap"), tokens.gap.default);
  addVar(varName("gap", "mobile"), tokens.gap.mobile);

  // ==========================================
  // BEHAVIOR & ANIMATION
  // ==========================================

  addVar(varName("scroll-threshold"), tokens.scroll.threshold);
  addVar(varName("scroll-shrink-threshold"), tokens.scroll.shrinkThreshold);

  addVar(varName("transition-duration"), tokens.transition.duration.default);
  addVar(
    varName("transition-duration", "slow"),
    tokens.transition.duration.slow,
  );
  addVar(varName("transition-timing"), tokens.transition.timing);

  addVar(varName("z-index"), tokens.zIndex.header);
  addVar(varName("z-index", "dropdown"), tokens.zIndex.dropdown);
  addVar(varName("z-index", "mobile-nav"), tokens.zIndex.mobileNav);

  addVar(varName("transform-hide"), tokens.transform.hideDistance);

  // ==========================================
  // VISUAL STYLING
  // ==========================================

  addVar(varName("bg"), tokens.background.default);
  addVar(varName("bg", "scrolled"), tokens.background.scrolled);
  addVar(varName("bg", "transparent"), tokens.background.transparent);
  addVar(varName("bg", "blur"), tokens.background.blur);

  addVar(varName("border-width"), tokens.border.width);
  addVar(varName("border-color"), tokens.border.color.default);
  addVar(varName("border-color", "scrolled"), tokens.border.color.scrolled);
  addVar(
    varName("border-color", "transparent"),
    tokens.border.color.transparent,
  );
  addVar(varName("border-radius"), tokens.border.radius);

  addVar(varName("shadow", "none"), tokens.shadow.none);
  addVar(varName("shadow"), tokens.shadow.default);
  addVar(varName("shadow", "scrolled"), tokens.shadow.scrolled);
  addVar(varName("shadow", "large"), tokens.shadow.large);

  addVar(varName("blur", "none"), tokens.blur.none);
  addVar(varName("blur"), tokens.blur.default);
  addVar(varName("blur", "strong"), tokens.blur.strong);

  addVar(varName("opacity", "transparent"), tokens.opacity.transparent);
  addVar(varName("opacity", "translucent"), tokens.opacity.translucent);
  addVar(varName("opacity", "opaque"), tokens.opacity.opaque);

  // ==========================================
  // LOGO
  // ==========================================

  addVar(varName("logo-height"), tokens.logo.height.default);
  addVar(varName("logo-height", "shrunk"), tokens.logo.height.shrunk);
  addVar(varName("logo-height", "mobile"), tokens.logo.height.mobile);
  addVar(varName("logo-max-width"), tokens.logo.maxWidth);
  addVar(varName("logo-gap"), tokens.logo.gap);

  // ==========================================
  // NAVIGATION
  // ==========================================

  addVar(varName("nav-gap"), tokens.nav.gap);

  // Nav link typography
  addVar(varName("nav-link-font-size"), tokens.nav.link.fontSize);
  addVar(varName("nav-link-font-weight"), tokens.nav.link.fontWeight);
  addVar(varName("nav-link-line-height"), tokens.nav.link.lineHeight);
  addVar(varName("nav-link-padding-x"), tokens.nav.link.padding.x);
  addVar(varName("nav-link-padding-y"), tokens.nav.link.padding.y);
  addVar(varName("nav-link-border-radius"), tokens.nav.link.borderRadius);

  // Nav link colors
  addVar(varName("nav-link-color"), tokens.nav.color.default);
  addVar(varName("nav-link-color", "hover"), tokens.nav.color.hover);
  addVar(varName("nav-link-color", "active"), tokens.nav.color.active);

  // Nav link backgrounds
  addVar(varName("nav-link-bg"), tokens.nav.bg.default);
  addVar(varName("nav-link-bg", "hover"), tokens.nav.bg.hover);
  addVar(varName("nav-link-bg", "active"), tokens.nav.bg.active);

  // Nav link borders
  addVar(varName("nav-link-border-width"), tokens.nav.border.width);
  addVar(varName("nav-link-border-color"), tokens.nav.border.color.default);
  addVar(
    varName("nav-link-border-color", "hover"),
    tokens.nav.border.color.hover,
  );
  addVar(
    varName("nav-link-border-color", "active"),
    tokens.nav.border.color.active,
  );

  // Dropdown
  addVar(varName("dropdown-width"), tokens.nav.dropdown.width);
  addVar(varName("dropdown-padding"), tokens.nav.dropdown.padding);
  addVar(varName("dropdown-gap"), tokens.nav.dropdown.gap);
  addVar(varName("dropdown-bg"), tokens.nav.dropdown.bg);
  addVar(varName("dropdown-border-width"), tokens.nav.dropdown.border.width);
  addVar(varName("dropdown-border-color"), tokens.nav.dropdown.border.color);
  addVar(varName("dropdown-border-radius"), tokens.nav.dropdown.border.radius);
  addVar(varName("dropdown-shadow"), tokens.nav.dropdown.shadow);
  addVar(
    varName("dropdown-animation-duration"),
    tokens.nav.dropdown.animation.duration,
  );
  addVar(
    varName("dropdown-animation-timing"),
    tokens.nav.dropdown.animation.timing,
  );
  addVar(
    varName("dropdown-slide-distance"),
    tokens.nav.dropdown.animation.slideDistance,
  );

  // Dropdown items
  addVar(
    varName("dropdown-item-padding-x"),
    tokens.nav.dropdown.item.padding.x,
  );
  addVar(
    varName("dropdown-item-padding-y"),
    tokens.nav.dropdown.item.padding.y,
  );
  addVar(
    varName("dropdown-item-border-radius"),
    tokens.nav.dropdown.item.borderRadius,
  );
  addVar(
    varName("dropdown-item-color"),
    tokens.nav.dropdown.item.color.default,
  );
  addVar(
    varName("dropdown-item-color", "hover"),
    tokens.nav.dropdown.item.color.hover,
  );
  addVar(varName("dropdown-item-bg"), tokens.nav.dropdown.item.bg.default);
  addVar(
    varName("dropdown-item-bg", "hover"),
    tokens.nav.dropdown.item.bg.hover,
  );

  // ==========================================
  // ACTIONS
  // ==========================================

  addVar(varName("actions-gap"), tokens.actions.gap);

  // Icon buttons
  addVar(varName("icon-button-size"), tokens.actions.iconButton.size);
  addVar(varName("icon-button-padding"), tokens.actions.iconButton.padding);
  addVar(
    varName("icon-button-border-radius"),
    tokens.actions.iconButton.borderRadius,
  );
  addVar(varName("icon-button-color"), tokens.actions.iconButton.color.default);
  addVar(
    varName("icon-button-color", "hover"),
    tokens.actions.iconButton.color.hover,
  );
  addVar(varName("icon-button-bg"), tokens.actions.iconButton.bg.default);
  addVar(
    varName("icon-button-bg", "hover"),
    tokens.actions.iconButton.bg.hover,
  );

  // CTA buttons
  addVar(varName("button-font-size"), tokens.actions.button.fontSize);
  addVar(varName("button-font-weight"), tokens.actions.button.fontWeight);
  addVar(varName("button-padding-x"), tokens.actions.button.padding.x);
  addVar(varName("button-padding-y"), tokens.actions.button.padding.y);
  addVar(varName("button-border-radius"), tokens.actions.button.borderRadius);

  // Badges
  addVar(varName("badge-size"), tokens.actions.badge.size);
  addVar(varName("badge-font-size"), tokens.actions.badge.fontSize);
  addVar(varName("badge-font-weight"), tokens.actions.badge.fontWeight);
  addVar(varName("badge-offset-top"), tokens.actions.badge.offset.top);
  addVar(varName("badge-offset-right"), tokens.actions.badge.offset.right);
  addVar(varName("badge-bg"), tokens.actions.badge.bg);
  addVar(varName("badge-color"), tokens.actions.badge.color);

  // ==========================================
  // MOBILE
  // ==========================================

  addVar(varName("mobile-breakpoint"), tokens.mobile.breakpoint);

  // Mobile toggle
  addVar(varName("mobile-toggle-size"), tokens.mobile.toggle.size);
  addVar(varName("mobile-toggle-padding"), tokens.mobile.toggle.padding);
  addVar(varName("mobile-toggle-icon-size"), tokens.mobile.toggle.iconSize);

  // Mobile drawer
  addVar(varName("mobile-drawer-width"), tokens.mobile.drawer.width);
  addVar(varName("mobile-drawer-bg"), tokens.mobile.drawer.bg);
  addVar(varName("mobile-drawer-padding"), tokens.mobile.drawer.padding);

  // Mobile nav items
  addVar(varName("mobile-nav-item-font-size"), tokens.mobile.navItem.fontSize);
  addVar(
    varName("mobile-nav-item-font-weight"),
    tokens.mobile.navItem.fontWeight,
  );
  addVar(varName("mobile-nav-item-padding-x"), tokens.mobile.navItem.padding.x);
  addVar(varName("mobile-nav-item-padding-y"), tokens.mobile.navItem.padding.y);
  addVar(varName("mobile-nav-item-gap"), tokens.mobile.navItem.gap);
  addVar(
    varName("mobile-nav-item-border-radius"),
    tokens.mobile.navItem.borderRadius,
  );
  addVar(varName("mobile-nav-item-color"), tokens.mobile.navItem.color.default);
  addVar(
    varName("mobile-nav-item-color", "hover"),
    tokens.mobile.navItem.color.hover,
  );
  addVar(
    varName("mobile-nav-item-color", "active"),
    tokens.mobile.navItem.color.active,
  );
  addVar(varName("mobile-nav-item-bg"), tokens.mobile.navItem.bg.default);
  addVar(
    varName("mobile-nav-item-bg", "hover"),
    tokens.mobile.navItem.bg.hover,
  );
  addVar(
    varName("mobile-nav-item-bg", "active"),
    tokens.mobile.navItem.bg.active,
  );

  // Mobile submenu
  addVar(varName("mobile-submenu-indent"), tokens.mobile.submenu.indent);
  addVar(
    varName("mobile-submenu-border-color"),
    tokens.mobile.submenu.borderColor,
  );

  // ==========================================
  // TEMPLATE OVERRIDES
  // ==========================================

  addVar(
    varName("template-centered-logo-margin-bottom"),
    tokens.templates.centered.logoMarginBottom,
  );
  addVar(
    varName("template-centered-nav-margin-top"),
    tokens.templates.centered.navMarginTop,
  );
  addVar(
    varName("template-split-nav-justify"),
    tokens.templates.split.navJustify,
  );
  addVar(
    varName("template-minimal-padding-x"),
    tokens.templates.minimal.padding.x,
  );
  addVar(
    varName("template-minimal-padding-y"),
    tokens.templates.minimal.padding.y,
  );

  // Wrap in :root selector
  return `:root {\n${cssVars.join("\n")}\n}`;
}

/**
 * Generate CSS for a specific tenant's header tokens
 * Can be injected via <style> tag or saved to file
 */
export function generateTenantHeaderCSS(
  tenantId: string,
  tokens: HeaderTokens,
): string {
  const prefix = `--header`;

  // Generate the CSS (same logic as above, but scoped to tenant if needed)
  const css = generateHeaderCSS(tokens, prefix);

  // Could wrap in tenant-specific selector if multi-tenant on same page
  // return `[data-tenant="${tenantId}"] {\n${css}\n}`;

  return css;
}
