"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/layout/dashboard-header/theme-switcher";
import { ProfileDropdown } from "@/components/layout/dashboard-header/profile-dropdown";
import { cn } from "@/lib/utils";

import "./editor-shell.css";

// =============================================================================
// Types
// =============================================================================

export interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface NavGroup {
  items: NavItem[];
}

export interface EditorShellProps {
  /** Navigation groups - each group is separated by a divider */
  navGroups: NavGroup[];
  /** Bottom navigation items (settings, etc.) */
  bottomNav?: NavItem[];
  /** Optional title shown in header */
  headerTitle?: string;
  /** Main content */
  children: React.ReactNode;
}

// =============================================================================
// Component
// =============================================================================

export function EditorShell({
  navGroups,
  bottomNav,
  headerTitle,
  children,
}: EditorShellProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="editor-shell-loading">
        <div className="editor-shell-loading-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="editor-shell">
      {/* Icon Toolbar */}
      <aside className="editor-shell-sidebar">
        {navGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <Separator className="my-2 w-8" />}
            {group.items.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  {item.href ? (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      asChild
                      className={cn(
                        item.isActive && "bg-(--accent) text-(--accent-foreground)"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={item.onClick}
                      className={cn(
                        item.isActive && "bg-(--accent) text-(--accent-foreground)"
                      )}
                    >
                      <item.icon />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </React.Fragment>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Navigation */}
        {bottomNav && bottomNav.length > 0 && (
          <>
            {bottomNav.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  {item.href ? (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      asChild
                      className={cn(
                        item.isActive && "bg-(--accent) text-(--accent-foreground)"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={item.onClick}
                      className={cn(
                        item.isActive && "bg-(--accent) text-(--accent-foreground)"
                      )}
                    >
                      <item.icon />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="editor-shell-main">
        <header className="editor-shell-header">
          <div className="editor-shell-header-left">
            {headerTitle && (
              <span className="text-sm font-medium text-muted-foreground">
                {headerTitle}
              </span>
            )}
          </div>
          <div className="editor-shell-header-right">
            <ThemeSwitcher />
            <ProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        </header>
        <main className="editor-shell-content">{children}</main>
      </div>
    </div>
  );
}
