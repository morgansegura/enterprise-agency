"use client";

import { StorageDashboard } from "@/components/media-library";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

export default function MediaStoragePage() {
  const { tenantId } = useResolvedTenant();
  if (!tenantId) return null;
  return <StorageDashboard tenantId={tenantId} />;
}
