"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type Breakpoint = "desktop" | "tablet" | "mobile";

interface BreakpointSelectorProps {
  value: Breakpoint;
  onChange: (breakpoint: Breakpoint) => void;
}

const breakpoints = [
  {
    value: "desktop" as const,
    label: "Desktop",
    icon: Monitor,
    width: "100%",
  },
  {
    value: "tablet" as const,
    label: "Tablet",
    icon: Tablet,
    width: "768px",
  },
  {
    value: "mobile" as const,
    label: "Mobile",
    icon: Smartphone,
    width: "375px",
  },
];

/**
 * Breakpoint Selector
 *
 * Allows switching between different viewport sizes for responsive preview.
 *
 * Features:
 * - Desktop, tablet, and mobile breakpoints
 * - Visual icons for each breakpoint
 * - Active state indication
 * - Keyboard accessible
 *
 * Usage:
 * ```tsx
 * const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
 *
 * <BreakpointSelector
 *   value={breakpoint}
 *   onChange={setBreakpoint}
 * />
 * ```
 */
export function BreakpointSelector({
  value,
  onChange,
}: BreakpointSelectorProps) {
  return (
    <div className="flex items-center gap-1 border bg-(--border)/50 rounded-sm">
      {breakpoints.map((breakpoint) => {
        const Icon = breakpoint.icon;
        const isActive = value === breakpoint.value;

        return (
          <Button
            key={breakpoint.value}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange(breakpoint.value)}
            className={cn(
              "gap-2 rounded-sm",
              !isActive && "hover:bg-background",
            )}
            title={`${breakpoint.label} (${breakpoint.width})`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{breakpoint.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Get viewport width for breakpoint
 */
export function getBreakpointWidth(breakpoint: Breakpoint): string {
  const bp = breakpoints.find((b) => b.value === breakpoint);
  return bp?.width || "100%";
}
