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
  MoreHorizontal,
  Pencil,
  UserX,
  ShieldCheck,
} from "lucide-react";

import "./users-table.css";

// =============================================================================
// Types
// =============================================================================

export interface UserItem {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  agencyRole: string;
  status: string;
  isSuperAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

// =============================================================================
// Helpers
// =============================================================================

const statusClass: Record<string, string> = {
  active: "users-status-active",
  inactive: "users-status-inactive",
  pending: "users-status-pending",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
};

const roleClass: Record<string, string> = {
  owner: "users-role-owner",
  admin: "users-role-admin",
  developer: "users-role-developer",
  designer: "users-role-designer",
  content_manager: "users-role-content-manager",
};

const roleLabel: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  developer: "Developer",
  designer: "Designer",
  content_manager: "Content Manager",
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

export const getUserDisplayName = (user: UserItem) => {
  if (user.firstName || user.lastName) {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  }
  return user.email;
};

const getUserInitial = (user: UserItem) =>
  (user.firstName?.[0] || user.email[0]).toUpperCase();

// =============================================================================
// Props
// =============================================================================

interface UsersTableProps {
  users: UserItem[];
  isLoading: boolean;
  search: string;
  roleFilter: string;
  onEdit: (user: UserItem) => void;
  onDeactivate: (user: UserItem) => void;
  onInvite: () => void;
}

// =============================================================================
// Component
// =============================================================================

export function UsersTable({
  users,
  isLoading,
  search,
  roleFilter,
  onEdit,
  onDeactivate,
  onInvite,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="users-skeleton-row">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-8" />
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="users-empty">
        <Users className="users-empty-icon" />
        <h3>No users found</h3>
        <p>
          {search || roleFilter !== "all"
            ? "Try adjusting your search or filters."
            : "Invite your first team member to get started."}
        </p>
        {!search && roleFilter === "all" && (
          <Button onClick={onInvite}>Invite User</Button>
        )}
      </div>
    );
  }

  return (
    <table className="users-table">
      <thead className="users-table-header">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Last Login</th>
          <th className="users-col-actions">Actions</th>
        </tr>
      </thead>
      <tbody className="users-table-body">
        {users.map((user: UserItem) => (
          <tr key={user.id}>
            <td>
              <div className="users-col-identity">
                <span className="users-avatar">{getUserInitial(user)}</span>
                <span className="users-col-name">
                  {getUserDisplayName(user)}
                  {user.isSuperAdmin && (
                    <ShieldCheck className="users-super-admin-icon" />
                  )}
                </span>
              </div>
            </td>
            <td>
              <span className="users-col-email">{user.email}</span>
            </td>
            <td>
              <span
                className={`users-role-badge ${roleClass[user.agencyRole] || "users-role-content-manager"}`}
              >
                {roleLabel[user.agencyRole] || user.agencyRole}
              </span>
            </td>
            <td>
              <span
                className={`users-status-pill ${statusClass[user.status] || "users-status-inactive"}`}
              >
                {statusLabel[user.status] || user.status}
              </span>
            </td>
            <td className="users-col-last-login">
              {formatDate(user.lastLoginAt || user.updatedAt)}
            </td>
            <td className="users-col-actions">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="users-actions-trigger"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(user)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDeactivate(user)}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Deactivate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
