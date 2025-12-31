"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useTenantTokens } from "@/lib/hooks/use-tenant-tokens";
import { applyTokensToDOM, type TokensToApply } from "@/lib/tokens/apply-tokens";

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const tenantId = params?.id as string;

  // Fetch tenant tokens
  const { data: tokens } = useTenantTokens(tenantId);

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
