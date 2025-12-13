"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import type {
  RouteContext,
  SettingsSection,
  EntityType,
  EntitySettingsState,
  GlobalSettingsState,
} from "./types";
import {
  ENTITY_SETTINGS_PANELS,
  GLOBAL_SETTINGS_PANELS,
} from "./panel-registry";

// =============================================================================
// Route Pattern Definitions
// =============================================================================

interface RoutePattern {
  /** Regex pattern to match the route */
  pattern: RegExp;
  /** Section this route belongs to */
  section: SettingsSection;
  /** Entity type if applicable */
  entityType?: EntityType;
  /** Extract mode and entityId from match groups */
  extractContext: (
    match: RegExpMatchArray,
    tenantId: string,
    pathname: string,
  ) => Omit<RouteContext, "tenantId" | "pathname">;
}

/**
 * Route patterns ordered by specificity (most specific first).
 * Uses named capture groups for clarity.
 */
const ROUTE_PATTERNS: RoutePattern[] = [
  // ==========================================================================
  // Admin routes
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/dashboard\/users$/,
    section: "admin",
    entityType: "user",
    extractContext: () => ({
      mode: "list",
      section: "admin",
      entityType: "user",
    }),
  },
  {
    pattern: /^\/[^/]+\/dashboard\/clients$/,
    section: "admin",
    entityType: "client",
    extractContext: () => ({
      mode: "list",
      section: "admin",
      entityType: "client",
    }),
  },

  // ==========================================================================
  // Page routes
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/pages\/([^/]+)\/edit$/,
    section: "website",
    entityType: "page",
    extractContext: (match) => ({
      mode: "edit",
      section: "website",
      entityType: "page",
      entityId: match[1] || "",
    }),
  },
  {
    pattern: /^\/[^/]+\/pages\/new$/,
    section: "website",
    entityType: "page",
    extractContext: () => ({
      mode: "create",
      section: "website",
      entityType: "page",
    }),
  },
  {
    pattern: /^\/[^/]+\/pages$/,
    section: "website",
    entityType: "page",
    extractContext: () => ({
      mode: "list",
      section: "website",
      entityType: "page",
    }),
  },

  // ==========================================================================
  // Blog/Post routes
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/posts\/([^/]+)\/edit$/,
    section: "blog",
    entityType: "post",
    extractContext: (match) => ({
      mode: "edit",
      section: "blog",
      entityType: "post",
      entityId: match[1] || "",
    }),
  },
  {
    pattern: /^\/[^/]+\/posts\/new$/,
    section: "blog",
    entityType: "post",
    extractContext: () => ({
      mode: "create",
      section: "blog",
      entityType: "post",
    }),
  },
  {
    pattern: /^\/[^/]+\/posts$/,
    section: "blog",
    entityType: "post",
    extractContext: () => ({
      mode: "list",
      section: "blog",
      entityType: "post",
    }),
  },

  // ==========================================================================
  // Tags routes
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/tags$/,
    section: "blog",
    entityType: "tag",
    extractContext: () => ({
      mode: "list",
      section: "blog",
      entityType: "tag",
    }),
  },

  // ==========================================================================
  // Media routes
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/media$/,
    section: "media",
    entityType: "asset",
    extractContext: () => ({
      mode: "list",
      section: "media",
      entityType: "asset",
    }),
  },

  // ==========================================================================
  // Shop - Product routes
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/shop\/products\/([^/]+)\/edit$/,
    section: "shop",
    entityType: "product",
    extractContext: (match) => ({
      mode: "edit",
      section: "shop",
      entityType: "product",
      entityId: match[1] || "",
    }),
  },
  {
    pattern: /^\/[^/]+\/shop\/products\/new$/,
    section: "shop",
    entityType: "product",
    extractContext: () => ({
      mode: "create",
      section: "shop",
      entityType: "product",
    }),
  },
  {
    pattern: /^\/[^/]+\/shop\/products$/,
    section: "shop",
    entityType: "product",
    extractContext: () => ({
      mode: "list",
      section: "shop",
      entityType: "product",
    }),
  },

  // ==========================================================================
  // Shop - Order routes
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/shop\/orders\/([^/]+)$/,
    section: "shop",
    entityType: "order",
    extractContext: (match) => ({
      mode: "detail",
      section: "shop",
      entityType: "order",
      entityId: match[1] || "",
    }),
  },
  {
    pattern: /^\/[^/]+\/shop\/orders$/,
    section: "shop",
    entityType: "order",
    extractContext: () => ({
      mode: "list",
      section: "shop",
      entityType: "order",
    }),
  },

  // ==========================================================================
  // Shop - Customer routes
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/shop\/customers\/([^/]+)$/,
    section: "shop",
    entityType: "customer",
    extractContext: (match) => ({
      mode: "detail",
      section: "shop",
      entityType: "customer",
      entityId: match[1] || "",
    }),
  },
  {
    pattern: /^\/[^/]+\/shop\/customers\/new$/,
    section: "shop",
    entityType: "customer",
    extractContext: () => ({
      mode: "create",
      section: "shop",
      entityType: "customer",
    }),
  },
  {
    pattern: /^\/[^/]+\/shop\/customers$/,
    section: "shop",
    entityType: "customer",
    extractContext: () => ({
      mode: "list",
      section: "shop",
      entityType: "customer",
    }),
  },

  // ==========================================================================
  // Shop - Dashboard & Settings
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/shop\/settings$/,
    section: "shop",
    extractContext: () => ({ mode: "settings", section: "shop" }),
  },
  {
    pattern: /^\/[^/]+\/shop$/,
    section: "shop",
    extractContext: () => ({ mode: "dashboard", section: "shop" }),
  },

  // ==========================================================================
  // General Settings
  // ==========================================================================
  {
    pattern: /^\/[^/]+\/settings$/,
    section: "website",
    extractContext: () => ({ mode: "settings", section: "website" }),
  },
];

// =============================================================================
// Route Context Parser
// =============================================================================

/**
 * Parses the current pathname and returns the route context.
 */
function parseRouteContext(pathname: string, tenantId: string): RouteContext {
  for (const route of ROUTE_PATTERNS) {
    const match = pathname.match(route.pattern);
    if (match) {
      const extracted = route.extractContext(match, tenantId, pathname);
      return {
        ...extracted,
        tenantId,
        pathname,
      } as RouteContext;
    }
  }

  // Default fallback - try to determine section from path
  const section = determineSectionFromPath(pathname);

  return {
    mode: "unknown",
    section,
    tenantId,
    pathname,
  };
}

/**
 * Determines the section from the pathname when no pattern matches.
 */
function determineSectionFromPath(pathname: string): SettingsSection {
  if (pathname.includes("/shop")) return "shop";
  if (pathname.includes("/posts") || pathname.includes("/tags")) return "blog";
  if (pathname.includes("/media")) return "media";
  if (pathname.includes("/dashboard")) return "admin";
  return "website";
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook that returns the current route context based on pathname.
 * Memoized for performance.
 */
export function useRouteContext(): RouteContext {
  const params = useParams();
  const pathname = usePathname();
  const tenantId = (params?.id as string) || "";

  return useMemo(
    () => parseRouteContext(pathname || "", tenantId),
    [pathname, tenantId],
  );
}

/**
 * Hook that returns entity settings state for the current route.
 * Used by the Page Settings drawer.
 */
export function useEntitySettingsState(): EntitySettingsState {
  const context = useRouteContext();

  return useMemo(() => {
    // Entity settings are only available in edit, create, or detail modes
    const isEntityMode = ["edit", "create", "detail"].includes(context.mode);

    if (
      !isEntityMode ||
      context.mode === "dashboard" ||
      context.mode === "settings" ||
      context.mode === "unknown"
    ) {
      return {
        isAvailable: false,
        context: null,
        panelConfig: null,
      };
    }

    // Get the entity type from context
    const entityType = "entityType" in context ? context.entityType : null;

    if (!entityType) {
      return {
        isAvailable: false,
        context: null,
        panelConfig: null,
      };
    }

    // Find matching panel config
    const panelConfig = ENTITY_SETTINGS_PANELS.find(
      (panel) =>
        panel.entityType === entityType &&
        panel.availableModes.includes(
          context.mode as "edit" | "create" | "detail",
        ),
    );

    return {
      isAvailable: !!panelConfig,
      context,
      panelConfig: panelConfig || null,
    };
  }, [context]);
}

/**
 * Hook that returns global settings state for the current route.
 * Used by the Global Settings drawer.
 */
export function useGlobalSettingsState(): GlobalSettingsState {
  const context = useRouteContext();

  return useMemo(() => {
    const panelConfig = GLOBAL_SETTINGS_PANELS.find(
      (panel) => panel.section === context.section,
    );

    return {
      section: context.section,
      panelConfig: panelConfig || null,
    };
  }, [context.section]);
}

/**
 * Hook that returns both entity and global settings state.
 * Convenience hook for components that need both.
 */
export function useSettingsState() {
  const routeContext = useRouteContext();
  const entitySettings = useEntitySettingsState();
  const globalSettings = useGlobalSettingsState();

  return {
    routeContext,
    entitySettings,
    globalSettings,
  };
}
