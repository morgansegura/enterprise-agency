import { useTenant, type TenantTier } from "./use-tenants";

/**
 * Hook to get the current tenant's tier
 * @param tenantId - The tenant ID
 * @returns The tenant tier (CONTENT_EDITOR or BUILDER) or undefined if loading
 */
export function useTier(tenantId: string): TenantTier | undefined {
  const { data: tenant } = useTenant(tenantId);
  return tenant?.tier;
}

/**
 * Hook to check if current tenant has BUILDER tier
 * @param tenantId - The tenant ID
 * @returns true if tenant has BUILDER tier, false otherwise
 */
export function useIsBuilder(tenantId: string): boolean {
  const tier = useTier(tenantId);
  return tier === "BUILDER";
}

/**
 * Hook to check if current tenant has CONTENT_EDITOR tier
 * @param tenantId - The tenant ID
 * @returns true if tenant has CONTENT_EDITOR tier, false otherwise
 */
export function useIsContentEditor(tenantId: string): boolean {
  const tier = useTier(tenantId);
  return tier === "CONTENT_EDITOR";
}

/**
 * Hook to check if a specific tier is required
 * @param tenantId - The tenant ID
 * @param requiredTier - The tier to check against
 * @returns true if tenant meets or exceeds the required tier
 */
export function useHasTier(
  tenantId: string,
  requiredTier: TenantTier,
): boolean {
  const tier = useTier(tenantId);

  if (!tier) return false;

  // BUILDER tier has access to all CONTENT_EDITOR features
  if (requiredTier === "CONTENT_EDITOR") {
    return tier === "CONTENT_EDITOR" || tier === "BUILDER";
  }

  // BUILDER tier is required
  return tier === "BUILDER";
}
