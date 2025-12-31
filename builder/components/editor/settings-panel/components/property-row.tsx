"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
  /** Show responsive indicator */
  responsive?: boolean;
  /** Help text shown below the control */
  help?: string;
  /** Stack label above control instead of inline */
  stacked?: boolean;
  className?: string;
}

/**
 * Property row with label and control.
 * Supports inline (default) or stacked layout.
 */
export function PropertyRow({
  label,
  children,
  responsive,
  help,
  stacked = false,
  className,
}: PropertyRowProps) {
  return (
    <div
      className={cn(
        "property-row",
        stacked && "property-row--stacked",
        className,
      )}
    >
      <label className="property-row-label">
        {label}
        {responsive && (
          <span className="property-row-responsive" title="Responsive" />
        )}
      </label>
      <div className="property-row-control">{children}</div>
      {help && <p className="property-row-help">{help}</p>}
    </div>
  );
}

interface PropertyGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Grid layout for related property controls.
 */
export function PropertyGrid({
  children,
  columns = 2,
  className,
}: PropertyGridProps) {
  return (
    <div
      className={cn(
        "property-grid",
        `property-grid--cols-${columns}`,
        className,
      )}
    >
      {children}
    </div>
  );
}
