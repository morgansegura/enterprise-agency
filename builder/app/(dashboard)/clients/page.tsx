"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useTenants,
  useDeleteTenant,
  useTenantsHealth,
} from "@/lib/hooks/use-tenants";
import { PageHeader } from "@/components/layout/page-header";
import { BriefcaseBusiness } from "lucide-react";
import { toast } from "sonner";

import { ClientsTable } from "./components/clients-table";
import type { TenantItem } from "./components/clients-table";

import "./clients.css";

// =============================================================================
// Clients Page
// =============================================================================

export default function ClientsPage() {
  const router = useRouter();
  const { data: tenants, isLoading, error } = useTenants();
  const { data: healthData } = useTenantsHealth();
  const deleteTenant = useDeleteTenant();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter tenants
  const filteredTenants = React.useMemo(() => {
    if (!tenants) return [];
    return tenants.filter((tenant: TenantItem) => {
      const matchesSearch =
        search === "" ||
        tenant.businessName.toLowerCase().includes(search.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || tenant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tenants, search, statusFilter]);

  // Surface errors via toast
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load clients");
    }
  }, [error]);

  const handleOpenWorkspace = (tenant: TenantItem) => {
    router.push(`/${tenant.id}/pages`);
  };

  const handleEdit = (tenant: TenantItem) => {
    router.push(`/clients/${tenant.id}`);
  };

  const handleDelete = (tenant: TenantItem) => {
    if (
      confirm(`Delete "${tenant.businessName}"? This action cannot be undone.`)
    ) {
      deleteTenant.mutate(tenant.id, {
        onSuccess: () => toast.success("Client deleted"),
        onError: () => toast.error("Failed to delete client"),
      });
    }
  };

  const handleCreateNew = () => {
    router.push("/clients/new");
  };

  const getHealthStatus = (tenantId: string) => {
    const tenantHealth = healthData?.tenants?.find(
      (t: { id: string }) => t.id === tenantId,
    );
    return tenantHealth?.healthStatus || "unknown";
  };

  return (
    <div className="clients-page">
      <PageHeader
        title="Clients"
        icon={BriefcaseBusiness}
        count={isLoading ? 0 : filteredTenants.length}
        singularName="client"
        pluralName="clients"
        actionLabel="New Client"
        onAction={handleCreateNew}
        showSearch
        searchPlaceholder="Search clients..."
        searchValue={isLoading ? undefined : search}
        onSearchChange={isLoading ? undefined : setSearch}
        showFilter
        filterOptions={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "suspended", label: "Suspended" },
        ]}
        filterValue={isLoading ? undefined : statusFilter}
        onFilterChange={isLoading ? undefined : setStatusFilter}
        filterPlaceholder="All Status"
      />

      <ClientsTable
        tenants={filteredTenants}
        isLoading={isLoading}
        search={search}
        statusFilter={statusFilter}
        onOpenWorkspace={handleOpenWorkspace}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
        getHealthStatus={getHealthStatus}
      />
    </div>
  );
}
