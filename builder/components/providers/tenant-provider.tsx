"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const tenantId = params?.id as string;

  useEffect(() => {
    if (tenantId) {
      apiClient.setTenantId(tenantId);
    }

    return () => {
      apiClient.clearTenantId();
    };
  }, [tenantId]);

  return <>{children}</>;
}
