"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminUsers, useDeleteUser } from "@/lib/hooks";
import { PageHeader } from "@/components/layout/page-header";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { UsersTable, getUserDisplayName } from "./components/users-table";
import type { UserItem } from "./components/users-table";

import "./users.css";

// =============================================================================
// Users Page
// =============================================================================

export default function UsersPage() {
  const router = useRouter();
  const { data: users, isLoading, error } = useAdminUsers();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Filter users
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    return users.filter((user: UserItem) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const matchesSearch =
        search === "" ||
        fullName.includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole =
        roleFilter === "all" || user.agencyRole === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // Surface errors via toast
  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load users");
    }
  }, [error]);

  const handleEdit = (user: UserItem) => {
    router.push(`/users/${user.id}`);
  };

  const handleDeactivate = (user: UserItem) => {
    const name = getUserDisplayName(user);
    if (confirm(`Deactivate user "${name}"? They will lose access.`)) {
      deleteUser.mutate(user.id, {
        onSuccess: () => toast.success("User deactivated"),
        onError: () => toast.error("Failed to deactivate user"),
      });
    }
  };

  const handleInvite = () => router.push("/users/new");

  return (
    <div className="users-page">
      <PageHeader
        title="Users"
        icon={Users}
        count={filteredUsers.length}
        singularName="user"
        pluralName="users"
        actionLabel="Invite User"
        onAction={handleInvite}
        showSearch
        searchPlaceholder="Search users..."
        searchValue={search}
        onSearchChange={setSearch}
        showFilter
        filterOptions={[
          { value: "owner", label: "Owner" },
          { value: "admin", label: "Admin" },
          { value: "developer", label: "Developer" },
          { value: "designer", label: "Designer" },
          { value: "content_manager", label: "Content Manager" },
        ]}
        filterValue={roleFilter}
        onFilterChange={setRoleFilter}
        filterPlaceholder="All Roles"
      />

      <UsersTable
        users={filteredUsers}
        isLoading={isLoading}
        search={search}
        roleFilter={roleFilter}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onInvite={handleInvite}
      />
    </div>
  );
}
