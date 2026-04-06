import { useEffect, useState } from "react";
import { useTenantsStore } from "@/lib/stores/tenants-store";
import { apiClient } from "@/lib/api-client";

interface ResolvedTenant {
  tenantId: string | null;
  tenantSlug: string | null;
  isResolving: boolean;
}

const FALLBACK_SLUG =
  process.env.NEXT_PUBLIC_TENANT_SLUG || "web-and-funnel";

/**
 * Resolves the current tenant from domain or store.
 *
 * Resolution order:
 * 1. tenantsStore.activeTenantId (persisted in localStorage)
 * 2. Domain lookup via public API
 * 3. NEXT_PUBLIC_TENANT_SLUG env var fallback
 */
export function useResolvedTenant(): ResolvedTenant {
  const { activeTenantId, activeTenant, setActiveTenant } = useTenantsStore();
  const [isResolving, setIsResolving] = useState(!activeTenantId);

  useEffect(() => {
    if (activeTenantId && activeTenant) {
      setIsResolving(false);
      return;
    }

    async function resolve() {
      setIsResolving(true);

      try {
        // Try domain-based resolution
        const hostname =
          typeof window !== "undefined" ? window.location.hostname : "";

        if (hostname && hostname !== "localhost") {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/public/resolve?domain=${hostname}`,
          );

          if (res.ok) {
            const data = await res.json();
            if (data.tenantId && data.slug) {
              // Fetch full tenant data
              apiClient.setTenantId(data.tenantId);
              try {
                const tenant = await apiClient.get<{
                  id: string;
                  slug: string;
                  businessName: string;
                  [key: string]: unknown;
                }>(`/tenants/${data.tenantId}`);
                setActiveTenant(tenant as never);
              } catch {
                // Set minimal tenant data from resolve response
                setActiveTenant({
                  id: data.tenantId,
                  slug: data.slug,
                  businessName: data.businessName || data.slug,
                  status: "active",
                  enabledFeatures: {},
                  tenantType: "AGENCY",
                } as never);
              }
              setIsResolving(false);
              return;
            }
          }
        }

        // Fallback: resolve by slug
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/public/${FALLBACK_SLUG}/config`,
        );

        if (res.ok) {
          const config = await res.json();
          if (config.id) {
            apiClient.setTenantId(config.id);
            setActiveTenant({
              id: config.id,
              slug: config.slug || FALLBACK_SLUG,
              businessName: config.businessName || FALLBACK_SLUG,
              status: "active",
              enabledFeatures: {},
              tenantType: "AGENCY",
            } as never);
          }
        }
      } catch {
        // Silent fail — will show empty state
      } finally {
        setIsResolving(false);
      }
    }

    resolve();
  }, [activeTenantId, activeTenant, setActiveTenant]);

  return {
    tenantId: activeTenantId,
    tenantSlug: activeTenant?.slug || null,
    isResolving,
  };
}
