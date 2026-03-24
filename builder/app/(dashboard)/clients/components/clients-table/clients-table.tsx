import { Button } from "@/components/ui/button";
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
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Pencil,
} from "lucide-react";

import "./clients-table.css";

// =============================================================================
// Types
// =============================================================================

export interface TenantItem {
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
  _count?: { pages?: number };
}

interface ClientsTableProps {
  tenants: TenantItem[];
  isLoading: boolean;
  search: string;
  statusFilter: string;
  onOpenWorkspace: (tenant: TenantItem) => void;
  onEdit: (tenant: TenantItem) => void;
  onDelete: (tenant: TenantItem) => void;
  onCreateNew: () => void;
  getHealthStatus: (tenantId: string) => string;
}

// =============================================================================
// Helpers
// =============================================================================

const statusClass: Record<string, string> = {
  active: "clients-status-active",
  inactive: "clients-status-inactive",
  suspended: "clients-status-suspended",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
};

const tierClass: Record<string, string> = {
  BUILDER: "clients-tier-builder",
  CONTENT_EDITOR: "clients-tier-content-editor",
};

const tierLabel: Record<string, string> = {
  BUILDER: "Builder",
  CONTENT_EDITOR: "Content Editor",
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// =============================================================================
// Skeleton
// =============================================================================

function ClientsTableSkeleton() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="clients-skeleton-row">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Empty State
// =============================================================================

function ClientsTableEmpty({
  search,
  statusFilter,
  onCreateNew,
}: {
  search: string;
  statusFilter: string;
  onCreateNew: () => void;
}) {
  return (
    <div className="clients-empty">
      <BriefcaseBusiness className="clients-empty-icon" />
      <h3>No clients found</h3>
      <p>
        {search || statusFilter !== "all"
          ? "Try adjusting your search or filters."
          : "Create your first client to get started."}
      </p>
      {!search && statusFilter === "all" && (
        <Button onClick={onCreateNew}>New Client</Button>
      )}
    </div>
  );
}

// =============================================================================
// Clients Table
// =============================================================================

export function ClientsTable({
  tenants,
  isLoading,
  search,
  statusFilter,
  onOpenWorkspace,
  onEdit,
  onDelete,
  onCreateNew,
  getHealthStatus,
}: ClientsTableProps) {
  if (isLoading) {
    return <ClientsTableSkeleton />;
  }

  if (tenants.length === 0) {
    return (
      <ClientsTableEmpty
        search={search}
        statusFilter={statusFilter}
        onCreateNew={onCreateNew}
      />
    );
  }

  return (
    <table className="clients-table">
      <thead className="clients-table-header">
        <tr>
          <th>Name</th>
          <th>Slug</th>
          <th>Status</th>
          <th>Tier</th>
          <th className="clients-col-pages">Pages</th>
          <th>Updated</th>
          <th className="clients-col-actions">Actions</th>
        </tr>
      </thead>
      <tbody className="clients-table-body">
        {tenants.map((tenant: TenantItem) => {
          const health = getHealthStatus(tenant.id);
          return (
            <tr key={tenant.id}>
              <td>
                <span className="clients-col-name">{tenant.businessName}</span>
              </td>
              <td>
                <span className="clients-col-slug">/{tenant.slug}</span>
              </td>
              <td>
                <span
                  className={`clients-status-pill ${statusClass[tenant.status] || "clients-status-inactive"}`}
                >
                  {health === "active" && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                  {statusLabel[tenant.status] || tenant.status}
                </span>
              </td>
              <td>
                <span
                  className={`clients-tier-badge ${tierClass[tenant.tier] || "clients-tier-content-editor"}`}
                >
                  {tierLabel[tenant.tier] || tenant.tier}
                </span>
              </td>
              <td className="clients-col-pages">
                {tenant._count?.pages ?? "--"}
              </td>
              <td className="clients-col-updated">
                {formatDate(tenant.updatedAt)}
              </td>
              <td className="clients-col-actions">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="clients-actions-trigger"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onOpenWorkspace(tenant)}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Workspace
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(tenant)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(tenant)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
