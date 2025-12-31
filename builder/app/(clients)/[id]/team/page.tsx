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
  Users,
  Search,
  LayoutGrid,
  List,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  ShieldCheck,
  Mail,
  Circle,
  CheckCircle2,
  Clock,
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
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-600 text-amber-50",
  },
} as const;

// Role labels
const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export default function ClientTeamPage() {
  const params = useParams();
  const tenantId = params?.id as string;

  const { data: tenant } = useTenant(tenantId);
  const { data: teamMembers, isLoading, error } = useTenantUsers(tenantId);
  const removeMember = useRemoveTenantUser(tenantId);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter team members
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

  const handleInvite = () => {
    // TODO: Open invite modal
    console.log("Invite team member");
  };

  const handleEdit = (member: TenantUser) => {
    // TODO: Open edit modal
    console.log("Edit member", member.id);
  };

  const handleRemove = (member: TenantUser) => {
    const name = member.user.firstName
      ? `${member.user.firstName} ${member.user.lastName}`
      : member.user.email;
    if (confirm(`Remove "${name}" from this client's team?`)) {
      removeMember.mutate(member.userId);
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

  const getMemberDisplayName = (member: TenantUser) => {
    if (member.user.firstName || member.user.lastName) {
      return `${member.user.firstName || ""} ${member.user.lastName || ""}`.trim();
    }
    return member.user.email;
  };

  if (error) {
    return (
      <PageLayout title="Client Team" description="Error loading team members">
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
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="indent-9 pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
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
      title="Client Team"
      description={`${tenant?.businessName || "Client"} - ${teamMembers?.length || 0} team members`}
      actions={
        <Button onClick={handleInvite}>
          <Plus className="h-4 w-4" />
          Invite Member
        </Button>
      }
      toolbar={toolbar}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-16 w-16 text-(--muted-foreground) mb-4" />
          <h3 className="text-lg font-medium mb-2">No team members found</h3>
          <p className="text-(--muted-foreground) mb-4">
            {search || roleFilter !== "all"
              ? "Try adjusting your filters"
              : "Invite your first team member to get started"}
          </p>
          {!search && roleFilter === "all" && (
            <Button onClick={handleInvite}>
              <Plus className="h-4 w-4 " />
              Invite Member
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const status =
              statusConfig[member.user.status as keyof typeof statusConfig] ||
              statusConfig.inactive;
            const StatusIcon = status.icon;

            return (
              <div
                key={member.id}
                className="border rounded-lg p-4 hover:border-(--primary) transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-(--muted) flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {(
                          member.user.firstName?.[0] || member.user.email[0]
                        ).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium flex items-center gap-1.5">
                        {getMemberDisplayName(member)}
                        {member.role === "owner" && (
                          <span title="Owner">
                            <ShieldCheck className="h-4 w-4 text-(--primary)" />
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-(--muted-foreground)">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(member)}>
                        <Pencil className="h-4 w-4 " />
                        Edit Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 " />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleRemove(member)}
                      >
                        <Trash2 className="h-4 w-4 " />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-0.5 rounded-full bg-(--muted) text-(--muted-foreground)">
                    {roleLabels[member.role] || member.role}
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
          {filteredMembers.map((member) => {
            const status =
              statusConfig[member.user.status as keyof typeof statusConfig] ||
              statusConfig.inactive;
            const StatusIcon = status.icon;

            return (
              <div
                key={member.id}
                className="flex items-center gap-4 p-3 border rounded-lg hover:border-(--primary) transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-(--muted) flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium">
                    {(
                      member.user.firstName?.[0] || member.user.email[0]
                    ).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium flex items-center gap-1.5 truncate">
                    {getMemberDisplayName(member)}
                    {member.role === "owner" && (
                      <span title="Owner">
                        <ShieldCheck className="h-4 w-4 text-(--primary)" />
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-(--muted-foreground) truncate">
                    {member.user.email}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-(--muted) text-(--muted-foreground) text-sm shrink-0">
                  {roleLabels[member.role] || member.role}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm shrink-0 ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
                <span className="text-sm text-(--muted-foreground) shrink-0">
                  {formatDate(member.lastActiveAt)}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(member)}>
                      <Pencil className="h-4 w-4 " />
                      Edit Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 " />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleRemove(member)}
                    >
                      <Trash2 className="h-4 w-4 " />
                      Remove
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
