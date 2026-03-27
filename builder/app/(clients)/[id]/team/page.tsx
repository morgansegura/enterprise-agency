"use client";

import * as React from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useTenant,
  useTenantUsers,
  useRemoveTenantUser,
  type TenantUser,
} from "@/lib/hooks/use-tenants";
import { InviteUserSheet } from "@/components/team/invite-user-sheet";
import { EditUserSheet } from "@/components/team/edit-user-sheet";
import { PageHeader } from "@/components/layout/page-header";
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
  Users,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import "./team.css";

// =============================================================================
// Config
// =============================================================================

const roleConfig: Record<string, { label: string; className: string }> = {
  owner: { label: "Owner", className: "team-role-owner" },
  admin: { label: "Admin", className: "team-role-admin" },
  editor: { label: "Editor", className: "team-role-editor" },
  viewer: { label: "Viewer", className: "team-role-viewer" },
};

const statusConfig: Record<
  string,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "team-status-active",
  },
  inactive: {
    label: "Inactive",
    icon: Circle,
    className: "team-status-inactive",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "team-status-pending",
  },
};

// =============================================================================
// Team Page
// =============================================================================

export default function ClientTeamPage() {
  const params = useParams();
  const tenantId = params?.id as string;

  const { data: tenant } = useTenant(tenantId);
  const { data: teamMembers, isLoading, error } = useTenantUsers(tenantId);
  const removeMember = useRemoveTenantUser(tenantId);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editMember, setEditMember] = useState<TenantUser | null>(null);

  // ---------------------------------------------------------------------------
  // Filtered members
  // ---------------------------------------------------------------------------

  const filteredMembers = React.useMemo(() => {
    if (!teamMembers) return [];
    return teamMembers.filter((member) => {
      const fullName =
        `${member.user.firstName || ""} ${member.user.lastName || ""}`.toLowerCase();
      const matchesSearch =
        search === "" ||
        fullName.includes(search.toLowerCase()) ||
        member.user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [teamMembers, search, roleFilter]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleEdit = (member: TenantUser) => {
    setEditMember(member);
    setEditOpen(true);
  };

  const handleRemove = (member: TenantUser) => {
    const name = member.user.firstName
      ? `${member.user.firstName} ${member.user.lastName}`
      : member.user.email;
    if (confirm(`Remove "${name}" from this client's team?`)) {
      removeMember.mutate(member.userId, {
        onSuccess: () => toast.success(`${name} removed from team`),
        onError: () => toast.error("Failed to remove team member"),
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getMemberDisplayName = (member: TenantUser) => {
    if (member.user.firstName || member.user.lastName) {
      return `${member.user.firstName || ""} ${member.user.lastName || ""}`.trim();
    }
    return member.user.email;
  };

  const getInitial = (member: TenantUser) => {
    return (member.user.firstName?.[0] || member.user.email[0]).toUpperCase();
  };

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className="team-page">
        <div className="settings-error">
          <p>Error loading team: {error.message}</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="team-page">
      <PageHeader
        title="Team"
        icon={Users}
        count={teamMembers?.length}
        singularName="member"
        pluralName="members"
        description={
          tenant?.businessName ? `${tenant.businessName} team` : undefined
        }
        actionLabel="Invite Member"
        actionIcon={Plus}
        onAction={() => setInviteOpen(true)}
        showSearch
        searchPlaceholder="Search team members..."
        searchValue={search}
        onSearchChange={setSearch}
        showFilter
        filterOptions={[
          { value: "owner", label: "Owner" },
          { value: "admin", label: "Admin" },
          { value: "editor", label: "Editor" },
          { value: "viewer", label: "Viewer" },
        ]}
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterPlaceholder="All Roles"
      />

      {/* Table */}
      {isLoading ? (
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="team-skeleton-row">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1 max-w-[160px]" />
              <Skeleton className="h-4 w-48 hidden md:block" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-24 hidden lg:block" />
            </div>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="team-empty">
          <Users className="team-empty-icon" />
          <h3>No team members found</h3>
          <p>
            {search || roleFilter !== "all"
              ? "Try adjusting your filters"
              : "Invite your first team member to get started"}
          </p>
          {!search && roleFilter === "all" && (
            <Button onClick={() => setInviteOpen(true)}>
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>
      ) : (
        <div className="team-table">
          {/* Header */}
          <div className="team-table-header">
            <div className="team-table-header-row">
              <div className="team-table-header-cell team-table-header-name">
                Name
              </div>
              <div className="team-table-header-cell team-table-header-email">
                Email
              </div>
              <div className="team-table-header-cell team-table-header-role">
                Role
              </div>
              <div className="team-table-header-cell team-table-header-status">
                Status
              </div>
              <div className="team-table-header-cell team-table-header-joined">
                Joined
              </div>
              <div className="team-table-header-cell team-table-header-actions" />
            </div>
          </div>

          {/* Body */}
          <div className="team-table-body">
            {filteredMembers.map((member) => {
              const role = roleConfig[member.role] || roleConfig.viewer;
              const status =
                statusConfig[member.user.status] || statusConfig.inactive;
              const StatusIcon = status.icon;

              return (
                <div key={member.id} className="team-table-row">
                  {/* Name */}
                  <div className="team-table-cell team-table-cell-name">
                    <div className="team-member-avatar">
                      <span className="team-member-avatar-letter">
                        {getInitial(member)}
                      </span>
                    </div>
                    <span className="team-member-name-text">
                      {getMemberDisplayName(member)}
                      {member.role === "owner" && (
                        <ShieldCheck className="team-member-owner-icon" />
                      )}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="team-table-cell team-table-cell-email">
                    <span className="team-member-email">
                      {member.user.email}
                    </span>
                  </div>

                  {/* Role */}
                  <div className="team-table-cell team-table-cell-role">
                    <span className={`team-role-pill ${role.className}`}>
                      {role.label}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="team-table-cell team-table-cell-status">
                    <span className={`team-status-pill ${status.className}`}>
                      <StatusIcon />
                      {status.label}
                    </span>
                  </div>

                  {/* Joined */}
                  <div className="team-table-cell team-table-cell-joined">
                    <span className="team-member-joined">
                      {formatDate(member.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="team-table-cell team-table-cell-actions">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="team-actions-trigger"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(member)}>
                          <Pencil className="h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-[var(--status-error)]"
                          onClick={() => handleRemove(member)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sheets */}
      <InviteUserSheet
        tenantId={tenantId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
      <EditUserSheet
        tenantId={tenantId}
        member={editMember}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditMember(null);
        }}
      />
    </div>
  );
}
