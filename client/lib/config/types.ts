/**
 * Site Configuration Types
 *
 * This defines the complete site configuration structure.
 * In production, this comes from: GET /api/sites/{tenant}/config
 *
 * Multi-tenant architecture:
 * - Each client site has one SiteConfig
 * - Defines all headers, footers, menus, routing, theme
 * - Frontend is 100% data-driven from this config
 */

import type { HeaderConfig } from "../headers/types";
import type { FooterConfig } from "../footers/types";
import type { Menu } from "../menus/types";
import type { LogoConfig } from "../logos/types";
import type { ThemeConfig } from "../types";

/**
 * Page type determines which template/handler to use
 */
export type PageType =
  | "static-page" // Regular pages (/about, /contact)
  | "blog-index" // Blog listing page
  | "blog-post" // Individual blog post
  | "blog-category" // Category archive
  | "shop-index" // Product listing
  | "product" // Individual product
  | "cart" // Shopping cart
  | "checkout"; // Checkout page

/**
 * Route configuration
 * Defines URL patterns for different content types
 */
export type RouteConfig = {
  /** Content type this route handles */
  type: PageType;
  /** URL pattern (e.g., "/blog/:slug" or "/articles/:category/:slug") */
  pattern: string;
  /** Handler identifier for the frontend to use */
  handler: string;
  /** Optional: Custom header for this route type */
  header?: string;
  /** Optional: Custom footer for this route type */
  footer?: string;
};

/**
 * Routing configuration
 * Allows customization of URL structure per tenant
 */
export type RoutingConfig = {
  /** Array of route patterns */
  routes: RouteConfig[];
  /** Home page route */
  home: string;
  /** 404 page route */
  notFound?: string;
};

/**
 * Site defaults
 * Fallback values when page doesn't specify
 */
export type SiteDefaults = {
  /** Default header reference */
  header: string;
  /** Default footer reference */
  footer: string;
  /** Default page type for content */
  pageType?: PageType;
};

/**
 * Complete site configuration
 * Everything needed to render the entire site
 */
export type SiteConfig = {
  /** Tenant identifier */
  tenant: string;

  /** Primary domain for this site */
  domain: string;

  /** Site defaults */
  defaults: SiteDefaults;

  /** Named header configurations */
  headers: Record<string, HeaderConfig>;

  /** Named footer configurations */
  footers: Record<string, FooterConfig>;

  /** Named menu configurations */
  menus: Record<string, Menu>;

  /** Named logo configurations */
  logos: Record<string, LogoConfig>;

  /** Routing configuration */
  routing: RoutingConfig;

  /** Theme configuration */
  theme: ThemeConfig;

  /** Site metadata */
  metadata: {
    siteName: string;
    tagline?: string;
    description?: string;
    logo?: string; // Reference to logo ID
    favicon?: string;
  };
};

/**
 * Type guard to check if a value is a valid header reference
 */
export function isHeaderReference(
  value: string | HeaderConfig | null | undefined,
  config: SiteConfig,
): value is string {
  return typeof value === "string" && value in config.headers;
}

/**
 * Type guard to check if a value is a valid footer reference
 */
export function isFooterReference(
  value: string | FooterConfig | null | undefined,
  config: SiteConfig,
): value is string {
  return typeof value === "string" && value in config.footers;
}

/**
 * Type guard to check if a value is a valid menu reference
 */
export function isMenuReference(
  value: string | Menu | undefined,
  config: SiteConfig,
): value is string {
  return typeof value === "string" && value in config.menus;
}
