"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTenants, useDeleteTenant } from "@/lib/hooks";
import { ContentList, type MenuAction } from "@/components/layout/content-list";
import { toast } from "sonner";
import { BriefcaseBusiness, ExternalLink, Settings } from "lucide-react";

// Client/Tenant item type for ContentList
interface ClientItem {
  id: string;
  title: string;
  businessName: string;
  slug: string;
  status?: string;
  updatedAt?: string;
  enabledFeatures?: Record<string, boolean>;
  tier?: string;
}

export default function ManageClientsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  // Queries
  const { data: tenants, isLoading, error } = useTenants();
  const deleteTenant = useDeleteTenant();

  // Transform tenants to include title field
  const clientItems: ClientItem[] = React.useMemo(() => {
    if (!tenants) return [];
    return tenants.map((t) => ({
      ...t,
      title: t.businessName,
    }));
  }, [tenants]);

  // Get service type label
  const getServiceType = (features?: Record<string, boolean>) => {
    if (!features) return "None";
    const types = [];
    if (features["pages.view"] || features["builder.access"]) types.push("CMS");
    if (features["shop.enabled"]) types.push("Shop");
    if (features["bookings.enabled"]) types.push("Bookings");
    return types.length > 0 ? types.join(", ") : "None";
  };

  // Handlers
  const handleCreate = () => {
    router.push("/dashboard/clients/new");
  };

  const handleEdit = (client: ClientItem) => {
    router.push(`/${client.id}/settings`);
  };

  const handleDelete = (client: ClientItem) => {
    if (confirm(`Delete client "${client.businessName}"? This action cannot be undone.`)) {
      deleteTenant.mutate(client.id, {
        onSuccess: () => {
          toast.success(`Client "${client.businessName}" deleted`);
        },
        onError: () => {
          toast.error("Failed to delete client");
        },
      });
    }
  };

  // Custom menu actions
  const menuActions: MenuAction<ClientItem>[] = [
    {
      label: "Open Workspace",
      icon: ExternalLink,
      onClick: (client) => {
        router.push(`/${client.id}/pages`);
      },
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: (client) => {
        router.push(`/${client.id}/settings`);
      },
    },
  ];

  return (
    <ContentList<ClientItem>
      title="Manage Clients"
      singularName="Client"
      pluralName="clients"
      icon={BriefcaseBusiness}
      items={clientItems}
      isLoading={isLoading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      showStatus={true}
      searchFields={["title", "businessName", "slug"]}
      filterOptions={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "suspended", label: "Suspended" },
      ]}
      menuActions={menuActions}
      renderListMeta={(client) => (
        <span className="text-sm text-(--muted-foreground)">
          {getServiceType(client.enabledFeatures)}
        </span>
      )}
      renderMeta={(client) => (
        <div className="mt-1">
          <p className="text-xs text-(--muted-foreground)">/{client.slug}</p>
          <p className="text-xs text-(--muted-foreground)">
            {getServiceType(client.enabledFeatures)}
          </p>
        </div>
      )}
    />
  );
}
