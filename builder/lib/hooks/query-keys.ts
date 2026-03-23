/**
 * Query key factory for consistent query key generation
 *
 * Hierarchical structure allows for efficient invalidation:
 * - Invalidate all admin queries: queryClient.invalidateQueries({ queryKey: ['admin'] })
 * - Invalidate all user queries: queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
 * - Invalidate specific user: queryClient.invalidateQueries({ queryKey: ['admin', 'users', userId] })
 */

export const queryKeys = {
  admin: {
    users: {
      all: (filters?: { includeDeleted?: boolean }) =>
        ["admin", "users", filters] as const,
      detail: (id: string) => ["admin", "users", id] as const,
      search: (query: string) => ["admin", "users", "search", query] as const,
    },
    features: {
      available: () => ["admin", "features", "available"] as const,
      tenant: (tenantId: string) =>
        ["admin", "features", "tenant", tenantId] as const,
    },
    projects: {
      assignments: (filters?: { tenantId?: string; userId?: string }) =>
        ["admin", "projects", "assignments", filters] as const,
      detail: (id: string) => ["admin", "projects", "assignments", id] as const,
    },
    tenants: {
      all: () => ["admin", "tenants"] as const,
      detail: (id: string) => ["admin", "tenants", id] as const,
      stats: (id: string) => ["admin", "tenants", id, "stats"] as const,
      activity: (id: string, days?: number) =>
        ["admin", "tenants", id, "activity", { days }] as const,
    },
  },
  tenants: {
    all: () => ["tenants"] as const,
    detail: (id: string) => ["tenants", id] as const,
    users: (tenantId: string) => ["tenants", tenantId, "users"] as const,
    stats: (tenantId: string) => ["tenants", tenantId, "stats"] as const,
    hierarchy: (tenantId: string) => ["tenants", tenantId, "hierarchy"] as const,
    access: (tenantId: string) => ["tenants", tenantId, "access"] as const,
    children: (parentTenantId: string) => ["tenants", parentTenantId, "children"] as const,
    agency: () => ["tenants", "agency"] as const,
    accessible: () => ["tenants", "accessible"] as const,
    byType: (type: string) => ["tenants", "type", type] as const,
    health: () => ["tenants", "health", "overview"] as const,
  },

  // ============================================================================
  // Content
  // ============================================================================

  pages: {
    all: ["pages"] as const,
    lists: () => [...queryKeys.pages.all, "list"] as const,
    list: (tenantId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.pages.lists(), tenantId, filters] as const,
    details: () => [...queryKeys.pages.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.pages.details(), tenantId, id] as const,
    slug: (tenantId: string, slug: string) =>
      [...queryKeys.pages.all, tenantId, "slug", slug] as const,
    versions: (tenantId: string, pageId: string) =>
      [...queryKeys.pages.all, tenantId, pageId, "versions"] as const,
    version: (tenantId: string, pageId: string, versionId: string) =>
      [...queryKeys.pages.all, tenantId, pageId, "versions", versionId] as const,
    versionCompare: (
      tenantId: string,
      pageId: string,
      versionIdA: string,
      versionIdB: string,
    ) =>
      [
        ...queryKeys.pages.all,
        tenantId,
        pageId,
        "versions",
        "compare",
        versionIdA,
        versionIdB,
      ] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.pages.all, tenantId] as const,
  },

  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (tenantId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.posts.lists(), tenantId, filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.posts.details(), tenantId, id] as const,
    slug: (tenantId: string, slug: string) =>
      [...queryKeys.posts.all, tenantId, "slug", slug] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.posts.all, tenantId] as const,
  },

  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (tenantId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.products.lists(), tenantId, filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.products.details(), tenantId, id] as const,
    slug: (tenantId: string, slug: string) =>
      [...queryKeys.products.all, tenantId, "slug", slug] as const,
    lowStock: (tenantId: string) =>
      [...queryKeys.products.all, tenantId, "low-stock"] as const,
    variants: (tenantId: string, productId: string) =>
      [...queryKeys.products.all, tenantId, productId, "variants"] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.products.all, tenantId] as const,
  },

  categories: {
    all: ["product-categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (tenantId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.categories.lists(), tenantId, filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.categories.details(), tenantId, id] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.categories.all, tenantId] as const,
  },

  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (tenantId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.orders.lists(), tenantId, filters] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.orders.details(), tenantId, id] as const,
    number: (tenantId: string, orderNumber: number) =>
      [...queryKeys.orders.all, tenantId, "number", orderNumber] as const,
    stats: (tenantId: string, dateRange?: { startDate?: string; endDate?: string }) =>
      [...queryKeys.orders.all, tenantId, "stats", dateRange] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.orders.all, tenantId] as const,
  },

  customers: {
    all: ["customers"] as const,
    lists: () => [...queryKeys.customers.all, "list"] as const,
    list: (tenantId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.customers.lists(), tenantId, filters] as const,
    details: () => [...queryKeys.customers.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.customers.details(), tenantId, id] as const,
    email: (tenantId: string, email: string) =>
      [...queryKeys.customers.all, tenantId, "email", email] as const,
    stats: (tenantId: string) =>
      [...queryKeys.customers.all, tenantId, "stats"] as const,
    addresses: (tenantId: string, customerId: string) =>
      [...queryKeys.customers.all, tenantId, customerId, "addresses"] as const,
    address: (tenantId: string, customerId: string, addressId: string) =>
      [...queryKeys.customers.all, tenantId, customerId, "addresses", addressId] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.customers.all, tenantId] as const,
  },

  // ============================================================================
  // Layout Components
  // ============================================================================

  headers: {
    all: ["headers"] as const,
    lists: () => [...queryKeys.headers.all, "list"] as const,
    list: (tenantId: string) =>
      [...queryKeys.headers.lists(), tenantId] as const,
    details: () => [...queryKeys.headers.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.headers.details(), tenantId, id] as const,
    slug: (tenantId: string, slug: string) =>
      [...queryKeys.headers.all, tenantId, "slug", slug] as const,
    default: (tenantId: string) =>
      [...queryKeys.headers.all, tenantId, "default"] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.headers.all, tenantId] as const,
  },

  footers: {
    all: ["footers"] as const,
    lists: () => [...queryKeys.footers.all, "list"] as const,
    list: (tenantId: string) =>
      [...queryKeys.footers.lists(), tenantId] as const,
    details: () => [...queryKeys.footers.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.footers.details(), tenantId, id] as const,
    slug: (tenantId: string, slug: string) =>
      [...queryKeys.footers.all, tenantId, "slug", slug] as const,
    default: (tenantId: string) =>
      [...queryKeys.footers.all, tenantId, "default"] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.footers.all, tenantId] as const,
  },

  menus: {
    all: ["menus"] as const,
    lists: () => [...queryKeys.menus.all, "list"] as const,
    list: (tenantId: string) =>
      [...queryKeys.menus.lists(), tenantId] as const,
    details: () => [...queryKeys.menus.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.menus.details(), tenantId, id] as const,
    slug: (tenantId: string, slug: string) =>
      [...queryKeys.menus.all, tenantId, "slug", slug] as const,
    default: (tenantId: string) =>
      [...queryKeys.menus.all, tenantId, "default"] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.menus.all, tenantId] as const,
  },

  // ============================================================================
  // Media & Assets
  // ============================================================================

  assets: {
    all: ["assets"] as const,
    lists: () => [...queryKeys.assets.all, "list"] as const,
    list: (tenantId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.assets.lists(), tenantId, filters] as const,
    details: () => [...queryKeys.assets.all, "detail"] as const,
    detail: (tenantId: string, id: string) =>
      [...queryKeys.assets.details(), tenantId, id] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.assets.all, tenantId] as const,
  },

  // ============================================================================
  // Tags (derived from posts)
  // ============================================================================

  tags: {
    all: ["tags"] as const,
    lists: () => [...queryKeys.tags.all, "list"] as const,
    list: (tenantId: string) =>
      [...queryKeys.tags.lists(), tenantId] as const,
    withCounts: (tenantId: string) =>
      [...queryKeys.tags.all, tenantId, "with-counts"] as const,
    byTenant: (tenantId: string) =>
      [...queryKeys.tags.all, tenantId] as const,
  },

  // ============================================================================
  // Webhooks
  // ============================================================================

  webhooks: {
    all: ["webhooks"] as const,
    lists: () => [...queryKeys.webhooks.all, "list"] as const,
    list: (tenantId: string) => [...queryKeys.webhooks.lists(), tenantId] as const,
    details: () => [...queryKeys.webhooks.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.webhooks.details(), id] as const,
    deliveries: (id: string) => [...queryKeys.webhooks.detail(id), "deliveries"] as const,
  },

  // ============================================================================
  // Site Config
  // ============================================================================

  siteConfig: {
    all: ["site-config"] as const,
    config: (tenantId: string) => [...queryKeys.siteConfig.all, tenantId] as const,
    section: (tenantId: string, section: string) => [...queryKeys.siteConfig.config(tenantId), section] as const,
  },

  // ============================================================================
  // Payments
  // ============================================================================

  payments: {
    all: ["payments"] as const,
    config: (tenantId: string) =>
      [...queryKeys.payments.all, "config", tenantId] as const,
    details: (tenantId: string, orderId: string) =>
      [...queryKeys.payments.all, "details", tenantId, orderId] as const,
  },

  // ============================================================================
  // Tenant Tokens
  // ============================================================================

  tenantTokens: {
    all: ["tenant-tokens"] as const,
    detail: (tenantId: string) =>
      [...queryKeys.tenantTokens.all, tenantId] as const,
  },
};
