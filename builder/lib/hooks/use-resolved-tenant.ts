import { useEffect, useState } from "react";
import { useTenantsStore } from "@/lib/stores/tenants-store";
import { apiClient } from "@/lib/api-client";

interface ResolvedTenant {
  tenantId: string | null;
  tenantSlug: string | null;
  isResolving: boolean;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const FALLBACK_SLUG =
  process.env.NEXT_PUBLIC_TENANT_SLUG || "web-and-funnel";

/**
 * Resolves the current tenant from store, domain, or env fallback.
 */
export function useResolvedTenant(): ResolvedTenant {
  const { activeTenantId, activeTenant, setActiveTenant } = useTenantsStore();
  const [isResolving, setIsResolving] = useState(!activeTenantId);

  useEffect(() => {
    if (activeTenantId && activeTenant) {
      apiClient.setTenantId(activeTenantId);
      setIsResolving(false);
      return;
    }

    async function resolve() {
      setIsResolving(true);

      try {
        const hostname =
          typeof window !== "undefined" ? window.location.hostname : "";
        const isLocal =
          !hostname || hostname === "localhost" || hostname === "127.0.0.1";

        let slug = FALLBACK_SLUG;

        // Production: try domain-based resolution first
        if (!isLocal) {
          const domainRes = await fetch(
            `${API_URL}/api/v1/public/resolve?domain=${hostname}`,
          );
          if (domainRes.ok) {
            const data = await domainRes.json();
            if (data.slug) slug = data.slug;
            if (data.tenantId) {
              finalize(data.tenantId, slug, data.businessName || slug);
              return;
            }
          }
        }

        // Resolve slug to tenant data via config endpoint
        const configRes = await fetch(
          `${API_URL}/api/v1/public/${slug}/config`,
        );

        if (configRes.ok) {
          const config = await configRes.json();
          // Use slug as tenant identifier — middleware resolves to UUID
          apiClient.setTenantId(slug);

          // Try to get actual tenant ID from authenticated endpoint
          try {
            const tenants = await apiClient.get<
              { id: string; slug: string; businessName: string }[]
            >("/tenants");
            const list = Array.isArray(tenants)
              ? tenants
              : ((tenants as { data: typeof tenants }).data || []);
            const match = list.find((t) => t.slug === slug) || list[0];
            if (match) {
              finalize(match.id, match.slug, match.businessName);
              return;
            }
          } catch {
            // Not authenticated yet or endpoint unavailable
          }

          // Fall back to slug as ID — middleware handles resolution
          finalize(slug, config.slug || slug, config.businessName || slug);
        }
      } catch {
        // Last resort
        apiClient.setTenantId(FALLBACK_SLUG);
        finalize(FALLBACK_SLUG, FALLBACK_SLUG, FALLBACK_SLUG);
      } finally {
        setIsResolving(false);
      }
    }

    function finalize(id: string, slug: string, businessName: string) {
      apiClient.setTenantId(id);
      setActiveTenant({
        id,
        slug,
        businessName,
        status: "active",
        enabledFeatures: {},
        tenantType: "AGENCY",
      } as never);
    }

    resolve();
  }, [activeTenantId, activeTenant, setActiveTenant]);

  return {
    tenantId: activeTenantId,
    tenantSlug: activeTenant?.slug || null,
    isResolving,
  };
}
