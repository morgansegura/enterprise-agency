import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api-client";
import { logger } from "../logger";

/**
 * Tenant Design Tokens
 * Stores customizations for Header, Menu, Footer, and Section tokens
 * These override the platform defaults defined in the client
 */

export interface HeaderTokenOverrides {
  height?: {
    default?: string;
    shrunk?: string;
    mobile?: string;
  };
  background?: {
    default?: string;
    scrolled?: string;
    transparent?: string;
  };
  // Add more header token overrides as needed
  [key: string]: unknown;
}

export interface MenuTokenOverrides {
  item?: {
    fontSize?: string;
    fontWeight?: string;
    padding?: {
      x?: string;
      y?: string;
    };
  };
  color?: {
    default?: string;
    hover?: string;
    active?: string;
  };
  // Add more menu token overrides as needed
  [key: string]: unknown;
}

export interface FooterTokenOverrides {
  background?: {
    default?: string;
  };
  padding?: {
    y?: {
      default?: string;
      mobile?: string;
    };
  };
  // Add more footer token overrides as needed
  [key: string]: unknown;
}

export interface SectionTokenOverrides {
  spacing?: {
    xs?: { top?: string; bottom?: string };
    sm?: { top?: string; bottom?: string };
    md?: { top?: string; bottom?: string };
    lg?: { top?: string; bottom?: string };
    xl?: { top?: string; bottom?: string };
  };
  width?: {
    narrow?: string;
    container?: string;
    wide?: string;
  };
  background?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  // Add more section token overrides as needed
  [key: string]: unknown;
}

export interface TenantTokens {
  header?: HeaderTokenOverrides;
  menu?: MenuTokenOverrides;
  footer?: FooterTokenOverrides;
  section?: SectionTokenOverrides;
  [key: string]: unknown;
}

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
