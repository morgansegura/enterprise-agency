"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const tenantId = params?.id as string;

  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:4002";

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
                className={cn(isActive("/pages") && "bg-(--accent) text-(--accent-foreground)")}
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
                className={cn(isActive("/posts") && "bg-(--accent) text-(--accent-foreground)")}
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
                className={cn(isActive("/shop") && "bg-(--accent) text-(--accent-foreground)")}
              >
                <Link href={`/${tenantId}/shop`}>
                  <Store />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Shop Editor</TooltipContent>
          </Tooltip>

          <Separator className="my-2 w-8" />

          {/* Utility Section */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                asChild
                className={cn(isActive("/media") && "bg-(--accent) text-(--accent-foreground)")}
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
                className={cn(isActive("/settings") && "bg-(--accent) text-(--accent-foreground)")}
              >
                <Link href={`/${tenantId}/settings`}>
                  <Settings />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" asChild>
                <a
                  href={`${clientUrl}/${tenantId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Preview Site</TooltipContent>
          </Tooltip>
        </aside>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </TenantProvider>
  );
}
