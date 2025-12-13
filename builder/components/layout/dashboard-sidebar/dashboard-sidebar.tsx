"use client";

import * as React from "react";
import {
  Pyramid,
  CircleGaugeIcon,
  PanelsTopLeftIcon,
  GlobeLockIcon,
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/ui/nav-link";
import { TenantSwitcher } from "@/components/layout/tenant-switcher";

import "./dashboard-sidebar.css";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
  };
  onLogout: () => void;
}

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: CircleGaugeIcon,
  },
];

const adminMenuItems = [
  {
    title: "Manage Clients",
    url: "/dashboard/clients",
    icon: PanelsTopLeftIcon,
  },
  {
    title: "Manage Users",
    url: "/dashboard/users",
    icon: GlobeLockIcon,
  },
];

export function DashboardSidebar({
  user,
  onLogout,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="sidebar-header-icon">
                  <Pyramid />
                </div>
                <div className="sidebar-header-text">
                  <span className="sidebar-header-title">Web & Funnel</span>
                  <span className="sidebar-header-subtitle">Builder</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Tenant Switcher */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <TenantSwitcher />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
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

        {user.isSuperAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
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
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="sidebar-footer-user">
              <span className="sidebar-footer-user-name">
                {user.firstName} {user.lastName}
              </span>
              <span className="sidebar-footer-user-email">{user.email}</span>
              {user.isSuperAdmin && (
                <span className="sidebar-footer-user-badge">Super Admin</span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
