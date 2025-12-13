"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useTenants,
  useDeleteTenant,
  useTenantsHealth,
} from "@/lib/hooks/use-tenants";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BriefcaseBusiness,
  Search,
  LayoutGrid,
  List,
  Plus,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Settings,
  Circle,
  CheckCircle2,
  PauseCircle,
  Activity,
} from "lucide-react";

// Tenant item type
interface TenantItem {
  id: string;
  slug: string;
  businessName: string;
  businessType?: string;
  status: string;
  tier: string;
  enabledFeatures: Record<string, boolean>;
  contactEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Status configuration
const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "text-emerald-600 bg-emerald-50",
  },
  inactive: {
    label: "Inactive",
    icon: Circle,
    className: "text-gray-500 bg-gray-50",
  },
  suspended: {
    label: "Suspended",
    icon: PauseCircle,
    className: "text-red-600 bg-red-50",
  },
} as const;

// Tier labels
const tierLabels: Record<string, string> = {
  CONTENT_EDITOR: "Content Editor",
  BUILDER: "Builder",
};

export default function ClientsPage() {
  const router = useRouter();
  const { data: tenants, isLoading, error } = useTenants();
  const { data: healthData } = useTenantsHealth();
  const deleteTenant = useDeleteTenant();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Get health status for a tenant
  const getHealthStatus = (tenantId: string) => {
    const tenantHealth = healthData?.tenants?.find((t) => t.id === tenantId);
    return tenantHealth?.healthStatus || "unknown";
  };

  // Filter tenants
  const filteredTenants = React.useMemo(() => {
    if (!tenants) return [];
    return tenants.filter((tenant) => {
      const matchesSearch =
        search === "" ||
        tenant.businessName.toLowerCase().includes(search.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || tenant.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tenants, search, statusFilter]);

  const handleCreate = () => {
    router.push("/dashboard/clients/new");
  };

  const handleEdit = (tenant: TenantItem) => {
    router.push(`/dashboard/clients/${tenant.id}`);
  };

  const handleOpenWorkspace = (tenant: TenantItem) => {
    router.push(`/${tenant.id}/pages`);
  };

  const handleDelete = (tenant: TenantItem) => {
    if (
      confirm(`Delete "${tenant.businessName}"? This action cannot be undone.`)
    ) {
      deleteTenant.mutate(tenant.id);
    }
  };

  const getServiceType = (features: Record<string, boolean>) => {
    const types = [];
    if (features["pages.view"] || features["builder.access"]) types.push("CMS");
    if (features["shop.enabled"]) types.push("Shop");
    if (features["bookings.enabled"]) types.push("Bookings");
    return types.length > 0 ? types.join(", ") : "None";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (error) {
    return (
      <PageLayout title="Manage Clients" description="Error loading clients">
        <div className="flex items-center justify-center py-12">
          <p className="text-(--destructive)">{error.message}</p>
        </div>
      </PageLayout>
    );
  }

  // Toolbar
  const toolbar = (
    <>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--muted-foreground)" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <PageLayout
      title="Manage Clients"
      description={`${tenants?.length || 0} total clients`}
      actions={
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          New Client
        </Button>
      }
      toolbar={toolbar}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-12 w-12 rounded-lg mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BriefcaseBusiness className="h-16 w-16 text-(--muted-foreground) mb-4" />
          <h3 className="text-lg font-medium mb-2">No clients found</h3>
          <p className="text-(--muted-foreground) mb-4">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first client to get started"}
          </p>
          {!search && statusFilter === "all" && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTenants.map((tenant) => {
            const status =
              statusConfig[tenant.status as keyof typeof statusConfig] ||
              statusConfig.inactive;
            const StatusIcon = status.icon;
            const healthStatus = getHealthStatus(tenant.id);

            return (
              <div
                key={tenant.id}
                className="border rounded-lg p-4 hover:border-(--primary) transition-colors cursor-pointer"
                onClick={() => handleOpenWorkspace(tenant)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-(--primary)/10 flex items-center justify-center">
                      <BriefcaseBusiness className="h-6 w-6 text-(--primary)" />
                    </div>
                    <div>
                      <h3 className="font-medium flex items-center gap-1.5">
                        {tenant.businessName}
                        {healthStatus === "active" && (
                          <span title="Active">
                            <Activity className="h-3.5 w-3.5 text-emerald-500" />
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-(--muted-foreground)">
                        /{tenant.slug}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleOpenWorkspace(tenant)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Workspace
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(tenant)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(tenant)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-0.5 rounded-full bg-(--muted) text-(--muted-foreground)">
                    {tierLabels[tenant.tier] || tenant.tier}
                  </span>
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${status.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-(--muted-foreground)">
                  {getServiceType(tenant.enabledFeatures || {})}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTenants.map((tenant) => {
            const status =
              statusConfig[tenant.status as keyof typeof statusConfig] ||
              statusConfig.inactive;
            const StatusIcon = status.icon;
            const healthStatus = getHealthStatus(tenant.id);

            return (
              <div
                key={tenant.id}
                className="flex items-center gap-4 p-3 border rounded-lg hover:border-(--primary) transition-colors cursor-pointer"
                onClick={() => handleOpenWorkspace(tenant)}
              >
                <div className="h-10 w-10 rounded-lg bg-(--primary)/10 flex items-center justify-center shrink-0">
                  <BriefcaseBusiness className="h-5 w-5 text-(--primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium flex items-center gap-1.5 truncate">
                    {tenant.businessName}
                    {healthStatus === "active" && (
                      <span title="Active">
                        <Activity className="h-3.5 w-3.5 text-emerald-500" />
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-(--muted-foreground) truncate">
                    /{tenant.slug}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-(--muted) text-(--muted-foreground) text-sm shrink-0">
                  {tierLabels[tenant.tier] || tenant.tier}
                </span>
                <span className="text-sm text-(--muted-foreground) shrink-0 hidden md:block">
                  {getServiceType(tenant.enabledFeatures || {})}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm shrink-0 ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
                <span className="text-sm text-(--muted-foreground) shrink-0 hidden lg:block">
                  {formatDate(tenant.updatedAt)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleOpenWorkspace(tenant)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Workspace
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(tenant)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(tenant)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
