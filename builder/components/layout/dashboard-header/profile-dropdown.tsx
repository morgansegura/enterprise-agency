"use client";

import * as React from "react";
import { User, Settings, Users, HelpCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import "./profile-dropdown.css";

interface ProfileDropdownProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isSuperAdmin: boolean;
  };
  onLogout: () => void;
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="profile-dropdown-avatar">
            <span className="profile-dropdown-avatar-initials">
              {user.firstName[0]}
              {user.lastName[0]}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="profile-dropdown-user-info">
            <p className="profile-dropdown-user-name">
              {user.firstName} {user.lastName}
            </p>
            <p className="profile-dropdown-user-email">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
          <User />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>
        {user.isSuperAdmin && (
          <DropdownMenuItem onClick={() => router.push("/dashboard/team")}>
            <Users />
            <span>Team Management</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => router.push("/dashboard/support")}>
          <HelpCircle />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="profile-dropdown-logout"
        >
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
