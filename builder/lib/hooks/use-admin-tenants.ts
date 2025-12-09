import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "./query-keys";
import { logger } from "@/lib/logger";

export interface TenantStats {
  pages: number;
  posts: number;
  assets: number;
  users: number;
}

export interface TenantActivity {
  recentPages: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface TenantWithStats {
  id: string;
  slug: string;
  businessName: string;
  businessType: string;
  status: string;
  enabledFeatures: Record<string, boolean>;
  _count: {
    pages: number;
    posts: number;
    assets: number;
    tenantUsers: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * List all tenants with stats and counts
 */
export function useAdminTenants() {
  return useQuery({
    queryKey: queryKeys.admin.tenants.all(),
    queryFn: async () => {
      const data = await apiClient.get<TenantWithStats[]>("/admin/tenants");
      logger.log("Fetched admin tenants", { count: data.length });
      return data;
    },
  });
}

/**
 * Get detailed statistics for a tenant
 */
export function useTenantStats(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.admin.tenants.stats(tenantId),
    queryFn: async () => {
      const data = await apiClient.get<TenantStats>(
        `/admin/tenants/${tenantId}/stats`,
      );
      logger.log("Fetched tenant stats", { tenantId, stats: data });
      return data;
    },
    enabled: !!tenantId,
  });
}

/**
 * Get recent activity for a tenant
 */
export function useTenantActivity(tenantId: string, days: number = 30) {
  return useQuery({
    queryKey: queryKeys.admin.tenants.activity(tenantId, days),
    queryFn: async () => {
      const data = await apiClient.get<TenantActivity>(
        `/admin/tenants/${tenantId}/activity?days=${days}`,
      );
      logger.log("Fetched tenant activity", {
        tenantId,
        days,
        pagesCount: data.recentPages.length,
        postsCount: data.recentPosts.length,
      });
      return data;
    },
    enabled: !!tenantId,
  });
}
