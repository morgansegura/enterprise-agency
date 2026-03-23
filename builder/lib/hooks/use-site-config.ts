import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import { queryKeys } from "./query-keys";

// ============================================================================
// Types
// ============================================================================

export interface SiteHeaderConfig {
  headerId?: string;
  behavior?: string;
  isVisible?: boolean;
  overrides?: Record<string, unknown>;
}

export interface SiteFooterConfig {
  footerId?: string;
  isVisible?: boolean;
  overrides?: Record<string, unknown>;
}

export interface SiteMenusConfig {
  primaryMenuId?: string;
  footerMenuId?: string;
  mobileMenuId?: string;
  additionalMenus?: Record<string, string>;
}

export interface SiteLogosConfig {
  primary?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  favicon?: {
    src: string;
  };
  darkMode?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  mobileLogo?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  };
}

export interface SiteConfig {
  id: string;
  tenantId: string;
  header: SiteHeaderConfig;
  footer: SiteFooterConfig;
  menus: SiteMenusConfig;
  logos: SiteLogosConfig;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSiteConfigInput {
  header?: SiteHeaderConfig;
  footer?: SiteFooterConfig;
  menus?: SiteMenusConfig;
  logos?: SiteLogosConfig;
}

// ============================================================================
// Query Hooks
// ============================================================================

export function useSiteConfig(tenantId: string) {
  return useQuery<SiteConfig>({
    queryKey: queryKeys.siteConfig.config(tenantId),
    queryFn: () =>
      apiClient.get<SiteConfig>(`/tenants/${tenantId}/site-config`),
    enabled: !!tenantId,
  });
}

export function useHeaderConfig(tenantId: string) {
  return useQuery<SiteHeaderConfig>({
    queryKey: queryKeys.siteConfig.section(tenantId, "header"),
    queryFn: () =>
      apiClient.get<SiteHeaderConfig>(
        `/tenants/${tenantId}/site-config/header`,
      ),
    enabled: !!tenantId,
  });
}

export function useFooterConfig(tenantId: string) {
  return useQuery<SiteFooterConfig>({
    queryKey: queryKeys.siteConfig.section(tenantId, "footer"),
    queryFn: () =>
      apiClient.get<SiteFooterConfig>(
        `/tenants/${tenantId}/site-config/footer`,
      ),
    enabled: !!tenantId,
  });
}

export function useMenusConfig(tenantId: string) {
  return useQuery<SiteMenusConfig>({
    queryKey: queryKeys.siteConfig.section(tenantId, "menus"),
    queryFn: () =>
      apiClient.get<SiteMenusConfig>(`/tenants/${tenantId}/site-config/menus`),
    enabled: !!tenantId,
  });
}

export function useLogosConfig(tenantId: string) {
  return useQuery<SiteLogosConfig>({
    queryKey: queryKeys.siteConfig.section(tenantId, "logos"),
    queryFn: () =>
      apiClient.get<SiteLogosConfig>(`/tenants/${tenantId}/site-config/logos`),
    enabled: !!tenantId,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

export function useUpdateSiteConfig(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSiteConfigInput) =>
      apiClient.put<SiteConfig>(`/tenants/${tenantId}/site-config`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.siteConfig.config(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to update site config", error as Error);
      toast.error("Failed to update site config");
    },
  });
}

export function useUpdateHeaderConfig(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SiteHeaderConfig) =>
      apiClient.put<SiteHeaderConfig>(
        `/tenants/${tenantId}/site-config/header`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.siteConfig.config(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to update header config", error as Error);
      toast.error("Failed to update header config");
    },
  });
}

export function useUpdateFooterConfig(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SiteFooterConfig) =>
      apiClient.put<SiteFooterConfig>(
        `/tenants/${tenantId}/site-config/footer`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.siteConfig.config(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to update footer config", error as Error);
      toast.error("Failed to update footer config");
    },
  });
}

export function useUpdateMenusConfig(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SiteMenusConfig) =>
      apiClient.put<SiteMenusConfig>(
        `/tenants/${tenantId}/site-config/menus`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.siteConfig.config(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to update menus config", error as Error);
      toast.error("Failed to update menus config");
    },
  });
}

export function useUpdateLogosConfig(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SiteLogosConfig) =>
      apiClient.put<SiteLogosConfig>(
        `/tenants/${tenantId}/site-config/logos`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.siteConfig.config(tenantId),
      });
    },
    onError: (error: unknown) => {
      logger.error("Failed to update logos config", error as Error);
      toast.error("Failed to update logos config");
    },
  });
}
