"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import {
  EditorShell,
  type NavGroup,
  type NavItem,
} from "@/components/layout/editor-shell";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/layout/dashboard-header/theme-switcher";
import { ProfileDropdown } from "@/components/layout/dashboard-header/profile-dropdown";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  GlobeLock,
  Settings,
  Plus,
} from "lucide-react";

import "./dashboard-layout.css";

function DashboardContent({
  user,
  onLogout,
  children,
}: {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const navGroups: NavGroup[] = [
    {
      items: [
        {
          id: "dashboard",
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/dashboard",
          isActive:
            isActive("/dashboard") &&
            !isActive("/dashboard/clients") &&
            !isActive("/dashboard/users"),
        },
      ],
    },
    {
      items: [
        {
          id: "clients",
          icon: BriefcaseBusiness,
          label: "Manage Clients",
          href: "/dashboard/clients",
          isActive: isActive("/dashboard/clients"),
        },
        {
          id: "users",
          icon: GlobeLock,
          label: "Manage Users",
          href: "/dashboard/users",
          isActive: isActive("/dashboard/users"),
        },
      ],
    },
    {
      items: [
        {
          id: "new-client",
          icon: Plus,
          label: "New Client",
          href: "/dashboard/clients/new",
          isActive: isActive("/dashboard/clients/new"),
        },
      ],
    },
  ];

  const bottomNav: NavItem[] = [
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      onClick: () => {
        // TODO: Open settings drawer
      },
    },
  ];

  return (
    <>
      <DashboardSidebar user={user} onLogout={onLogout} />
      <SidebarInset>
        <header className="dashboard-layout-header">
          <div className="dashboard-layout-header-left">
            <SidebarTrigger className="dashboard-layout-header-trigger" />
            <Separator
              orientation="vertical"
              className="dashboard-layout-header-separator"
            />
          </div>
          <div className="dashboard-layout-header-right">
            <ThemeSwitcher />
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </header>
        <div className="scrollbar-y mr-1">
          <EditorShell navGroups={navGroups} bottomNav={bottomNav}>
            {children}
          </EditorShell>
        </div>
      </SidebarInset>
    </>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      <div className="dashboard-layout-loading">
        <div className="dashboard-layout-loading-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardContent user={user} onLogout={handleLogout}>
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}

export default DashboardLayout;
