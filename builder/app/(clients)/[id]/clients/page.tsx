"use client";

import * as React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useTenant,
  useChildTenants,
  useDeleteTenant,
  type Tenant,
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
  Building2,
  Search,
  LayoutGrid,
  List,
  Plus,
  MoreHorizontal,
  ExternalLink,
  Settings,
  Trash2,
  Circle,
  CheckCircle2,
  PauseCircle,
  PlusCircle,
} from "lucide-react";

// Status configuration
const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-emerald-600 text-emerald-50",
  },
  inactive: {
    label: "Inactive",
    icon: Circle,
    className: "bg-gray-500 text-gray-50",
  },
  suspended: {
    label: "Suspended",
    icon: PauseCircle,
    className: "bg-red-600 text-red-50",
  },
} as const;

// Client type labels
const clientTypeLabels: Record<string, string> = {
  BUSINESS: "Business",
  INDIVIDUAL: "Individual",
  NONPROFIT: "Non-Profit",
};

export default function ClientClientsPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.id as string;

  const { data: tenant } = useTenant(tenantId);
  const { data: subClients, isLoading, error } = useChildTenants(tenantId);
  const deleteTenant = useDeleteTenant();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter sub-clients
  const filteredClients = React.useMemo(() => {
    if (!subClients) return [];
    return subClients.filter((client) => {
      const matchesSearch =
        search === "" ||
        client.businessName.toLowerCase().includes(search.toLowerCase()) ||
        client.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subClients, search, statusFilter]);

  const handleCreate = () => {
    router.push(`/${tenantId}/clients/new`);
  };

  const handleOpenPortal = (client: Tenant) => {
    // Open the client's portal/workspace
    router.push(`/${client.id}`);
  };

  const handleSettings = (client: Tenant) => {
    router.push(`/${tenantId}/clients/${client.id}`);
  };

  const handleDelete = (client: Tenant) => {
    if (
      confirm(`Delete "${client.businessName}"? This action cannot be undone.`)
    ) {
      deleteTenant.mutate(client.id);
    }
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
      <PageLayout title="Client's Clients" description="Error loading clients">
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">{error.message}</p>
        </div>
      </PageLayout>
    );
  }

  // Toolbar
  const toolbar = (
    <>
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="indent-9 pl-9"
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
        <div className="flex border rounded-md bg-border gap-0.5">
          <Button
            variant={viewMode === "grid" ? "outline" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "outline" : "ghost"}
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
      title="Client's Clients"
      description={`${tenant?.businessName || "Client"} - ${subClients?.length || 0} sub-clients`}
      actions={
        <Button onClick={handleCreate}>
          <PlusCircle className="h-4 w-4" />
          Add Client
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
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No clients found</h3>
          <p className="text-muted-foreground mb-4">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Add your first client to get started"}
          </p>
          {!search && statusFilter === "all" && (
            <Button onClick={handleCreate}>
              <PlusCircle className="h-4 w-4 " />
              Add Client
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const status =
              statusConfig[client.status as keyof typeof statusConfig] ||
              statusConfig.inactive;
            const StatusIcon = status.icon;

            return (
              <div
                key={client.id}
                className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                onClick={() => handleOpenPortal(client)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{client.businessName}</h3>
                      <p className="text-sm text-muted-foreground">
                        /{client.slug}
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
                        onClick={() => handleOpenPortal(client)}
                      >
                        <ExternalLink className="h-4 w-4 " />
                        Open Portal
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSettings(client)}>
                        <Settings className="h-4 w-4 " />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(client)}
                      >
                        <Trash2 className="h-4 w-4 " />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {clientTypeLabels[client.clientType || ""] ||
                      client.clientType ||
                      "Client"}
                  </span>
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${status.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredClients.map((client) => {
            const status =
              statusConfig[client.status as keyof typeof statusConfig] ||
              statusConfig.inactive;
            const StatusIcon = status.icon;

            return (
              <div
                key={client.id}
                className="flex items-center gap-4 p-3 border rounded-lg hover:border-primary transition-colors cursor-pointer"
                onClick={() => handleOpenPortal(client)}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">
                    {client.businessName}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    /{client.slug}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-sm shrink-0">
                  {clientTypeLabels[client.clientType || ""] ||
                    client.clientType ||
                    "Client"}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm shrink-0 ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
                <span className="text-sm text-muted-foreground shrink-0 hidden lg:block">
                  {formatDate(client.updatedAt)}
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
                    <DropdownMenuItem onClick={() => handleOpenPortal(client)}>
                      <ExternalLink className="h-4 w-4 " />
                      Open Portal
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSettings(client)}>
                      <Settings className="h-4 w-4 " />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(client)}
                    >
                      <Trash2 className="h-4 w-4 " />
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
