"use client";

import * as React from "react";
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

export function BreakpointSelector({
  value,
  onChange,
}: BreakpointSelectorProps) {
  return (
    <div className="flex items-center p-0.5 rounded-[3px] bg-[var(--el-100)] gap-0.5">
      {breakpoints.map((breakpoint) => {
        const Icon = breakpoint.icon;
        const isActive = value === breakpoint.value;

        return (
          <button
            key={breakpoint.value}
            type="button"
            onClick={() => onChange(breakpoint.value)}
            className={cn(
              "flex items-center justify-center size-7 rounded-[3px] transition-colors duration-100 cursor-pointer",
              isActive
                ? "bg-[var(--el-0)] text-[var(--el-800)] shadow-sm"
                : "text-[var(--el-400)] hover:text-[var(--el-800)]",
            )}
            title={`${breakpoint.label} (${breakpoint.width})`}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
    </div>
  );
}

export function getBreakpointWidth(breakpoint: Breakpoint): string {
  const bp = breakpoints.find((b) => b.value === breakpoint);
  return bp?.width || "100%";
}
