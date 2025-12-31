"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertySectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Collapsible property section with Webflow-style header.
 * Uses CSS animations for smooth expand/collapse.
 */
export function PropertySection({
  title,
  icon,
  defaultOpen = true,
  children,
  className,
}: PropertySectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={cn("property-section", className)}>
      <button
        type="button"
        className="property-section-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <ChevronRight
          className={cn(
            "property-section-chevron",
            isOpen && "property-section-chevron--open",
          )}
        />
        {icon && <span className="property-section-icon">{icon}</span>}
        <span className="property-section-title">{title}</span>
      </button>

      <div
        ref={contentRef}
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
