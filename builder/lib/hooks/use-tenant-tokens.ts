import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";
import type { DesignTokens } from "../tokens";

/**
 * Tenant Design Tokens
 * Complete token-based design system with colors, typography, spacing, etc.
 * These override the platform defaults defined in the token system
 */

export type TenantTokens = Partial<DesignTokens>;

const TENANT_TOKENS_KEY = (tenantId: string) => ["tenant-tokens", tenantId];

/**
 * Fetch tenant design tokens
 */
export function useTenantTokens(tenantId: string) {
  return useQuery<TenantTokens>({
    queryKey: TENANT_TOKENS_KEY(tenantId),
    queryFn: async () => {
      try {
        return await apiClient.get<TenantTokens>(`/tenants/${tenantId}/tokens`);
      } catch (error) {
        logger.error("Failed to fetch tenant tokens", error as Error);
        // Return empty tokens if none exist yet
        return {};
      }
    },
    enabled: !!tenantId,
  });
}

/**
 * Update tenant design tokens
 */
export function useUpdateTenantTokens() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      tokens,
    }: {
      tenantId: string;
      tokens: TenantTokens;
    }) => apiClient.put<TenantTokens>(`/tenants/${tenantId}/tokens`, tokens),
    onSuccess: (_, { tenantId }) => {
      queryClient.invalidateQueries({ queryKey: TENANT_TOKENS_KEY(tenantId) });
      logger.log("Tenant tokens updated successfully", { tenantId });
    },
    onError: (error) => {
      logger.error("Failed to update tenant tokens", error as Error);
    },
  });
}
