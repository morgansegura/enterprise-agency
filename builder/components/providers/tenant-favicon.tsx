"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTenant } from "@/lib/hooks/use-tenants";

/**
 * Component that dynamically sets the favicon based on tenant's iconUrl.
 * Uses the icon uploaded in Settings > Branding as the favicon.
 */
export function TenantFavicon() {
  const params = useParams();
  const tenantId = params?.id as string | undefined;
  const { data: tenant } = useTenant(tenantId || "");

  useEffect(() => {
    if (!tenantId) return;

    const tenantWithIcon = tenant as { iconUrl?: string } | undefined;
    const iconUrl = tenantWithIcon?.iconUrl;

    // Update or create favicon link elements
    const updateFavicon = (iconHref: string | null) => {
      // Find existing favicon links or create new ones
      let linkIcon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement | null;
      let linkShortcut = document.querySelector(
        'link[rel="shortcut icon"]'
      ) as HTMLLinkElement | null;
      let linkAppleTouch = document.querySelector(
        'link[rel="apple-touch-icon"]'
      ) as HTMLLinkElement | null;

      if (iconHref) {
        // Create or update main icon
        if (!linkIcon) {
          linkIcon = document.createElement("link");
          linkIcon.rel = "icon";
          document.head.appendChild(linkIcon);
        }
        linkIcon.href = iconHref;
        linkIcon.type = iconHref.endsWith(".svg")
          ? "image/svg+xml"
          : "image/png";

        // Create or update shortcut icon
        if (!linkShortcut) {
          linkShortcut = document.createElement("link");
          linkShortcut.rel = "shortcut icon";
          document.head.appendChild(linkShortcut);
        }
        linkShortcut.href = iconHref;

        // Create or update apple touch icon
        if (!linkAppleTouch) {
          linkAppleTouch = document.createElement("link");
          linkAppleTouch.rel = "apple-touch-icon";
          document.head.appendChild(linkAppleTouch);
        }
        linkAppleTouch.href = iconHref;
      } else {
        // Reset to default favicon
        if (linkIcon) {
          linkIcon.href = "/favicon.ico";
          linkIcon.type = "image/x-icon";
        }
        if (linkShortcut) {
          linkShortcut.href = "/favicon.ico";
        }
        if (linkAppleTouch) {
          linkAppleTouch.href = "/apple-touch-icon.png";
        }
      }
    };

    updateFavicon(iconUrl || null);

    // Cleanup: reset to default when leaving tenant context
    return () => {
      updateFavicon(null);
    };
  }, [tenantId, tenant]);

  // This component doesn't render anything
  return null;
}
