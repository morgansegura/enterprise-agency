/**
 * Settings Components
 *
 * This module exports all settings-related components including
 * the smart settings drawers and their associated panels.
 */

// Smart Drawers
export { EntitySettingsDrawer } from "./entity-settings-drawer";
export { GlobalSettingsDrawer } from "./global-settings-drawer";

// Entity Panels
export {
  PageSettingsPanel,
  type PageSettingsData,
  PostSettingsPanel,
  type PostSettingsData,
  ProductSettingsPanel,
  type ProductSettingsData,
} from "./entity-panels";

// Global Panels
export {
  ShopGlobalSettings,
  type ShopGlobalSettingsData,
  BlogGlobalSettings,
  type BlogGlobalSettingsData,
  WebsiteGlobalSettings,
  type WebsiteGlobalSettingsData,
} from "./global-panels";
