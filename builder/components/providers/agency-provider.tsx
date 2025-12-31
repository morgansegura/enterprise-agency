"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useAgencyTenant } from "@/lib/hooks/use-tenants";

/**
 * Provider that sets the agency tenant context for admin routes.
 * This allows /admin/* API endpoints to work properly when not
 * inside a specific client workspace.
 */
export function AgencyProvider({ children }: { children: React.ReactNode }) {
  const { data: agencyTenant } = useAgencyTenant();

  useEffect(() => {
    if (agencyTenant?.id) {
      apiClient.setTenantId(agencyTenant.id);
    }

    return () => {
      apiClient.clearTenantId();
    };
  }, [agencyTenant?.id]);

  return <>{children}</>;
}
