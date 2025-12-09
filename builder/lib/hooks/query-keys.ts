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
  },
};
