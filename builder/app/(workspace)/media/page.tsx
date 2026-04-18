"use client";

import { MediaLibrary } from "@/components/media-library";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

export default function MediaLibraryPage() {
  const { tenantId } = useResolvedTenant();
  if (!tenantId) return null;
  return <MediaLibrary tenantId={tenantId} />;
}
