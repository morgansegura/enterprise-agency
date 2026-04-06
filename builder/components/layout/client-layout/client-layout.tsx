"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout, type User } from "@/lib/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  PreviewModeProvider,
  usePreviewModeOptional,
} from "@/lib/context/preview-mode-context";
import { useTenant } from "@/lib/hooks";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/layout/client-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/layout/dashboard-header/theme-switcher";
import { ProfileDropdown } from "@/components/layout/dashboard-header/profile-dropdown";
import "./client-layout.css";

/**
 * Inner shell — reads PreviewModeContext from INSIDE the provider.
 * Decides whether to show admin chrome (header + sidebar) or editor mode.
 */
function ClientShell({
  user,
  brandName,
  brandHref,
  onLogout,
  children,
}: {
  user: User;
  brandName: string;
  brandHref: string;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const { isPreviewMode, hasCustomToolbar, pageContext } =
    usePreviewModeOptional();

  // Preview mode — full screen, no chrome
  if (isPreviewMode) {
    return <div className="client-layout-preview">{children}</div>;
  }

  // Editor mode — hide admin header + sidebar
  if (hasCustomToolbar) {
    return (
      <div className="client-layout client-layout-editor">{children}</div>
    );
  }

  // Normal admin mode — header + sidebar + content
  return (
    <div className="client-layout">
      <header className="client-layout-header">
        <div className="client-layout-header-left">
          <Link href={brandHref} className="client-layout-header-logo">
            <span className="client-layout-header-logo-text">{brandName}</span>
          </Link>
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
      <SidebarProvider defaultOpen={false}>
        <ClientSidebar user={user} />
        <SidebarInset>
          <div className="client-layout-main">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export function ClientLayout({
  children,
  onLogout,
}: {
  onLogout?: () => void;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading: loading } = useAuthStore();

  const { tenantId } = useResolvedTenant();
  const { data: tenant } = useTenant(tenantId || "");

  const brandName =
    tenantId && tenant?.businessName ? tenant.businessName : "Web & Funnel";
  const brandHref = tenantId ? "/pages" : "/clients";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="client-layout-loading">
        <div className="space-y-4 w-full max-w-md">
          <div className="h-8 w-40 bg-(--el-100) rounded animate-pulse mx-auto" />
          <div className="h-4 w-56 bg-(--el-100) rounded animate-pulse mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PreviewModeProvider>
      <ClientShell
        user={user}
        brandName={brandName}
        brandHref={brandHref}
        onLogout={onLogout ?? handleLogout}
      >
        {children}
      </ClientShell>
    </PreviewModeProvider>
  );
}
