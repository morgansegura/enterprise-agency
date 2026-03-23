"use client";

import * as React from "react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useUpdateTenantUser,
  type TenantUser,
} from "@/lib/hooks/use-tenants";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import "./edit-user-sheet.css";

interface EditUserSheetProps {
  tenantId: string;
  member: TenantUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleOptions = [
  { value: "CLIENT_ADMIN", label: "Admin" },
  { value: "CLIENT_EDITOR", label: "Editor" },
  { value: "SUB_CLIENT", label: "Sub Client" },
] as const;

export function EditUserSheet({
  tenantId,
  member,
  open,
  onOpenChange,
}: EditUserSheetProps) {
  const [roleOverride, setRoleOverride] = useState<string | null>(null);
  const role = roleOverride ?? member?.role ?? "CLIENT_EDITOR";
  const setRole = (newRole: string) => setRoleOverride(newRole);

  const updateUser = useUpdateTenantUser(tenantId);

  // Reset override when member changes (new sheet open)
  const prevMemberId = React.useRef(member?.user?.id);
  if (member?.user?.id !== prevMemberId.current) {
    prevMemberId.current = member?.user?.id;
    if (roleOverride !== null) setRoleOverride(null);
  }

  const displayName = member
    ? member.user.firstName || member.user.lastName
      ? `${member.user.firstName || ""} ${member.user.lastName || ""}`.trim()
      : member.user.email
    : "";

  const avatarInitial = member
    ? (member.user.firstName?.[0] || member.user.email[0]).toUpperCase()
    : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!member) return;

    updateUser.mutate(
      { userId: member.userId, data: { role } },
      {
        onSuccess: () => {
          toast.success("Permissions updated", {
            description: `${displayName} is now ${roleOptions.find((r) => r.value === role)?.label || role}`,
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Failed to update permissions", {
            description:
              error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.",
          });
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Permissions</SheetTitle>
          <SheetDescription>
            Update the role and permissions for this team member.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="edit-user-form">
          {member && (
            <div className="edit-user-info">
              <div className="edit-user-avatar">
                <span>{avatarInitial}</span>
              </div>
              <div className="edit-user-details">
                <p className="edit-user-name">{displayName}</p>
                <p className="edit-user-email">{member.user.email}</p>
              </div>
            </div>
          )}
          <div className="edit-user-field">
            <Label htmlFor="edit-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="edit-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
        <SheetFooter>
          <div className="edit-user-actions">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateUser.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateUser.isPending || role === member?.role}
            >
              {updateUser.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
