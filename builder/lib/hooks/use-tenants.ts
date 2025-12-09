import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { useTenantsStore } from "../stores";
import { logger } from "../logger";

export type TenantTier = "CONTENT_EDITOR" | "BUILDER";

export interface Tenant {
  id: string;
  slug: string;
  businessName: string;
  businessType?: string;
  status: string;
  tier: TenantTier;
  enabledFeatures: Record<string, boolean>;
  designTokens?: Record<string, unknown> | null;
  contactEmail?: string;
  contactPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

const TENANTS_KEY = ["tenants"];

export function useTenants() {
  const { setTenants, setLoading } = useTenantsStore();

  return useQuery<Tenant[]>({
    queryKey: TENANTS_KEY,
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<Tenant[]>("/tenants");
        setTenants(data);
        return data;
      } catch (error) {
        logger.error("Failed to fetch tenants", error as Error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
  });
}

export function useTenant(tenantId: string) {
  return useQuery<Tenant>({
    queryKey: [...TENANTS_KEY, tenantId],
    queryFn: () => apiClient.get<Tenant>(`/tenants/${tenantId}`),
    enabled: !!tenantId,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  const { addTenant } = useTenantsStore();

  return useMutation({
    mutationFn: (data: Partial<Tenant>) =>
      apiClient.post<Tenant>("/tenants", data),
    onSuccess: (newTenant) => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      addTenant(newTenant);
      logger.log("Tenant created successfully", { tenantId: newTenant.id });
    },
    onError: (error) => {
      logger.error("Failed to create tenant", error as Error);
    },
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  const { updateTenant } = useTenantsStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tenant> }) =>
      apiClient.patch<Tenant>(`/tenants/${id}`, data),
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      queryClient.invalidateQueries({
        queryKey: [...TENANTS_KEY, updatedTenant.id],
      });
      updateTenant(updatedTenant.id, updatedTenant);
      logger.log("Tenant updated successfully", { tenantId: updatedTenant.id });
    },
    onError: (error) => {
      logger.error("Failed to update tenant", error as Error);
    },
  });
}

export function useDeleteTenant() {
  const queryClient = useQueryClient();
  const { deleteTenant } = useTenantsStore();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/tenants/${id}`),
    onSuccess: (_, tenantId) => {
      queryClient.invalidateQueries({ queryKey: TENANTS_KEY });
      deleteTenant(tenantId);
      logger.log("Tenant deleted successfully", { tenantId });
    },
    onError: (error) => {
      logger.error("Failed to delete tenant", error as Error);
    },
  });
}

// ============================================================================
// Tenant User Management
// ============================================================================

export interface TenantUser {
  id: string;
  tenantId: string;
  userId: string;
  role: string;
  permissions: {
    pages?: {
      view?: boolean;
      create?: boolean;
      edit?: boolean;
      delete?: boolean;
    };
    posts?: {
      view?: boolean;
      create?: boolean;
      edit?: boolean;
      delete?: boolean;
    };
    assets?: {
      view?: boolean;
      create?: boolean;
      edit?: boolean;
      delete?: boolean;
    };
    settings?: { view?: boolean; edit?: boolean };
  };
  invitedBy?: string;
  invitationAcceptedAt?: string;
  lastActiveAt?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    status: string;
  };
  inviter?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

const TENANT_USERS_KEY = (tenantId: string) => ["tenants", tenantId, "users"];

export function useTenantUsers(tenantId: string) {
  return useQuery<TenantUser[]>({
    queryKey: TENANT_USERS_KEY(tenantId),
    queryFn: () => apiClient.get<TenantUser[]>(`/tenants/${tenantId}/users`),
    enabled: !!tenantId,
  });
}

export function useAddTenantUser(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; role?: string }) =>
      apiClient.post<TenantUser>(`/tenants/${tenantId}/users`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_USERS_KEY(tenantId) });
      logger.log("User added to tenant", { tenantId });
    },
    onError: (error) => {
      logger.error("Failed to add user to tenant", error as Error);
    },
  });
}

export function useUpdateTenantUser(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: { role?: string; permissions?: Record<string, unknown> };
    }) =>
      apiClient.patch<TenantUser>(`/tenants/${tenantId}/users/${userId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_USERS_KEY(tenantId) });
      logger.log("Tenant user updated", { tenantId });
    },
    onError: (error) => {
      logger.error("Failed to update tenant user", error as Error);
    },
  });
}

export function useRemoveTenantUser(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      apiClient.delete(`/tenants/${tenantId}/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_USERS_KEY(tenantId) });
      logger.log("User removed from tenant", { tenantId });
    },
    onError: (error) => {
      logger.error("Failed to remove user from tenant", error as Error);
    },
  });
}

// ============================================================================
// Tenant Statistics
// ============================================================================

export interface TenantStats {
  totals: {
    pages: number;
    posts: number;
    assets: number;
    teamMembers: number;
    products: number;
    orders: number;
    customers: number;
  };
  content: {
    publishedPages: number;
    draftPages: number;
    publishedPosts: number;
    draftPosts: number;
  };
  recentActivity: {
    pagesUpdated: number;
    postsUpdated: number;
    assetsUploaded: number;
  };
  storage: {
    bytesUsed: string;
    mbUsed: number;
  };
  memberSince: string;
}

export function useTenantStats(tenantId: string) {
  return useQuery<TenantStats>({
    queryKey: ["tenants", tenantId, "stats"],
    queryFn: () => apiClient.get<TenantStats>(`/tenants/${tenantId}/stats`),
    enabled: !!tenantId,
    staleTime: 60000, // Cache for 1 minute
  });
}

// ============================================================================
// Agency Health Overview (All Tenants)
// ============================================================================

export interface TenantHealthData {
  id: string;
  slug: string;
  businessName: string;
  status: string;
  tier: TenantTier;
  createdAt: string;
  counts: {
    pages: number;
    posts: number;
    assets: number;
    teamMembers: number;
    products: number;
    orders: number;
  };
  recentActivity: {
    total: number;
    pages: number;
    posts: number;
    assets: number;
  };
  lastActivity: string | null;
  healthStatus: "active" | "idle" | "inactive";
}

export interface TenantsHealthOverview {
  summary: {
    totalTenants: number;
    activeTenants: number;
    idleTenants: number;
    inactiveTenants: number;
    builderTier: number;
    contentEditorTier: number;
  };
  tenants: TenantHealthData[];
}

export function useTenantsHealth() {
  return useQuery<TenantsHealthOverview>({
    queryKey: ["tenants", "health", "overview"],
    queryFn: () =>
      apiClient.get<TenantsHealthOverview>("/tenants/health/overview"),
    staleTime: 60000, // Cache for 1 minute
  });
}
