"use client";
 

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { logout, type User } from "@/lib/auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  PreviewModeProvider,
  usePreviewModeOptional,
} from "@/lib/context/preview-mode-context";
import { useTenant } from "@/lib/hooks";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/layout/client-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/layout/dashboard-header/theme-switcher";
import { ProfileDropdown } from "@/components/layout/dashboard-header/profile-dropdown";
import "./client-layout.css";

function ClientContent({
  user,
  children,
  onLogout: _onLogout,
}: {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const { isPreviewMode } = usePreviewModeOptional();

  // In preview mode, render children without layout chrome
  if (isPreviewMode) {
    return <div className="client-layout-preview">{children}</div>;
  }

  return (
    <>
      <ClientSidebar user={user} />
      <SidebarInset>
        {/* Hide header when page has its own toolbar (e.g., editor pages) */}
        <div className="client-layout-main">{children}</div>
      </SidebarInset>
    </>
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

  const { pageContext, hasCustomToolbar } = usePreviewModeOptional();

  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tenant } = useTenant(tenantId);

  // Header branding - white-labeled per tenant
  const brandName =
    tenantId && tenant?.businessName ? tenant.businessName : "Web & Funnel";
  const brandHref = tenantId ? `/${tenantId}` : "/clients";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Redirect to login when not authenticated
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="client-layout-loading">
        <div className="space-y-4 w-full max-w-md">
          <div className="h-8 w-40 bg-[var(--el-100)] rounded animate-pulse mx-auto" />
          <div className="h-4 w-56 bg-[var(--el-100)] rounded animate-pulse mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PreviewModeProvider>
      <div className="client-layout">
        {!hasCustomToolbar ? (
          <header className="client-layout-header">
            <div className="client-layout-header-left">
              <Link href={brandHref} className="client-layout-header-logo">
                <span className="client-layout-header-logo-text">
                  {brandName}
                </span>
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
        ) : null}
        <SidebarProvider defaultOpen={false}>
          <ClientContent user={user} onLogout={handleLogout}>
            {children}
          </ClientContent>
        </SidebarProvider>
      </div>
    </PreviewModeProvider>
  );
}
