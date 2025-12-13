"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

import "./page-layout.css";

export interface PageLayoutProps {
  // Header
  title: string;
  description?: string;
  actions?: React.ReactNode;

  // Back navigation
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;

  // Toolbar (optional - for filters, search, etc.)
  toolbar?: React.ReactNode;

  // Content
  children: React.ReactNode;

  // Layout options
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  contentClassName?: string;
}

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
  backLabel = "Back",
  onBack,
  toolbar,
  children,
  maxWidth,
  className,
  contentClassName,
}: PageLayoutProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      window.location.href = backHref;
    }
  };

  const showBack = backHref || onBack;

  return (
    <div className={cn("page-layout", className)}>
      <div className={cn("page-layout-inner")}>
        {/* Page Title Row */}
        <div className="page-layout-title-row">
          {/* Back Navigation */}
          {showBack ? (
            <div className="page-layout-back">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            </div>
          ) : null}

          <div className="page-layout-title-content">
            <h1 className="page-layout-title">{title}</h1>
            {description && (
              <p className="page-layout-description">{description}</p>
            )}
          </div>
          {actions && <div className="page-layout-actions">{actions}</div>}
        </div>
      </div>

      <div className="page-layout-inner">
        {/* Toolbar (optional) */}
        {toolbar ? <div className="page-layout-toolbar">{toolbar}</div> : null}

        {/* Page Content */}
        <div
          className={cn(
            "page-layout-content",
            maxWidth && maxWidthClasses[maxWidth],
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
