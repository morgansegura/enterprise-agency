"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/layout/dashboard-header/theme-switcher";
import { ProfileDropdown } from "@/components/layout/dashboard-header/profile-dropdown";

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
        <div className="dashboard-layout-main">{children}</div>
      </SidebarInset>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
