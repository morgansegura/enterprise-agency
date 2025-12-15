"use client";

import * as React from "react";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { useParams, usePathname } from "next/navigation";
import {
  EditorShell,
  type NavGroup,
  type NavItem,
} from "@/components/layout/editor-shell";
import { EntitySettingsDrawer } from "@/components/settings/entity-settings-drawer";
import { GlobalSettingsDrawer } from "@/components/settings/global-settings-drawer";
import {
  PanelsTopLeft,
  Newspaper,
  Store,
  Image,
  Settings,
  Globe,
  BriefcaseBusiness,
  GlobeLock,
  Tags,
  Package,
  Receipt,
  Users,
} from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const tenantId = params?.id as string;

  // Drawer state
  const [pageSettingsOpen, setPageSettingsOpen] = React.useState(false);
  const [globalSettingsOpen, setGlobalSettingsOpen] = React.useState(false);

  const isActive = (path: string) => {
    if (!pathname) return false;
    return pathname.startsWith(`/${tenantId}${path}`);
  };

  const navGroups: NavGroup[] = [
    {
      items: [
        {
          id: "clients",
          icon: BriefcaseBusiness,
          label: "Manage Clients",
          href: `/${tenantId}/dashboard/clients`,
          isActive: isActive("/dashboard/clients"),
        },
        {
          id: "users",
          icon: GlobeLock,
          label: "Manage Users",
          href: `/${tenantId}/dashboard/users`,
          isActive: isActive("/dashboard/users"),
        },
      ],
    },
    {
      items: [
        {
          id: "pages",
          icon: PanelsTopLeft,
          label: "Website Editor",
          href: `/${tenantId}/pages`,
          isActive: isActive("/pages"),
        },
        {
          id: "media",
          icon: Image,
          label: "Media Library",
          href: `/${tenantId}/media`,
          isActive: isActive("/media"),
        },
        {
          id: "posts",
          icon: Newspaper,
          label: "Blog Editor",
          href: `/${tenantId}/posts`,
          isActive: isActive("/posts"),
        },
        {
          id: "tags",
          icon: Tags,
          label: "Tag Editor",
          href: `/${tenantId}/tags`,
          isActive: isActive("/tags"),
        },
      ],
    },
    {
      items: [
        {
          id: "shop",
          icon: Store,
          label: "Shop Editor",
          href: `/${tenantId}/shop`,
          isActive:
            isActive("/shop") &&
            !isActive("/shop/products") &&
            !isActive("/shop/orders") &&
            !isActive("/shop/customers"),
        },
        {
          id: "products",
          icon: Package,
          label: "Products",
          href: `/${tenantId}/shop/products`,
          isActive: isActive("/shop/products"),
        },
        {
          id: "orders",
          icon: Receipt,
          label: "Orders",
          href: `/${tenantId}/shop/orders`,
          isActive: isActive("/shop/orders"),
        },
        {
          id: "customers",
          icon: Users,
          label: "Customers",
          href: `/${tenantId}/shop/customers`,
          isActive: isActive("/shop/customers"),
        },
      ],
    },
    // Settings group - after shop with divider
    {
      items: [
        {
          id: "page-settings",
          icon: Settings,
          label: "Page Settings",
          onClick: () => setPageSettingsOpen(true),
          isActive: pageSettingsOpen,
        },
        {
          id: "global-settings",
          icon: Globe,
          label: "Global Settings",
          onClick: () => setGlobalSettingsOpen(true),
          isActive: globalSettingsOpen,
        },
      ],
    },
  ];

  // Keep bottomNav empty for now - settings moved to navGroups
  const bottomNav: NavItem[] = [];

  return (
    <TenantProvider>
      <EditorShell navGroups={navGroups} bottomNav={bottomNav}>
        {children}
      </EditorShell>

      {/* Entity Settings Drawer - Context-aware based on current route */}
      <EntitySettingsDrawer
        open={pageSettingsOpen}
        onOpenChange={setPageSettingsOpen}
      />

      {/* Global Settings Drawer - Section-wide settings */}
      <GlobalSettingsDrawer
        open={globalSettingsOpen}
        onOpenChange={setGlobalSettingsOpen}
      />
    </TenantProvider>
  );
}
