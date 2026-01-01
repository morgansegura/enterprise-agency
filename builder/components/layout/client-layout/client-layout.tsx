"use client";

import Link from "next/link";
import { Pyramid } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getCurrentUser, logout, type User } from "@/lib/auth";
import {
  PreviewModeProvider,
  usePreviewModeOptional,
} from "@/lib/context/preview-mode-context";
import { useTenant } from "@/lib/hooks";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/layout/client-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/layout/dashboard-header/theme-switcher";
import { ProfileDropdown } from "@/components/layout/dashboard-header/profile-dropdown";
import { TenantLogo } from "@/components/ui/tenant-logo";

import "./client-layout.css";
import { WFLogoIcon } from "@/components/editor/client-logos/wf-logo";

function ClientContent({
  user,
  children,
  onLogout,
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { pageContext, hasCustomToolbar } = usePreviewModeOptional();

  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tenant } = useTenant(tenantId);

  // Header branding - white-labeled per tenant
  const brandName =
    tenantId && tenant?.businessName ? tenant.businessName : "Web & Funnel";
  const brandHref = tenantId ? `/${tenantId}` : "/clients";

  // Custom icon from tenant settings (prefer SVG, fallback to URL)
  const tenantIconSvg = (tenant as { iconSvg?: string } | undefined)?.iconSvg;
  const tenantIconUrl = (tenant as { iconUrl?: string } | undefined)?.iconUrl;

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
      <div className="client-layout">
        {!hasCustomToolbar ? (
          <header className="client-layout-header">
            <div className="client-layout-header-left">
              <Link href={brandHref}>
                <div className="client-layout-header-logo">
                  {tenantIconSvg ? (
                    <TenantLogo
                      svg={tenantIconSvg}
                      variant="icon"
                      size="sm"
                      alt={brandName}
                    />
                  ) : tenantIconUrl ? (
                    <img
                      src={tenantIconUrl}
                      alt={brandName}
                      className="h-4 w-4 object-contain"
                    />
                  ) : (
                    <WFLogoIcon size="sm" />
                  )}
                  <div className="client-layout-header-logo-text">
                    <span className="client-layout-header-logo-title">
                      {brandName}
                    </span>
                  </div>
                </div>
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
