/**
 * Configuration Resolvers
 *
 * Utilities to resolve header/footer/menu configurations
 * Handles: string references, inline configs, and null values
 */

import type { SiteConfig } from "./types";
import type { HeaderConfig } from "../headers/types";
import type { FooterConfig } from "../footers/types";
import type { Menu } from "../menus/types";
import { logger } from "../logger";

/**
 * Page with optional header/footer configuration
 * Enterprise: Uses structural typing - any object with these props works
 */
export type PageWithLayout = {
  /** Optional header override */
  header?: string | HeaderConfig | null;
  /** Optional footer override */
  footer?: string | FooterConfig | null;
  /** Allow any other properties (id, slug, sections, etc.) */
  [key: string]: unknown;
};

/**
 * Generic resolver for config references
 * DRY implementation for header/footer resolution
 */
function resolveConfig<T>(
  value: string | T | null | undefined,
  configs: Record<string, T>,
  defaultKey: string,
  type: string,
): T | null {
  // Explicit null = hide
  if (value === null) {
    return null;
  }

  // Inline config object
  if (value && typeof value === "object") {
    return value as T;
  }

  // String reference to named config
  if (typeof value === "string") {
    const config = configs[value];
    if (!config) {
      logger.warn(`${type} reference "${value}" not found in site config`);
      return null;
    }
    return config;
  }

  // Undefined = use default
  const defaultConfig = configs[defaultKey];
  if (!defaultConfig) {
    logger.warn(`Default ${type} "${defaultKey}" not found in site config`);
    return null;
  }

  return defaultConfig;
}

/**
 * Resolve header configuration
 * Enterprise: Accepts any page shape with optional header prop
 */
export function resolveHeader(
  page: PageWithLayout,
  siteConfig: SiteConfig,
): HeaderConfig | null {
  return resolveConfig(
    page.header,
    siteConfig.headers,
    siteConfig.defaults.header,
    "header",
  );
}

/**
 * Resolve footer configuration
 * Enterprise: Accepts any page shape with optional footer prop
 */
export function resolveFooter(
  page: PageWithLayout,
  siteConfig: SiteConfig,
): FooterConfig | null {
  return resolveConfig(
    page.footer,
    siteConfig.footers,
    siteConfig.defaults.footer,
    "footer",
  );
}

/**
 * Resolve menu by reference
 *
 * @param menuRef - Menu reference string
 * @param siteConfig - Complete site configuration
 * @returns Resolved Menu or null
 */
export function resolveMenu(
  menuRef: string,
  siteConfig: SiteConfig,
): Menu | null {
  const menu = siteConfig.menus[menuRef];

  if (!menu) {
    logger.warn(`Menu reference "${menuRef}" not found in site config`);
    return null;
  }

  return menu;
}

/**
 * Get menu for header config
 * Resolves the menu referenced in header.navigation.menuId
 *
 * @param headerConfig - Resolved header configuration
 * @param siteConfig - Complete site configuration
 * @returns Resolved Menu or null
 */
export function getHeaderMenu(
  headerConfig: HeaderConfig,
  siteConfig: SiteConfig,
): Menu | null {
  return resolveMenu(headerConfig.navigation.menuId, siteConfig);
}
