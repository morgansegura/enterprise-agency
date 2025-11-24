/**
 * Design Tokens System
 * Token-based styling for complete tenant customization
 */

// Header Tokens
export { headerDefaults } from "./header-defaults";
export {
  generateHeaderCSS,
  generateTenantHeaderCSS,
} from "./generate-header-css";
export type { HeaderTokens } from "./header-tokens";

// Menu Tokens
export { menuDefaults } from "./menu-defaults";
export { generateMenuCSS, generateTenantMenuCSS } from "./generate-menu-css";
export type { MenuTokens } from "./menu-tokens";

// Footer Tokens
export { footerDefaults } from "./footer-defaults";
export {
  generateFooterCSS,
  generateTenantFooterCSS,
} from "./generate-footer-css";
export type { FooterTokens } from "./footer-tokens";

// Section Tokens
export { sectionDefaults } from "./section-defaults";
export {
  generateSectionCSS,
  generateTenantSectionCSS,
} from "./generate-section-css";
export type { SectionTokens } from "./section-tokens";

// Token Merging
export { mergeTokens } from "./merge-tokens";
export type { TenantTokens, MergedTokens } from "./merge-tokens";

// CSS Generation
export { generateCSS, generateTenantCSS } from "./generate-css";
