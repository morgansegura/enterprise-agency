"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertySectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Collapsible property section - Webflow-style.
 */
export function PropertySection({
  title,
  defaultOpen = true,
  children,
  className,
}: PropertySectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        "property-section",
        isOpen && "property-section--open",
        className,
      )}
    >
      <button
        type="button"
        className="property-section-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <ChevronDown
          className={cn(
            "property-section-chevron",
            !isOpen && "property-section-chevron--closed",
          )}
        />
        <span className="property-section-title">{title}</span>
      </button>

      <div
        className={cn(
          "property-section-content",
          isOpen
            ? "property-section-content--open"
            : "property-section-content--closed",
        )}
      >
        <div className="property-section-inner">{children}</div>
      </div>
    </div>
  );
}
