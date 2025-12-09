"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useResponsiveContext,
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";
import {
  hasResponsiveOverride,
  removeResponsiveOverride,
} from "@/lib/responsive";
import { cn } from "@/lib/utils";
import type { Breakpoint } from "./breakpoint-selector";

interface ResponsiveFieldProps {
  /** The field name in block data */
  fieldName: string;
  /** The block data object */
  data: Record<string, unknown>;
  /** Called when data changes */
  onChange: (data: Record<string, unknown>) => void;
  /** The label to show */
  label: string;
  /** The form field component */
  children: React.ReactNode;
  /** Additional class name */
  className?: string;
}

const breakpointIcons: Record<
  Breakpoint,
  React.ComponentType<{ className?: string }>
> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

const breakpointLabels: Record<Breakpoint, string> = {
  desktop: "Desktop (base)",
  tablet: "Tablet override",
  mobile: "Mobile override",
};

/**
 * ResponsiveField
 *
 * Wraps form fields to show responsive override indicators and controls.
 * Builder-tier only: Content editors see the field without override options.
 *
 * Features:
 * - Shows current breakpoint indicator
 * - Highlights fields with overrides
 * - Allows clearing overrides
 * - Tooltip showing which breakpoints have overrides
 */
export function ResponsiveField({
  fieldName,
  data,
  onChange,
  label,
  children,
  className,
}: ResponsiveFieldProps) {
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  const hasTabletOverride = hasResponsiveOverride(data, "tablet", fieldName);
  const hasMobileOverride = hasResponsiveOverride(data, "mobile", fieldName);
  const hasCurrentOverride = hasResponsiveOverride(data, breakpoint, fieldName);

  const handleClearOverride = () => {
    onChange(removeResponsiveOverride(data, breakpoint, fieldName));
  };

  // If not builder tier, just render the field normally
  if (!canSetOverrides) {
    return (
      <div className={className}>
        <label className="text-sm font-medium">{label}</label>
        {children}
      </div>
    );
  }

  const BreakpointIcon = breakpointIcons[breakpoint];

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium">{label}</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                {/* Breakpoint indicators */}
                <div className="flex items-center gap-0.5">
                  <Monitor
                    className={cn(
                      "h-3 w-3",
                      breakpoint === "desktop"
                        ? "text-primary"
                        : "text-muted-foreground/40",
                    )}
                  />
                  <Tablet
                    className={cn(
                      "h-3 w-3",
                      hasTabletOverride
                        ? "text-blue-500"
                        : breakpoint === "tablet"
                          ? "text-primary"
                          : "text-muted-foreground/40",
                    )}
                  />
                  <Smartphone
                    className={cn(
                      "h-3 w-3",
                      hasMobileOverride
                        ? "text-blue-500"
                        : breakpoint === "mobile"
                          ? "text-primary"
                          : "text-muted-foreground/40",
                    )}
                  />
                </div>

                {/* Clear override button */}
                {hasCurrentOverride && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1"
                    onClick={handleClearOverride}
                    title={`Clear ${breakpoint} override`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              <div className="space-y-1">
                <div className="font-medium">Responsive overrides</div>
                <div className="flex items-center gap-2">
                  <Monitor className="h-3 w-3" />
                  <span>Desktop (base value)</span>
                </div>
                {hasTabletOverride && (
                  <div className="flex items-center gap-2 text-blue-500">
                    <Tablet className="h-3 w-3" />
                    <span>Tablet override set</span>
                  </div>
                )}
                {hasMobileOverride && (
                  <div className="flex items-center gap-2 text-blue-500">
                    <Smartphone className="h-3 w-3" />
                    <span>Mobile override set</span>
                  </div>
                )}
                {!hasTabletOverride && !hasMobileOverride && (
                  <div className="text-muted-foreground">
                    No overrides set. Change the value while viewing tablet or
                    mobile to create an override.
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Field with override indicator border */}
      <div
        className={cn(
          "relative",
          hasCurrentOverride && "ring-2 ring-blue-500/50 rounded-md",
        )}
      >
        {children}
      </div>

      {/* Override indicator badge */}
      {hasCurrentOverride && (
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
          {breakpoint}
        </div>
      )}
    </div>
  );
}

/**
 * Hook to create a responsive onChange handler
 *
 * Usage:
 * ```tsx
 * const handleChange = useResponsiveChange(data, onChange);
 *
 * <Input
 *   value={getResponsiveValue(data, "size", breakpoint)}
 *   onChange={(e) => handleChange("size", e.target.value)}
 * />
 * ```
 */
export function useResponsiveChange(
  data: Record<string, unknown>,
  onChange: (data: Record<string, unknown>) => void,
) {
  const breakpoint = useCurrentBreakpoint();

  return React.useCallback(
    (field: string, value: unknown) => {
      // Import inline to avoid circular dependency
      const { setResponsiveOverride } = require("@/lib/responsive");
      onChange(setResponsiveOverride(data, breakpoint, field, value));
    },
    [data, onChange, breakpoint],
  );
}
