"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import { useTenantTokens } from "@/lib/hooks/use-tenant-tokens";
import {
  applyTokensToDOM,
  type TokensToApply,
} from "@/lib/tokens/apply-tokens";

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { tenantId } = useResolvedTenant();

  // Fetch tenant tokens
  const { data: tokens } = useTenantTokens(tenantId || "");

  // Set tenant ID for API client
  useEffect(() => {
    if (tenantId) {
      apiClient.setTenantId(tenantId);
    }

    return () => {
      apiClient.clearTenantId();
    };
  }, [tenantId]);

  // Apply tokens to DOM when they load
  useEffect(() => {
    if (tokens && Object.keys(tokens).length > 0) {
      applyTokensToDOM(tokens as unknown as TokensToApply);
    }
  }, [tokens]);

  return <>{children}</>;
}
