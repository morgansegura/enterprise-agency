"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTenant } from "@/lib/hooks/use-tenants";
import { applyFavicon } from "@/lib/utils/svg-to-favicon";

interface TenantBranding {
  iconSvg?: string; // Raw SVG string (preferred)
  iconUrl?: string; // Legacy URL-based approach
}

/**
 * Component that dynamically sets the favicon based on tenant's branding.
 *
 * Priority:
 * 1. iconSvg - Raw SVG string (renders directly as favicon)
 * 2. iconUrl - Legacy URL-based approach (for backwards compatibility)
 * 3. Default favicon
 */
export function TenantFavicon() {
  const params = useParams();
  const tenantId = params?.id as string | undefined;
  const { data: tenant } = useTenant(tenantId || "");

  useEffect(() => {
    if (!tenantId) return;

    const tenantBranding = tenant as TenantBranding | undefined;
    const iconSvg = tenantBranding?.iconSvg;
    const iconUrl = tenantBranding?.iconUrl;

    // Cleanup function to reset favicons
    const resetToDefault = () => {
      const linkIcon = document.querySelector(
        'link[rel="icon"]',
      ) as HTMLLinkElement | null;
      const linkShortcut = document.querySelector(
        'link[rel="shortcut icon"]',
      ) as HTMLLinkElement | null;
      const linkAppleTouch = document.querySelector(
        'link[rel="apple-touch-icon"]',
      ) as HTMLLinkElement | null;

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
    };

    // Priority 1: Use raw SVG if available
    if (iconSvg) {
      applyFavicon(iconSvg);
      return () => resetToDefault();
    }

    // Priority 2: Use URL-based icon (legacy)
    if (iconUrl) {
      updateFaviconFromUrl(iconUrl);
      return () => resetToDefault();
    }

    // No icon set, use defaults
    return;
  }, [tenantId, tenant]);

  // This component doesn't render anything
  return null;
}

/**
 * Legacy function to update favicon from URL
 */
function updateFaviconFromUrl(iconHref: string) {
  let linkIcon = document.querySelector(
    'link[rel="icon"]',
  ) as HTMLLinkElement | null;
  let linkShortcut = document.querySelector(
    'link[rel="shortcut icon"]',
  ) as HTMLLinkElement | null;
  let linkAppleTouch = document.querySelector(
    'link[rel="apple-touch-icon"]',
  ) as HTMLLinkElement | null;

  // Create or update main icon
  if (!linkIcon) {
    linkIcon = document.createElement("link");
    linkIcon.rel = "icon";
    document.head.appendChild(linkIcon);
  }
  linkIcon.href = iconHref;
  linkIcon.type = iconHref.endsWith(".svg") ? "image/svg+xml" : "image/png";

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
}
