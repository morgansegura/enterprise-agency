"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Pyramid,
  FileText,
  Newspaper,
  Image,
  Package,
  Receipt,
  Users,
  Settings,
  ArrowLeft,
  PanelsTopLeft,
  GlobeLock,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/ui/nav-link";
import { useTenant } from "@/lib/hooks/use-tenants";

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

  const mainMenuItems = [
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
      title: "Media",
      url: `/${tenantId}/media`,
      icon: Image,
    },
  ];

  const shopMenuItems = [
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
    {
      title: "Settings",
      url: `/${tenantId}/shop/settings`,
      icon: Settings,
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href={`/${tenantId}`}>
                <div className="client-sidebar-logo">
                  <Pyramid />
                </div>
                <div className="client-sidebar-header-text">
                  <span className="client-sidebar-title">
                    {tenant?.businessName || "Loading..."}
                  </span>
                  <span className="client-sidebar-subtitle">
                    {tenant?.tier === "BUILDER" ? "Builder" : "Content Editor"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {user.isSuperAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink
                  href="/dashboard/clients"
                  icon={<PanelsTopLeft />}
                  title="Manage Clients"
                />
                <NavLink
                  href="/dashboard/users"
                  icon={<GlobeLock />}
                  title="Manage Users"
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
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
      </SidebarContent>

      <SidebarFooter>
        {!user.isSuperAdmin && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard" className="client-sidebar-back">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
