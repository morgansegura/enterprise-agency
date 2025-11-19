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

import "./dashboard-layout.css";

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
    <SidebarProvider>
      <DashboardSidebar user={user} onLogout={handleLogout} />
      <SidebarInset>
        <header className="dashboard-layout-header">
          <SidebarTrigger className="dashboard-layout-header-trigger" />
          <Separator
            orientation="vertical"
            className="dashboard-layout-header-separator"
          />
        </header>
        <main className="dashboard-layout-main">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
