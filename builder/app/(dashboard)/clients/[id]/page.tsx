"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTenant, useUpdateTenant } from "@/lib/hooks/use-tenants";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ClientForm } from "../components/client-form";
import type { ClientFormValues } from "../components/client-form";

import "./edit-client.css";

// =============================================================================
// Component
// =============================================================================

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { data: tenant, isLoading, error } = useTenant(id);
  const updateTenant = useUpdateTenant();

  // Build form default values from tenant data
  const defaultValues = React.useMemo<ClientFormValues | undefined>(() => {
    if (!tenant) return undefined;
    return {
      businessName: tenant.businessName || "",
      slug: tenant.slug || "",
      businessType: tenant.businessType || "",
      contactEmail: tenant.contactEmail || "",
      contactPhone: tenant.contactPhone || "",
      tier: (tenant.tier as ClientFormValues["tier"]) || "CONTENT_EDITOR",
      status: (tenant.status as ClientFormValues["status"]) || "active",
    };
  }, [tenant]);

  // Get enabled features for display
  const enabledFeatures = React.useMemo(() => {
    if (!tenant) return [];
    const features = (tenant.enabledFeatures as Record<string, boolean>) || {};
    return Object.entries(features)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => feature);
  }, [tenant]);

  // Build meta info
  const meta = React.useMemo(() => {
    if (!tenant) return undefined;
    return {
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
      id: tenant.id,
    };
  }, [tenant]);

  const handleSubmit = async (data: ClientFormValues) => {
    try {
      await updateTenant.mutateAsync({
        id,
        data: {
          businessName: data.businessName,
          slug: data.slug,
          businessType: data.businessType,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          tier: data.tier,
          status: data.status,
        },
      });
      toast.success("Client updated successfully");
    } catch {
      toast.error("Failed to update client");
    }
  };

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className="edit-client-page">
        <PageHeader title="Edit Client" description="Error loading client" />
        <p className="text-sm" style={{ color: "var(--status-error)" }}>
          {error.message}
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading skeleton
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="edit-client-skeleton">
        <div className="edit-client-skeleton-header">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="edit-client-skeleton-columns">
          <div className="edit-client-skeleton-main">
            <div className="edit-client-skeleton-card">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="edit-client-skeleton-card">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="edit-client-skeleton-sidebar">
            <div className="edit-client-skeleton-card">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="edit-client-page">
      <PageHeader
        title={tenant?.businessName || "Edit Client"}
        description={`/${tenant?.slug || ""}`}
        additionalActions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/clients")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (tenant) {
                  const { useTenantsStore } = require("@/lib/stores/tenants-store");
                  const { apiClient } = require("@/lib/api-client");
                  useTenantsStore.getState().setActiveTenant(tenant);
                  apiClient.setTenantId(tenant.id);
                }
                router.push("/pages");
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Open Workspace
            </Button>
          </>
        }
      />

      <ClientForm
        mode="edit"
        defaultValues={defaultValues}
        enabledFeatures={enabledFeatures}
        meta={meta}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/clients")}
        isPending={updateTenant.isPending}
      />
    </div>
  );
}
