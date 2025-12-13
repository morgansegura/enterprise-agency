"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, type User } from "@/lib/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/layout/client-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/layout/dashboard-header/theme-switcher";
import { ProfileDropdown } from "@/components/layout/dashboard-header/profile-dropdown";
import {
  PreviewModeProvider,
  usePreviewModeOptional,
} from "@/lib/context/preview-mode-context";

import "./client-layout.css";

function ClientContent({
  user,
  onLogout,
  children,
}: {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const { isPreviewMode, pageContext } = usePreviewModeOptional();

  // In preview mode, render children without layout chrome
  if (isPreviewMode) {
    return <div className="client-layout-preview">{children}</div>;
  }

  return (
    <>
      <ClientSidebar user={user} />
      <SidebarInset>
        <header className="client-layout-header">
          <div className="client-layout-header-left">
            <SidebarTrigger className="client-layout-header-trigger" />
            <Separator
              orientation="vertical"
              className="client-layout-header-separator"
            />
          </div>
          {pageContext && (
            <div className="client-layout-header-center">
              <span className="client-layout-header-context-type">
                {pageContext.type}:
              </span>
              <span className="client-layout-header-context-title">
                {pageContext.title}
              </span>
            </div>
          )}
          <div className="client-layout-header-right">
            <ThemeSwitcher />
            <ProfileDropdown user={user} onLogout={onLogout} />
          </div>
        </header>
        <div className="client-layout-main">{children}</div>
      </SidebarInset>
    </>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
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
      <div className="client-layout-loading">
        <div className="client-layout-loading-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PreviewModeProvider>
      <SidebarProvider defaultOpen={false}>
        <ClientContent user={user} onLogout={handleLogout}>
          {children}
        </ClientContent>
      </SidebarProvider>
    </PreviewModeProvider>
  );
}
