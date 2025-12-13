/**
 * Settings Panel Registry
 *
 * Central registry of all available settings panels.
 * Panels are matched to routes via the useSettingsContext hook.
 */

import type {
  EntitySettingsPanelConfig,
  GlobalSettingsPanelConfig,
} from "./types";

// =============================================================================
// Entity Settings Panels
// =============================================================================

/**
 * Registry of entity-specific settings panels.
 * These appear in the Page Settings drawer (first icon).
 */
export const ENTITY_SETTINGS_PANELS: EntitySettingsPanelConfig[] = [
  // Website
  {
    id: "page-settings",
    title: "Page Settings",
    entityType: "page",
    availableModes: ["edit", "create"],
    icon: "FileText",
  },

  // Blog
  {
    id: "post-settings",
    title: "Post Settings",
    entityType: "post",
    availableModes: ["edit", "create"],
    icon: "Newspaper",
  },

  // Shop - Products
  {
    id: "product-settings",
    title: "Product Settings",
    entityType: "product",
    availableModes: ["edit", "create"],
    icon: "Package",
  },

  // Shop - Orders
  {
    id: "order-settings",
    title: "Order Details",
    entityType: "order",
    availableModes: ["detail"],
    icon: "Receipt",
  },

  // Shop - Customers
  {
    id: "customer-settings",
    title: "Customer Settings",
    entityType: "customer",
    availableModes: ["detail", "create"],
    icon: "User",
  },

  // Media
  {
    id: "asset-settings",
    title: "Asset Settings",
    entityType: "asset",
    availableModes: ["detail"],
    icon: "Image",
  },
];

// =============================================================================
// Global Settings Panels
// =============================================================================

/**
 * Registry of global/section settings panels.
 * These appear in the Global Settings drawer (second icon).
 */
export const GLOBAL_SETTINGS_PANELS: GlobalSettingsPanelConfig[] = [
  {
    id: "website-settings",
    title: "Website Settings",
    section: "website",
    icon: "Globe",
    description: "Branding, colors, typography, and site-wide configuration",
  },
  {
    id: "blog-settings",
    title: "Blog Settings",
    section: "blog",
    icon: "Newspaper",
    description: "Blog configuration, default author, comments, and RSS",
  },
  {
    id: "shop-settings",
    title: "Shop Settings",
    section: "shop",
    icon: "Store",
    description: "Payment providers, shipping, taxes, and commerce settings",
  },
  {
    id: "media-settings",
    title: "Media Settings",
    section: "media",
    icon: "Image",
    description: "Storage, upload limits, and media processing",
  },
  {
    id: "admin-settings",
    title: "Admin Settings",
    section: "admin",
    icon: "Shield",
    description: "User management, permissions, and access control",
  },
  {
    id: "bookings-settings",
    title: "Bookings Settings",
    section: "bookings",
    icon: "Calendar",
    description: "Availability, pricing tiers, and booking rules",
  },
];

// =============================================================================
// Lookup Functions
// =============================================================================

/**
 * Get entity settings panel config by entity type.
 */
export function getEntityPanelConfig(
  entityType: string,
  mode: string,
): EntitySettingsPanelConfig | undefined {
  return ENTITY_SETTINGS_PANELS.find(
    (panel) =>
      panel.entityType === entityType &&
      panel.availableModes.includes(mode as "edit" | "create" | "detail"),
  );
}

/**
 * Get global settings panel config by section.
 */
export function getGlobalPanelConfig(
  section: string,
): GlobalSettingsPanelConfig | undefined {
  return GLOBAL_SETTINGS_PANELS.find((panel) => panel.section === section);
}

/**
 * Check if entity settings are available for given entity type and mode.
 */
export function hasEntitySettings(entityType: string, mode: string): boolean {
  return !!getEntityPanelConfig(entityType, mode);
}

/**
 * Check if global settings are available for given section.
 */
export function hasGlobalSettings(section: string): boolean {
  return !!getGlobalPanelConfig(section);
}
