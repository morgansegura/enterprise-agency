"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useTenantTokens } from "@/lib/hooks/use-tenant-tokens";

// Semantic color keys to CSS variable mapping
const semanticToCssVar: Record<string, string> = {
  primary: "--theme-primary",
  primaryForeground: "--theme-primary-foreground",
  secondary: "--theme-secondary",
  secondaryForeground: "--theme-secondary-foreground",
  accent: "--theme-accent",
  accentForeground: "--theme-accent-foreground",
  background: "--theme-background",
  foreground: "--theme-foreground",
  card: "--theme-card",
  cardForeground: "--theme-card-foreground",
  popover: "--theme-popover",
  popoverForeground: "--theme-popover-foreground",
  muted: "--theme-muted",
  mutedForeground: "--theme-muted-foreground",
  border: "--theme-border",
  input: "--theme-input",
  ring: "--theme-ring",
  destructive: "--theme-destructive",
};

/**
 * Apply design tokens to the DOM
 * Sets --theme-* CSS variables for the design preview
 */
function applyTokensToDOM(tokens: Record<string, unknown>) {
  const root = document.documentElement;

  // Apply semantic colors
  const semantic = tokens.semantic as Record<string, string> | undefined;
  if (semantic) {
    for (const [key, cssVar] of Object.entries(semanticToCssVar)) {
      const value = semantic[key];
      if (value) {
        root.style.setProperty(cssVar, value);
      }
    }
  }

  // Apply color scales
  const colors = tokens.colors as Record<
    string,
    Record<string, string>
  > | undefined;
  if (colors) {
    for (const [colorName, scale] of Object.entries(colors)) {
      if (scale && typeof scale === "object") {
        for (const [shade, value] of Object.entries(scale)) {
          root.style.setProperty(`--color-${colorName}-${shade}`, value);
        }
      }
    }
  }

  // Apply border radius
  const borderRadius = tokens.borderRadius as Record<string, string> | undefined;
  if (borderRadius) {
    for (const [key, value] of Object.entries(borderRadius)) {
      root.style.setProperty(`--radius-${key}`, value);
    }
  }
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const tenantId = params?.id as string;

  // Fetch tenant tokens
  const { data: tokens } = useTenantTokens(tenantId);

  // Set tenant ID for API client
  useEffect(() => {
    if (tenantId) {
      apiClient.setTenantId(tenantId);
    }

    return () => {
      apiClient.clearTenantId();
    };
  }, [tenantId]);

  // Apply tokens to DOM when they load
  useEffect(() => {
    if (tokens && Object.keys(tokens).length > 0) {
      applyTokensToDOM(tokens as Record<string, unknown>);
    }
  }, [tokens]);

  return <>{children}</>;
}
