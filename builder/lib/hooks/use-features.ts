import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "./query-keys";
import { logger } from "@/lib/logger";

export interface FeatureDefinition {
  key: string;
  description: string;
  category: string;
}

export type EnabledFeatures = Record<string, boolean>;

/**
 * Get all available features in the system
 */
export function useAvailableFeatures() {
  return useQuery({
    queryKey: queryKeys.admin.features.available(),
    queryFn: async () => {
      const data = await apiClient.get<FeatureDefinition[]>(
        "/admin/features/available",
      );
      logger.log("Fetched available features", { count: data.length });
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour - features rarely change
  });
}

/**
 * Get enabled features for a specific tenant
 */
export function useTenantFeatures(tenantId: string) {
  return useQuery({
    queryKey: queryKeys.admin.features.tenant(tenantId),
    queryFn: async () => {
      const data = await apiClient.get<EnabledFeatures>(
        `/admin/features/tenant/${tenantId}`,
      );
      logger.log("Fetched tenant features", { tenantId });
      return data;
    },
    enabled: !!tenantId,
  });
}

/**
 * Update all features for a tenant at once
 */
export function useUpdateFeatures() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tenantId,
      features,
    }: {
      tenantId: string;
      features: EnabledFeatures;
    }) => {
      logger.log("Updating tenant features", {
        tenantId,
        featureCount: Object.keys(features).length,
      });

      return apiClient.put<EnabledFeatures>(
        `/admin/features/tenant/${tenantId}`,
        { enabledFeatures: features },
      );
    },

    onMutate: async ({ tenantId, features }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: queryKeys.admin.features.tenant(tenantId),
      });

      // Snapshot previous value
      const previousFeatures = queryClient.getQueryData<EnabledFeatures>(
        queryKeys.admin.features.tenant(tenantId),
      );

      // Optimistically update
      queryClient.setQueryData<EnabledFeatures>(
        queryKeys.admin.features.tenant(tenantId),
        features,
      );

      return { previousFeatures };
    },

    onError: (error: any, { tenantId }, context) => {
      logger.error("Failed to update features", error, { tenantId });

      // Rollback on error
      if (context?.previousFeatures) {
        queryClient.setQueryData(
          queryKeys.admin.features.tenant(tenantId),
          context.previousFeatures,
        );
      }
    },

    onSuccess: (data, { tenantId }) => {
      logger.log("Features updated successfully", { tenantId });

      // Update cache with server response
      queryClient.setQueryData(queryKeys.admin.features.tenant(tenantId), data);

      // Invalidate tenant details to reflect updated features
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.tenants.detail(tenantId),
      });
    },
  });
}

/**
 * Toggle a single feature for a tenant with optimistic update
 */
export function useToggleFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tenantId,
      featureKey,
      enabled,
    }: {
      tenantId: string;
      featureKey: string;
      enabled: boolean;
    }) => {
      logger.log("Toggling feature", { tenantId, featureKey, enabled });

      return apiClient.post<EnabledFeatures>(
        `/admin/features/tenant/${tenantId}/toggle`,
        { featureKey, enabled },
      );
    },

    onMutate: async ({ tenantId, featureKey, enabled }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: queryKeys.admin.features.tenant(tenantId),
      });

      // Snapshot previous value
      const previousFeatures = queryClient.getQueryData<EnabledFeatures>(
        queryKeys.admin.features.tenant(tenantId),
      );

      // Optimistically update the single feature
      if (previousFeatures) {
        queryClient.setQueryData<EnabledFeatures>(
          queryKeys.admin.features.tenant(tenantId),
          {
            ...previousFeatures,
            [featureKey]: enabled,
          },
        );
      }

      return { previousFeatures };
    },

    onError: (error: any, { tenantId, featureKey }, context) => {
      logger.error("Failed to toggle feature", error, { tenantId, featureKey });

      // Rollback on error
      if (context?.previousFeatures) {
        queryClient.setQueryData(
          queryKeys.admin.features.tenant(tenantId),
          context.previousFeatures,
        );
      }
    },

    onSuccess: (data, { tenantId, featureKey, enabled }) => {
      logger.log("Feature toggled successfully", {
        tenantId,
        featureKey,
        enabled,
      });

      // Update cache with server response
      queryClient.setQueryData(queryKeys.admin.features.tenant(tenantId), data);

      // Invalidate tenant details
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.tenants.detail(tenantId),
      });
    },
  });
}
