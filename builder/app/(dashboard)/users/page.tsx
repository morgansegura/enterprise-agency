"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminUsers, useDeleteUser } from "@/lib/hooks";
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
  PlusCircle,
} from "lucide-react";

// User item type
interface UserItem {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  agencyRole: string;
  status: string;
  isSuperAdmin?: boolean;
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
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-amber-600 bg-amber-50",
  },
} as const;

// Role labels
const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  developer: "Developer",
  designer: "Designer",
  content_manager: "Content Manager",
};

export default function UsersPage() {
  const router = useRouter();
  const { data: users, isLoading, error } = useAdminUsers();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter users
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const matchesSearch =
        search === "" ||
        fullName.includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const handleCreate = () => {
    router.push("/users/new");
  };

  const handleEdit = (user: UserItem) => {
    router.push(`/users/${user.id}`);
  };

  const handleDelete = (user: UserItem) => {
    const name = user.firstName
      ? `${user.firstName} ${user.lastName}`
      : user.email;
    if (confirm(`Delete user "${name}"?`)) {
      deleteUser.mutate(user.id);
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

  const getUserDisplayName = (user: UserItem) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email;
  };

  if (error) {
    return (
      <PageLayout title="Manage Users" description="Error loading users">
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
          placeholder="Search users..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
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
      title="Manage Users"
      description={`${users?.length || 0} total users`}
      actions={
        <Button onClick={handleCreate}>
          <PlusCircle className="h-4 w-4" />
          Invite User
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
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-16 w-16 text-(--muted-foreground) mb-4" />
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-(--muted-foreground) mb-4">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Invite your first team member to get started"}
          </p>
          {!search && statusFilter === "all" && (
            <Button onClick={handleCreate}>
              <PlusCircle className="h-4 w-4 " />
              Invite User
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const status =
              statusConfig[user.status as keyof typeof statusConfig] ||
              statusConfig.inactive;
            const StatusIcon = status.icon;

            return (
              <div
                key={user.id}
                className="border rounded-lg p-4 hover:border-(--primary) transition-colors cursor-pointer"
                onClick={() => handleEdit(user)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-(--muted) flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium flex items-center gap-1.5">
                        {getUserDisplayName(user)}
                        {user.isSuperAdmin && (
                          <span title="Super Admin">
                            <ShieldCheck className="h-4 w-4 text-(--primary)" />
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-(--muted-foreground)">
                        {user.email}
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
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4 " />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 " />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="h-4 w-4 " />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-0.5 rounded-full bg-(--muted) text-(--muted-foreground)">
                    {roleLabels[user.agencyRole] || user.agencyRole}
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
          {filteredUsers.map((user) => {
            const status =
              statusConfig[user.status as keyof typeof statusConfig] ||
              statusConfig.inactive;
            const StatusIcon = status.icon;

            return (
              <div
                key={user.id}
                className="flex items-center gap-4 p-3 border rounded-lg hover:border-(--primary) transition-colors cursor-pointer"
                onClick={() => handleEdit(user)}
              >
                <div className="h-10 w-10 rounded-full bg-(--muted) flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium flex items-center gap-1.5 truncate">
                    {getUserDisplayName(user)}
                    {user.isSuperAdmin && (
                      <span title="Super Admin">
                        <ShieldCheck className="h-4 w-4 text-(--primary)" />
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-(--muted-foreground) truncate">
                    {user.email}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-(--muted) text-(--muted-foreground) text-sm shrink-0">
                  {roleLabels[user.agencyRole] || user.agencyRole}
                </span>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm shrink-0 ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
                <span className="text-sm text-(--muted-foreground) shrink-0">
                  {formatDate(user.updatedAt)}
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
                    <DropdownMenuItem onClick={() => handleEdit(user)}>
                      <Pencil className="h-4 w-4 " />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 " />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(user)}
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
