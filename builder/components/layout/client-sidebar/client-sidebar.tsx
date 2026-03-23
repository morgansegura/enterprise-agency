"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  Newspaper,
  Image,
  Package,
  Receipt,
  Users,
  Settings,
  Globe,
  PanelsTopLeft,
  GlobeLock,
  Tags,
  Store,
  UserCog,
  Building2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/ui/nav-link";
import { useTenant } from "@/lib/hooks/use-tenants";
import { useUIStore } from "@/lib/stores/ui-store";

import "./client-sidebar.css";

interface ClientSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
  };
}

export function ClientSidebar({ user, ...props }: ClientSidebarProps) {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: tenant } = useTenant(tenantId);
  const { openPageSettings, openGlobalSettings } = useUIStore();

  // Determine if user is agency staff or client user
  // Agency staff see "Client's X" labels, client users see "My X" labels
  const isAgencyUser = user.isSuperAdmin;

  // Check if sub-clients feature is enabled for this tenant
  const hasSubClientsFeature =
    tenant?.enabledFeatures?.["subclients.enabled"] ||
    (tenant?._count?.children && tenant._count.children > 0);

  // Context-aware labels
  const labels = {
    managementSection: isAgencyUser ? "Client" : "Manage",
    clients: isAgencyUser ? "Client's Clients" : "My Clients",
    team: isAgencyUser ? "Client Team" : "My Team",
    settings: isAgencyUser ? "Client Settings" : "Settings",
  };

  const contentMenuItems = [
    {
      title: "Pages",
      url: `/${tenantId}/pages`,
      icon: FileText,
    },
    {
      title: "Blog",
      url: `/${tenantId}/posts`,
      icon: Newspaper,
    },
    {
      title: "Tags",
      url: `/${tenantId}/tags`,
      icon: Tags,
    },
    {
      title: "Media",
      url: `/${tenantId}/media`,
      icon: Image,
    },
  ];

  const shopMenuItems = [
    {
      title: "Shop",
      url: `/${tenantId}/shop`,
      icon: Store,
    },
    {
      title: "Products",
      url: `/${tenantId}/shop/products`,
      icon: Package,
    },
    {
      title: "Orders",
      url: `/${tenantId}/shop/orders`,
      icon: Receipt,
    },
    {
      title: "Customers",
      url: `/${tenantId}/shop/customers`,
      icon: Users,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        {/* Admin Section - always visible for super admins */}
        {user.isSuperAdmin && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavLink
                    href="/clients"
                    icon={<PanelsTopLeft />}
                    title="Manage Clients"
                  />
                  <NavLink
                    href="/users"
                    icon={<GlobeLock />}
                    title="Manage Users"
                  />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {tenantId && <SidebarSeparator />}
          </>
        )}

        {/* Content Section - only when inside a client workspace */}
        {tenantId && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Content</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {contentMenuItems.map((item) => (
                    <NavLink
                      key={item.url}
                      href={item.url}
                      icon={<item.icon />}
                      title={item.title}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Shop Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Shop</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {shopMenuItems.map((item) => (
                    <NavLink
                      key={item.url}
                      href={item.url}
                      icon={<item.icon />}
                      title={item.title}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Client/Manage Section */}
            <SidebarGroup>
              <SidebarGroupLabel>{labels.managementSection}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Only show sub-clients if feature is enabled */}
                  {hasSubClientsFeature && (
                    <NavLink
                      href={`/${tenantId}/clients`}
                      icon={<Building2 />}
                      title={labels.clients}
                    />
                  )}
                  <NavLink
                    href={`/${tenantId}/team`}
                    icon={<UserCog />}
                    title={labels.team}
                  />
                  <NavLink
                    href={`/${tenantId}/settings`}
                    icon={<Settings />}
                    title={labels.settings}
                  />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />

        {/* Page Settings Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Editor</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={openPageSettings}
                  tooltip="Page Settings"
                >
                  <Settings className="size-4" />
                  <span>Page Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={openGlobalSettings}
                  tooltip="Global Settings"
                >
                  <Globe className="size-4" />
                  <span>Global Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarTrigger className="client-layout-header-trigger" />
      </SidebarFooter>
    </Sidebar>
  );
}
