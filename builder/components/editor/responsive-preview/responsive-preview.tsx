"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Breakpoint } from "../breakpoint-selector";

interface ResponsivePreviewProps {
  breakpoint: Breakpoint;
  children: React.ReactNode;
  className?: string;
}

const breakpointWidths: Record<Breakpoint, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

/**
 * Responsive Preview Wrapper
 *
 * Wraps content in a container that adjusts width based on selected breakpoint.
 * Provides a realistic preview of how content will appear on different devices.
 *
 * Features:
 * - Smooth transitions between breakpoints
 * - Centered preview for tablet/mobile
 * - Box shadow to indicate viewport boundaries
 * - Flexible height
 *
 * Usage:
 * ```tsx
 * <ResponsivePreview breakpoint={currentBreakpoint}>
 *   <PageContent />
 * </ResponsivePreview>
 * ```
 */
export function ResponsivePreview({
  breakpoint,
  children,
  className,
}: ResponsivePreviewProps) {
  const width = breakpointWidths[breakpoint];
  const isNarrow = breakpoint !== "desktop";

  return (
    <div className={cn("w-full flex justify-center", className)}>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isNarrow && "shadow-xl rounded-lg overflow-hidden border",
        )}
        style={{
          width,
          maxWidth: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
