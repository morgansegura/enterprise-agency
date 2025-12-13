/**
 * Settings System
 *
 * Route-aware settings panel system for entity and global configuration.
 *
 * @example
 * ```tsx
 * import { useSettingsState, useEntitySettingsState } from '@/lib/settings';
 *
 * function MyComponent() {
 *   const { entitySettings, globalSettings } = useSettingsState();
 *
 *   if (entitySettings.isAvailable) {
 *     // Show entity settings panel
 *   }
 * }
 * ```
 */

// Types
export type {
  SettingsSection,
  EntityType,
  RouteContext,
  ListRouteContext,
  EditRouteContext,
  CreateRouteContext,
  DetailRouteContext,
  DashboardRouteContext,
  SettingsRouteContext,
  UnknownRouteContext,
  EntitySettingsPanelConfig,
  GlobalSettingsPanelConfig,
  EntitySettingsState,
  GlobalSettingsState,
} from "./types";

// Type guards
export {
  isEditContext,
  isCreateContext,
  isDetailContext,
  isListContext,
  isDashboardContext,
  hasEntityId,
  isEntityContext,
} from "./types";

// Hooks
export {
  useRouteContext,
  useEntitySettingsState,
  useGlobalSettingsState,
  useSettingsState,
} from "./use-settings-context";

// Panel registry
export {
  ENTITY_SETTINGS_PANELS,
  GLOBAL_SETTINGS_PANELS,
  getEntityPanelConfig,
  getGlobalPanelConfig,
  hasEntitySettings,
  hasGlobalSettings,
} from "./panel-registry";
