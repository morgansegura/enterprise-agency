"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Pyramid } from "lucide-react";

import "./dashboard-sidebar.css";

interface DashboardSidebarProps {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    isSuperAdmin: boolean;
  };
  onLogout: () => void;
}

/* ── Menu definitions ──────────────────────────────────────────────────── */

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const managementItems = [
  { title: "Clients", url: "/dashboard/clients", icon: Building2 },
  { title: "Users", url: "/dashboard/users", icon: Users },
];

/* ── Nav link ──────────────────────────────────────────────────────────── */

function SidebarNavLink({
  href,
  icon: Icon,
  title,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li className="dashboard-sidebar-item">
      <Link
        href={href}
        className="dashboard-sidebar-link"
        data-active={isActive}
      >
        <Icon />
        <span>{title}</span>
      </Link>
    </li>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const initials = (user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "");

  return (
    <aside className="dashboard-sidebar">
      {/* Header */}
      <div className="dashboard-sidebar-header">
        <div className="dashboard-sidebar-logo">
          <Pyramid />
        </div>
        <span className="dashboard-sidebar-name">Enterprise</span>
      </div>

      {/* Navigation */}
      <nav>
        {/* Main */}
        <div className="dashboard-sidebar-group">
          <ul>
            {mainItems.map((item) => (
              <SidebarNavLink
                key={item.url}
                href={item.url}
                icon={item.icon}
                title={item.title}
              />
            ))}
          </ul>
        </div>

        {/* Management — admin only */}
        {user.isSuperAdmin && (
          <div className="dashboard-sidebar-group">
            <div className="dashboard-sidebar-label">Management</div>
            <ul>
              {managementItems.map((item) => (
                <SidebarNavLink
                  key={item.url}
                  href={item.url}
                  icon={item.icon}
                  title={item.title}
                />
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Footer — user info */}
      <div className="dashboard-sidebar-footer">
        <div className="dashboard-sidebar-avatar">{initials}</div>
        <div className="dashboard-sidebar-user">
          <span className="dashboard-sidebar-user-name">
            {user.firstName} {user.lastName}
          </span>
          <span className="dashboard-sidebar-user-email">{user.email}</span>
        </div>
      </div>
    </aside>
  );
}
