"use client";

import * as React from "react";
import { TenantProvider } from "@/components/providers/tenant-provider";
import { TenantFavicon } from "@/components/providers/tenant-favicon";
import { ClientLayout } from "@/components/layout/client-layout";
import { PreviewModeProvider } from "@/lib/context/preview-mode-context";
import { EntitySettingsDrawer } from "@/components/settings/entity-settings-drawer";
import { GlobalSettingsDrawer } from "@/components/settings/global-settings-drawer";
import { useUIStore } from "@/lib/stores/ui-store";

export default function WorkspaceLayout({
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
      <PreviewModeProvider>
        <TenantFavicon />
        <ClientLayout>
          {children}
        </ClientLayout>

        <EntitySettingsDrawer
          open={pageSettingsOpen}
          onOpenChange={setPageSettingsOpen}
        />
        <GlobalSettingsDrawer
          open={globalSettingsOpen}
          onOpenChange={setGlobalSettingsOpen}
        />
      </PreviewModeProvider>
    </TenantProvider>
  );
}
