"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  useTenantUsers,
  useUpdateTenantUser,
  useRemoveTenantUser,
  type TenantUser,
} from "@/lib/hooks/use-tenants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Users, Trash2, Shield, UserCog } from "lucide-react";

import "./team.css";

const ROLES = ["owner", "admin", "editor", "viewer"] as const;

function getRoleLabel(role: string) {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "editor":
      return "Editor";
    case "viewer":
      return "Viewer";
    default:
      return role;
  }
}

function getInitials(firstName?: string, lastName?: string, email?: string) {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "?";
}

function formatDate(dateString?: string) {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TeamPage() {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: members, isLoading, error } = useTenantUsers(tenantId);
  const updateUser = useUpdateTenantUser(tenantId);
  const removeUser = useRemoveTenantUser(tenantId);

  const handleChangeRole = (member: TenantUser, newRole: string) => {
    if (member.role === newRole) return;
    updateUser.mutate({ userId: member.userId, data: { role: newRole } });
  };

  const handleRemove = (member: TenantUser) => {
    const name = member.user.firstName
      ? `${member.user.firstName} ${member.user.lastName || ""}`
      : member.user.email;
    if (confirm(`Remove ${name.trim()} from this workspace?`)) {
      removeUser.mutate(member.userId);
    }
  };

  if (error) {
    return (
      <div className="team-error">
        <p>Error loading team members: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="team-container">
      <div className="team-header">
        <div className="team-header-title">
          <h1>Team</h1>
          <span className="team-header-count">
            {members?.length || 0}{" "}
            {members?.length === 1 ? "member" : "members"}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="team-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="team-member-card">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : members?.length === 0 ? (
        <div className="team-empty">
          <Users className="team-empty-icon" />
          <h3>No team members</h3>
          <p>This workspace has no team members yet.</p>
        </div>
      ) : (
        <div className="team-list">
          {members?.map((member) => (
            <div key={member.id} className="team-member-card">
              <div className="team-member-avatar">
                {getInitials(
                  member.user.firstName,
                  member.user.lastName,
                  member.user.email,
                )}
              </div>
              <div className="team-member-info">
                <h3 className="team-member-name">
                  {member.user.firstName
                    ? `${member.user.firstName} ${member.user.lastName || ""}`
                    : member.user.email}
                </h3>
                <p className="team-member-email">{member.user.email}</p>
              </div>
              <span
                className={`team-member-role team-member-role-${member.role}`}
              >
                {getRoleLabel(member.role)}
              </span>
              <span className="team-member-date">
                Joined {formatDate(member.createdAt)}
              </span>
              {member.role !== "owner" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      <UserCog className="h-4 w-4 mr-2" />
                      Change Role
                    </DropdownMenuItem>
                    {ROLES.filter(
                      (r) => r !== "owner" && r !== member.role,
                    ).map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => handleChangeRole(member, role)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Make {getRoleLabel(role)}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleRemove(member)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
