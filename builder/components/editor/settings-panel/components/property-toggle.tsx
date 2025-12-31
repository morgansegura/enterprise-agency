"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface PropertyToggleProps {
  value: string;
  options: ToggleOption[];
  onChange: (value: string) => void;
  /** Use icons instead of labels */
  iconOnly?: boolean;
  /** Allow full width distribution */
  fullWidth?: boolean;
  className?: string;
}

/**
 * Webflow-style toggle button group.
 * Used for mutually exclusive options like width, alignment, etc.
 */
export function PropertyToggle({
  value,
  options,
  onChange,
  iconOnly = false,
  fullWidth = false,
  className,
}: PropertyToggleProps) {
  return (
    <div
      className={cn(
        "property-toggle",
        fullWidth && "property-toggle--full",
        className,
      )}
      role="radiogroup"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          className={cn(
            "property-toggle-btn",
            value === option.value && "property-toggle-btn--active",
          )}
          onClick={() => onChange(option.value)}
          title={iconOnly ? option.label : undefined}
        >
          {option.icon && (
            <span className="property-toggle-icon">{option.icon}</span>
          )}
          {!iconOnly && (
            <span className="property-toggle-label">{option.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
