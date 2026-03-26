"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
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

interface NavSection {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

/* ── Internal nav link ─────────────────────────────────────────────────── */

function ClientNavLink({
  href,
  icon: Icon,
  title,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <SidebarMenuItem>
      <Link href={href} className="client-sidebar-link" data-active={isActive}>
        <Icon />
        <span>{title}</span>
      </Link>
    </SidebarMenuItem>
  );
}

/* ── Collapsible section ───────────────────────────────────────────────── */

function SidebarSection({
  label,
  items,
  defaultOpen = true,
}: NavSection) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SidebarGroup>
      <button
        type="button"
        className="client-sidebar-section-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronRight
          className="client-sidebar-section-chevron"
          data-open={isOpen}
        />
        <span>{label}</span>
      </button>
      {isOpen && (
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <ClientNavLink
                key={item.url}
                href={item.url}
                icon={item.icon}
                title={item.title}
              />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function ClientSidebar({ user: _user, ...props }: ClientSidebarProps) {
  const params = useParams();
  const tenantId = params?.id as string;
  const { data: _tenant } = useTenant(tenantId);
  const { openPageSettings, openGlobalSettings } = useUIStore();

  /* Section definitions */
  const sections: NavSection[] = [
    {
      label: "Content",
      defaultOpen: true,
      items: [
        { title: "Pages", url: `/${tenantId}/pages`, icon: FileText },
        { title: "Blog", url: `/${tenantId}/posts`, icon: Newspaper },
        { title: "Tags", url: `/${tenantId}/tags`, icon: Tags },
        { title: "Media", url: `/${tenantId}/media`, icon: Image },
      ],
    },
    {
      label: "Commerce",
      defaultOpen: true,
      items: [
        {
          title: "Products",
          url: `/${tenantId}/shop/products`,
          icon: Package,
        },
        { title: "Orders", url: `/${tenantId}/shop/orders`, icon: Receipt },
        {
          title: "Customers",
          url: `/${tenantId}/shop/customers`,
          icon: Users,
        },
      ],
    },
    {
      label: "Configuration",
      defaultOpen: true,
      items: [
        { title: "Headers", url: `/${tenantId}/headers`, icon: PanelTop },
        { title: "Footers", url: `/${tenantId}/footers`, icon: PanelBottom },
        { title: "Menus", url: `/${tenantId}/menus`, icon: Menu },
        { title: "Settings", url: `/${tenantId}/settings`, icon: Settings },
      ],
    },
    {
      label: "Management",
      defaultOpen: false,
      items: [
        { title: "Team", url: `/${tenantId}/team`, icon: UserCog },
      ],
    },
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
        {tenantId &&
          sections.map((section) => (
            <SidebarSection key={section.label} {...section} />
          ))}
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
