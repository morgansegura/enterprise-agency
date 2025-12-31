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

// New Comprehensive Settings Panels
export {
  ColorSettingsPanel,
  type ColorSettingsData,
  defaultColorSettings,
} from "./color-settings-panel";

export {
  TypographySettingsPanel,
  type TypographySettingsData,
  defaultTypographySettings,
} from "./typography-settings-panel";

export {
  AnimationSettingsPanel,
  type AnimationSettingsData,
  defaultAnimationSettings,
} from "./animation-settings-panel";

export {
  ComponentSettingsPanel,
  type ComponentSettingsData,
  type DropdownSettings,
  type ModalSettings,
  type DrawerSettings,
  type TabsSettings,
  type TooltipSettings,
  type BadgeSettings,
  type AvatarSettings,
  type NavSettings,
  defaultComponentSettings,
} from "./component-settings-panel";

// Theme Presets
export { ThemePresets, themePresets, type ThemePreset } from "./theme-presets";
