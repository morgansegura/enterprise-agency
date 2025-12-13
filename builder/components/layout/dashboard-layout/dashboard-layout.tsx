"use client";

import { usePathname } from "next/navigation";
import {
  EditorShell,
  type NavGroup,
  type NavItem,
} from "@/components/layout/editor-shell";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Settings,
  Plus,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const navGroups: NavGroup[] = [
    {
      items: [
        {
          id: "dashboard",
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/dashboard",
          isActive: isActive("/dashboard") && !isActive("/dashboard/clients"),
        },
        {
          id: "clients",
          icon: BriefcaseBusiness,
          label: "Clients",
          href: "/dashboard/clients",
          isActive: isActive("/dashboard/clients"),
        },
      ],
    },
    {
      items: [
        {
          id: "new-client",
          icon: Plus,
          label: "New Client",
          href: "/dashboard/clients/new",
          isActive: isActive("/dashboard/clients/new"),
        },
      ],
    },
  ];

  const bottomNav: NavItem[] = [
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      onClick: () => {
        // TODO: Open settings drawer
      },
    },
  ];

  return (
    <EditorShell
      navGroups={navGroups}
      bottomNav={bottomNav}
      headerTitle="Web & Funnel"
    >
      {children}
    </EditorShell>
  );
}
