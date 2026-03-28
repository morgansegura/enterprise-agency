"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  ChevronRight,
  FileText,
  Newspaper,
  Tags,
  Image,
  Package,
  Receipt,
  Users,
  Settings,
  Palette,
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
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTenant } from "@/lib/hooks/use-tenants";

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
  const isActive = pathname === href || pathname?.startsWith(href + "/");

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

function SidebarSection({ label, items, defaultOpen = true }: NavSection) {
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
  const { data: tenant } = useTenant(tenantId);

  const tenantName = tenant?.businessName || "Project";
  const tenantInitial = tenantName.charAt(0).toUpperCase();

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
        { title: "Theme", url: `/${tenantId}/theme`, icon: Palette },
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
      {/* Project header — Jira-style project identity */}
      <SidebarHeader>
        <Link href="/clients" className="client-sidebar-project">
          <div className="client-sidebar-project-avatar">
            {tenantInitial}
          </div>
          <div className="client-sidebar-project-info">
            <span className="client-sidebar-project-name">{tenantName}</span>
            <span className="client-sidebar-project-type">CMS Project</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {tenantId &&
          sections.map((section) => (
            <SidebarSection key={section.label} {...section} />
          ))}
      </SidebarContent>

      {/* Footer — collapse toggle */}
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
