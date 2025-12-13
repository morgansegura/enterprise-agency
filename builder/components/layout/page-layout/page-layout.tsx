"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import "./page-layout.css";

export interface PageLayoutProps {
  // Header
  title: string;
  description?: string;
  icon?: LucideIcon;
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

export function PageLayout({
  title,
  description,
  icon: Icon,
  actions,
  backHref,
  backLabel = "Back",
  onBack,
  toolbar,
  children,
  maxWidth = "full",
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
      <div
        className={cn("page-layout-inner", {
          "page-layout-content-sm": maxWidth === "sm",
          "page-layout-content-md": maxWidth === "md",
          "page-layout-content-lg": maxWidth === "lg",
          "page-layout-content-xl": maxWidth === "xl",
          "page-layout-content-2xl": maxWidth === "2xl",
        })}
      >
        {/* Back Navigation */}
        {showBack && (
          <div className="page-layout-back">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          </div>
        )}

        {/* Page Header */}
        <header className="page-layout-header">
          <div className="page-layout-header-content">
            {Icon && (
              <div className="page-layout-header-icon">
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div className="page-layout-header-text">
              <h1 className="page-layout-title">{title}</h1>
              {description && (
                <p className="page-layout-description">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="page-layout-actions">{actions}</div>}
        </header>

        {/* Toolbar (optional) */}
        {toolbar && <div className="page-layout-toolbar">{toolbar}</div>}

        {/* Page Content */}
        <div className={cn("page-layout-content", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
