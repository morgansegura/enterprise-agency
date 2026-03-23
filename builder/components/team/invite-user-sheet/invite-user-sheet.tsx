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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteTenantUser } from "@/lib/hooks/use-tenants";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import "./invite-user-sheet.css";

interface InviteUserSheetProps {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const roleOptions = [
  { value: "CLIENT_ADMIN", label: "Admin" },
  { value: "CLIENT_EDITOR", label: "Editor" },
  { value: "SUB_CLIENT", label: "Sub Client" },
] as const;

export function InviteUserSheet({
  tenantId,
  open,
  onOpenChange,
}: InviteUserSheetProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CLIENT_EDITOR");
  const [emailError, setEmailError] = useState("");

  const inviteUser = useInviteTenantUser(tenantId);

  const resetForm = () => {
    setEmail("");
    setRole("CLIENT_EDITOR");
    setEmailError("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    inviteUser.mutate(
      { email: email.trim(), role },
      {
        onSuccess: () => {
          toast.success("Invitation sent", {
            description: `Invited ${email.trim()} as ${roleOptions.find((r) => r.value === role)?.label}`,
          });
          resetForm();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Failed to send invitation", {
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
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Invite Team Member</SheetTitle>
          <SheetDescription>
            Send an invitation to join this team. They will receive an email with
            instructions to get started.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="invite-user-form">
          <div className="invite-user-field">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => {
                if (email) validateEmail(email);
              }}
              autoFocus
            />
            {emailError && (
              <p className="invite-user-error">{emailError}</p>
            )}
          </div>
          <div className="invite-user-field">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="invite-role">
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
          <div className="invite-user-actions">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={inviteUser.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={inviteUser.isPending || !email.trim()}
            >
              {inviteUser.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Send Invitation
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
