'use client'

import * as React from 'react'
import {
  Building2,
  LayoutDashboard,
  Globe,
  FileText,
  Image,
  Users,
  Settings,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavLink } from '../../ui/nav-link'

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    email: string
    firstName: string
    lastName: string
    isSuperAdmin: boolean
  }
  onLogout: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Clients',
    url: '/dashboard/tenants',
    icon: Globe,
  },
  {
    title: 'Pages',
    url: '/dashboard/pages',
    icon: FileText,
  },
  {
    title: 'Assets',
    url: '/dashboard/assets',
    icon: Image,
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
]

export function DashboardSidebar({ user, onLogout, ...props }: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Web & Funnel</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="grid flex-1 text-left text-sm leading-tight px-2 py-1.5">
              <span className="truncate font-semibold">
                {user.firstName} {user.lastName}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {user.email}
              </span>
              {user.isSuperAdmin && (
                <span className="inline-block px-2 py-0.5 mt-1 text-xs font-medium rounded bg-sidebar-accent text-sidebar-accent-foreground w-fit">
                  Super Admin
                </span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
