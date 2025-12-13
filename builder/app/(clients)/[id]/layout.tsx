"use client";

import * as React from "react";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EntitySettingsDrawer } from "@/components/settings/entity-settings-drawer";
import { GlobalSettingsDrawer } from "@/components/settings/global-settings-drawer";

import { cn } from "@/lib/utils";

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

  const clientUrl =
    process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:4002";

  const isActive = (path: string) => {
    if (!pathname) return false;
    return pathname.startsWith(`/${tenantId}${path}`);
  };

  return (
    <TenantProvider>
      <div className="grid grid-cols-[48px_1fr] h-full">
        {/* Icon Toolbar */}
        <aside className="relative bg-(--sidebar) w-12 border-r flex flex-col top-0 bottom-0 items-center space-y-2 py-4 text-muted-foreground">
          {/* Navigation Section */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/dashboard/clients") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/dashboard/clients`}>
                  <BriefcaseBusiness />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Manage Clients</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/dashboard/users") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/dashboard/users`}>
                  <GlobeLock />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Manage Users</TooltipContent>
          </Tooltip>

          <Separator className="my-2 w-8" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/pages") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/pages`}>
                  <PanelsTopLeft />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Website Editor</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/media") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/media`}>
                  <Image />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Media Library</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/posts") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/posts`}>
                  <Newspaper />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Blog Editor</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/tags") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/tags`}>
                  <Tags />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Tag Editor</TooltipContent>
          </Tooltip>

          <Separator className="my-2 w-8" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/shop") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/shop`}>
                  <Store />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Shop Editor</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/shop/products") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/shop/products`}>
                  <Package />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Products</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/shop/orders") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/shop/orders`}>
                  <Receipt />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Orders</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(
                  isActive("/shop/customers") &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Link href={`/${tenantId}/shop/customers`}>
                  <Users />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Customers</TooltipContent>
          </Tooltip>

          <Separator className="my-2 w-8" />

          {/* Utility Section */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setPageSettingsOpen(true)}
                className={cn(
                  pageSettingsOpen &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Page Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setGlobalSettingsOpen(true)}
                className={cn(
                  globalSettingsOpen &&
                    "bg-(--accent) text-(--accent-foreground)",
                )}
              >
                <Globe />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Global Settings</TooltipContent>
          </Tooltip>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

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
