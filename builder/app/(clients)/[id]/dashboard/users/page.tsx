"use client";

import * as React from "react";
import { useAdminUsers, useDeleteUser, useInviteUser } from "@/lib/hooks";
import { ContentList, type MenuAction } from "@/components/layout/content-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Users, Mail, Shield } from "lucide-react";

// User item type for ContentList
interface UserItem {
  id: string;
  title: string;
  email: string;
  firstName: string;
  lastName: string;
  agencyRole: string;
  status?: string;
  updatedAt?: string;
  isSuperAdmin?: boolean;
}

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  developer: "Developer",
  designer: "Designer",
  content_manager: "Content Manager",
};

export default function ManageUsersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  // State
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);
  const [inviteData, setInviteData] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    agencyRole: "content_manager" as const,
  });

  // Queries
  const { data: users, isLoading, error } = useAdminUsers();
  const deleteUser = useDeleteUser();
  const inviteUser = useInviteUser();

  // Transform users to include title field
  const userItems: UserItem[] = React.useMemo(() => {
    if (!users) return [];
    return users.map((u) => ({
      ...u,
      title: `${u.firstName} ${u.lastName}`,
    }));
  }, [users]);

  // Handlers
  const handleCreate = () => {
    setInviteData({
      email: "",
      firstName: "",
      lastName: "",
      agencyRole: "content_manager",
    });
    setInviteDialogOpen(true);
  };

  const handleEdit = (user: UserItem) => {
    toast.info("User editing coming soon");
  };

  const handleDelete = (user: UserItem) => {
    if (confirm(`Delete user "${user.firstName} ${user.lastName}"?`)) {
      deleteUser.mutate(user.id, {
        onSuccess: () => {
          toast.success("User deleted");
        },
        onError: () => {
          toast.error("Failed to delete user");
        },
      });
    }
  };

  const handleInvite = () => {
    if (!inviteData.email || !inviteData.firstName || !inviteData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    inviteUser.mutate(inviteData, {
      onSuccess: () => {
        toast.success(`Invitation sent to ${inviteData.email}`);
        setInviteDialogOpen(false);
      },
      onError: () => {
        toast.error("Failed to send invitation");
      },
    });
  };

  // Custom menu actions
  const menuActions: MenuAction<UserItem>[] = [
    {
      label: "Send Invite",
      icon: Mail,
      onClick: (user) => {
        toast.info(`Resending invite to ${user.email}`);
      },
    },
  ];

  return (
    <>
      <ContentList<UserItem>
        title="Manage Users"
        singularName="User"
        pluralName="users"
        icon={Users}
        items={userItems}
        isLoading={isLoading}
        error={error}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showStatus={false}
        searchFields={["title", "email", "firstName", "lastName"]}
        filterOptions={[
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "pending", label: "Pending" },
        ]}
        menuActions={menuActions}
        badges={[
          {
            show: (user) => Boolean(user.isSuperAdmin),
            icon: Shield,
            className: "bg-purple-100 text-purple-600",
            title: "Super Admin",
          },
        ]}
        renderListMeta={(user) => (
          <span className="text-sm text-(--muted-foreground)">
            {roleLabels[user.agencyRole] || user.agencyRole}
          </span>
        )}
        renderMeta={(user) => (
          <div className="mt-1">
            <p className="text-xs text-(--muted-foreground)">{user.email}</p>
            <p className="text-xs text-(--muted-foreground)">
              {roleLabels[user.agencyRole] || user.agencyRole}
            </p>
          </div>
        )}
      />

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={inviteData.firstName}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, firstName: e.target.value })
                  }
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={inviteData.lastName}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, lastName: e.target.value })
                  }
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                onChange={(e) =>
                  setInviteData({ ...inviteData, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={inviteData.agencyRole}
                onValueChange={(value: typeof inviteData.agencyRole) =>
                  setInviteData({ ...inviteData, agencyRole: value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="content_manager">
                    Content Manager
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={inviteUser.isPending}>
              {inviteUser.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
