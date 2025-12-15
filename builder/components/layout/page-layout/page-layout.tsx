"use client";

import * as React from "react";
import { LayoutHeading } from "@/components/layout/layout-heading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

import "./page-layout.css";

// =============================================================================
// Types
// =============================================================================

export interface PageLayoutProps {
  /** Page title */
  title: string;
  /** Optional description below title */
  description?: string;
  /** Action buttons in header */
  actions?: React.ReactNode;

  /** Back button - renders arrow button that goes back */
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;

  /** Toolbar below header (filters, search, tabs, etc.) */
  toolbar?: React.ReactNode;

  /** Main content */
  children: React.ReactNode;

  /** Content max-width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /** Additional classes */
  className?: string;
  contentClassName?: string;

  /** Remove default padding (for custom layouts) */
  noPadding?: boolean;
}

// =============================================================================
// Component
// =============================================================================

const maxWidthClasses = {
  sm: "page-layout-content-sm",
  md: "page-layout-content-md",
  lg: "page-layout-content-lg",
  xl: "page-layout-content-xl",
  "2xl": "page-layout-content-2xl",
  full: "",
};

export function PageLayout({
  title,
  description,
  actions,
  backHref,
  backLabel,
  onBack,
  toolbar,
  children,
  maxWidth,
  className,
  contentClassName,
  noPadding = false,
}: PageLayoutProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      window.location.href = backHref;
    }
  };

  const showBack = backHref || onBack;

  const backButton = showBack ? (
    <Button variant="outline" size="sm" onClick={handleBack}>
      <ArrowLeft />
      {backLabel}
    </Button>
  ) : undefined;

  return (
    <div
      className={cn(
        "page-layout",
        noPadding && "page-layout-no-padding",
        className,
      )}
    >
      {/* Header */}
      <div className="page-layout-header">
        <LayoutHeading
          title={title}
          description={description}
          actions={actions}
          back={backButton}
        />
      </div>

      {/* Toolbar (optional) */}
      {toolbar && <div className="page-layout-toolbar">{toolbar}</div>}

      {/* Content */}
      <div
        className={cn(
          "page-layout-content scrollbar-y",
          maxWidth && maxWidthClasses[maxWidth],
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
