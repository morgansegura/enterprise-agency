"use client";

import * as React from "react";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { TenantFavicon } from "@/components/providers/tenant-favicon";
import { EntitySettingsDrawer } from "@/components/settings/entity-settings-drawer";
import { GlobalSettingsDrawer } from "@/components/settings/global-settings-drawer";
import { useUIStore } from "@/lib/stores/ui-store";

export default function ClientIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    pageSettingsOpen,
    globalSettingsOpen,
    setPageSettingsOpen,
    setGlobalSettingsOpen,
  } = useUIStore();

  return (
    <TenantProvider>
      {/* Dynamic favicon based on tenant branding */}
      <TenantFavicon />

      {children}

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
