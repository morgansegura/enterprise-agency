"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Newspaper,
  Tags,
  Image,
  Package,
  Receipt,
  Users,
  Settings,
  Globe,
  PanelTop,
  PanelBottom,
  Menu,
  UserCog,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTenant } from "@/lib/hooks/use-tenants";
import { useUIStore } from "@/lib/stores/ui-store";

import "./client-sidebar.css";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface ClientSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
  };
}

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

/* ── Internal nav link ─────────────────────────────────────────────────── */

function ClientNavLink({ href, icon: Icon, title }: { href: string; icon: React.ComponentType<{ className?: string }>; title: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuItem>
      <Link href={href} className="client-sidebar-link" data-active={isActive}>
        <Icon />
        <span>{title}</span>
      </Link>
    </SidebarMenuItem>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function ClientSidebar({ user: _user, ...props }: ClientSidebarProps) {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: _tenant } = useTenant(tenantId);
  const { openPageSettings, openGlobalSettings } = useUIStore();

  /* Menu definitions */

  const contentItems: NavItem[] = [
    { title: "Pages", url: `/${tenantId}/pages`, icon: FileText },
    { title: "Blog", url: `/${tenantId}/posts`, icon: Newspaper },
    { title: "Tags", url: `/${tenantId}/tags`, icon: Tags },
    { title: "Media", url: `/${tenantId}/media`, icon: Image },
  ];

  const commerceItems: NavItem[] = [
    { title: "Products", url: `/${tenantId}/shop/products`, icon: Package },
    { title: "Orders", url: `/${tenantId}/shop/orders`, icon: Receipt },
    { title: "Customers", url: `/${tenantId}/shop/customers`, icon: Users },
  ];

  const configurationItems: NavItem[] = [
    { title: "Headers", url: `/${tenantId}/headers`, icon: PanelTop },
    { title: "Footers", url: `/${tenantId}/footers`, icon: PanelBottom },
    { title: "Menus", url: `/${tenantId}/menus`, icon: Menu },
    { title: "Settings", url: `/${tenantId}/settings`, icon: Settings },
  ];

  const managementItems: NavItem[] = [
    { title: "Team", url: `/${tenantId}/team`, icon: UserCog },
  ];

  return (
    <Sidebar collapsible="icon" className="client-sidebar" {...props}>
      {/* Back to dashboard */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="client-sidebar-back">
              <ArrowLeft />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Content */}
        {tenantId && (
          <>
            <SidebarGroup>
              <div className="client-sidebar-label">Content</div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {contentItems.map((item) => (
                    <ClientNavLink
                      key={item.url}
                      href={item.url}
                      icon={item.icon}
                      title={item.title}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Commerce */}
            <SidebarGroup>
              <div className="client-sidebar-label">Commerce</div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {commerceItems.map((item) => (
                    <ClientNavLink
                      key={item.url}
                      href={item.url}
                      icon={item.icon}
                      title={item.title}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Configuration */}
            <SidebarGroup>
              <div className="client-sidebar-label">Configuration</div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {configurationItems.map((item) => (
                    <ClientNavLink
                      key={item.url}
                      href={item.url}
                      icon={item.icon}
                      title={item.title}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Management */}
            <SidebarGroup>
              <div className="client-sidebar-label">Management</div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {managementItems.map((item) => (
                    <ClientNavLink
                      key={item.url}
                      href={item.url}
                      icon={item.icon}
                      title={item.title}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer — editor actions + collapse trigger */}
      <SidebarFooter>
        <SidebarGroup>
          <div className="client-sidebar-label">Editor</div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <button
                  type="button"
                  className="client-sidebar-action"
                  onClick={openPageSettings}
                >
                  <Settings />
                  <span>Page Settings</span>
                </button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <button
                  type="button"
                  className="client-sidebar-action"
                  onClick={openGlobalSettings}
                >
                  <Globe />
                  <span>Global Settings</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
