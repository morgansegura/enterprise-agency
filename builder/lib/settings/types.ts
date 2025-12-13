/**
 * Settings Context Types
 *
 * Defines the type system for route-aware settings panels.
 * Uses discriminated unions for type-safe context handling.
 */

// =============================================================================
// Section Types - Top-level navigation sections
// =============================================================================

export type SettingsSection =
  | "website"
  | "blog"
  | "shop"
  | "media"
  | "bookings"
  | "admin";

// =============================================================================
// Entity Types - Specific entities that can be edited
// =============================================================================

export type EntityType =
  | "page"
  | "post"
  | "product"
  | "customer"
  | "order"
  | "asset"
  | "tag"
  | "user"
  | "client";

// =============================================================================
// Route Context - Discriminated union for type-safe route handling
// =============================================================================

interface BaseRouteContext {
  tenantId: string;
  section: SettingsSection;
  pathname: string;
}

/** List view - viewing a list of entities (e.g., /pages, /posts) */
export interface ListRouteContext extends BaseRouteContext {
  mode: "list";
  entityType: EntityType;
}

/** Edit view - editing a specific entity (e.g., /pages/123/edit) */
export interface EditRouteContext extends BaseRouteContext {
  mode: "edit";
  entityType: EntityType;
  entityId: string;
}

/** Create view - creating a new entity (e.g., /pages/new) */
export interface CreateRouteContext extends BaseRouteContext {
  mode: "create";
  entityType: EntityType;
}

/** Detail view - viewing entity details without editing (e.g., /orders/123) */
export interface DetailRouteContext extends BaseRouteContext {
  mode: "detail";
  entityType: EntityType;
  entityId: string;
}

/** Dashboard view - section dashboard (e.g., /shop) */
export interface DashboardRouteContext extends BaseRouteContext {
  mode: "dashboard";
}

/** Settings view - dedicated settings page */
export interface SettingsRouteContext extends BaseRouteContext {
  mode: "settings";
}

/** Unknown view - fallback for unrecognized routes */
export interface UnknownRouteContext extends BaseRouteContext {
  mode: "unknown";
}

export type RouteContext =
  | ListRouteContext
  | EditRouteContext
  | CreateRouteContext
  | DetailRouteContext
  | DashboardRouteContext
  | SettingsRouteContext
  | UnknownRouteContext;

// =============================================================================
// Settings Panel Configuration
// =============================================================================

export interface EntitySettingsPanelConfig {
  /** Unique identifier for the panel */
  id: string;
  /** Display title */
  title: string;
  /** Entity type this panel handles */
  entityType: EntityType;
  /** Modes where this panel is available */
  availableModes: Array<"edit" | "create" | "detail">;
  /** Icon component name from lucide-react */
  icon: string;
}

export interface GlobalSettingsPanelConfig {
  /** Unique identifier for the panel */
  id: string;
  /** Display title */
  title: string;
  /** Section this panel handles */
  section: SettingsSection;
  /** Icon component name from lucide-react */
  icon: string;
  /** Description shown in panel header */
  description?: string;
}

// =============================================================================
// Settings State
// =============================================================================

export interface EntitySettingsState {
  /** Whether entity settings are available for current route */
  isAvailable: boolean;
  /** Current route context */
  context: RouteContext | null;
  /** Panel config for current entity type */
  panelConfig: EntitySettingsPanelConfig | null;
}

export interface GlobalSettingsState {
  /** Current section */
  section: SettingsSection;
  /** Panel config for current section */
  panelConfig: GlobalSettingsPanelConfig | null;
}

// =============================================================================
// Type Guards
// =============================================================================

export function isEditContext(
  context: RouteContext,
): context is EditRouteContext {
  return context.mode === "edit";
}

export function isCreateContext(
  context: RouteContext,
): context is CreateRouteContext {
  return context.mode === "create";
}

export function isDetailContext(
  context: RouteContext,
): context is DetailRouteContext {
  return context.mode === "detail";
}

export function isListContext(
  context: RouteContext,
): context is ListRouteContext {
  return context.mode === "list";
}

export function isDashboardContext(
  context: RouteContext,
): context is DashboardRouteContext {
  return context.mode === "dashboard";
}

export function hasEntityId(
  context: RouteContext,
): context is EditRouteContext | DetailRouteContext {
  return context.mode === "edit" || context.mode === "detail";
}

export function isEntityContext(
  context: RouteContext,
): context is EditRouteContext | CreateRouteContext | DetailRouteContext {
  return ["edit", "create", "detail"].includes(context.mode);
}
