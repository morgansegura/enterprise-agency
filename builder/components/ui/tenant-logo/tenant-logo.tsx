"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TenantLogoProps {
  /** Raw SVG string to render */
  svg?: string;
  /** Variant type: icon (square) or logo (wide) */
  variant?: "icon" | "logo";
  /** Size preset */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Custom className */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Fallback text/element when no SVG provided */
  fallback?: React.ReactNode;
}

const sizeClasses = {
  icon: {
    xs: "h-4 w-4",
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  },
  logo: {
    xs: "h-4 w-auto max-w-[80px]",
    sm: "h-6 w-auto max-w-[120px]",
    md: "h-8 w-auto max-w-[160px]",
    lg: "h-10 w-auto max-w-[200px]",
    xl: "h-12 w-auto max-w-[240px]",
  },
};

/**
 * TenantLogo renders SVG logos/icons stored as raw SVG strings.
 *
 * Features:
 * - Renders raw SVG with proper sizing
 * - Supports icon (square) and logo (wide) variants
 * - Inherits text color via currentColor
 * - Accessible with role and aria-label
 * - Fallback when no SVG provided
 */
export function TenantLogo({
  svg,
  variant = "icon",
  size = "md",
  className,
  alt = "Logo",
  fallback,
}: TenantLogoProps) {
  if (!svg) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        "[&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full",
        sizeClasses[variant][size],
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
