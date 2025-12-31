"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import "./settings-drawer.css";

// Navigation item type
export interface SettingsNavItem<T extends string = string> {
  id: T;
  label: string;
  icon: React.ElementType;
  description: string;
}

// Base drawer props
export interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  titleIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Root drawer component
export function SettingsDrawer({
  open,
  onOpenChange,
  title,
  description,
  titleIcon,
  children,
  className,
}: SettingsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className={cn("settings-drawer", className)}>
        <div className="settings-drawer-layout">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

// Sidebar component
export interface SettingsDrawerSidebarProps {
  title: string;
  description?: string;
  titleIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function SettingsDrawerSidebar({
  title,
  description,
  titleIcon,
  children,
}: SettingsDrawerSidebarProps) {
  return (
    <nav className="settings-drawer-sidebar">
      <SheetHeader className="settings-drawer-header">
        <SheetTitle className="font-(family-name:--font-heading) tracking-wide flex items-center gap-2">
          {titleIcon}
          {title}
        </SheetTitle>
        {description && <SheetDescription>{description}</SheetDescription>}
      </SheetHeader>
      {children}
    </nav>
  );
}

// Navigation list
export interface SettingsDrawerNavProps<T extends string> {
  items: SettingsNavItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
}

export function SettingsDrawerNav<T extends string>({
  items,
  activeTab,
  onTabChange,
}: SettingsDrawerNavProps<T>) {
  return (
    <ul className="settings-drawer-nav">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.id}>
            <button
              type="button"
              className={cn(
                "settings-drawer-nav-item",
                activeTab === item.id && "is-active",
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTabChange(item.id);
              }}
            >
              <Icon className="h-5 w-5" />
              <div className="settings-drawer-nav-text">
                <span className="settings-drawer-nav-label">{item.label}</span>
                <span className="settings-drawer-nav-desc">
                  {item.description}
                </span>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Content area
export interface SettingsDrawerContentProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function SettingsDrawerContent({
  children,
  isLoading,
}: SettingsDrawerContentProps) {
  if (isLoading) {
    return (
      <div className="settings-drawer-content">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return <div className="settings-drawer-content">{children}</div>;
}

// Actions bar (top right of content)
export interface SettingsDrawerActionsProps {
  children: React.ReactNode;
}

export function SettingsDrawerActions({
  children,
}: SettingsDrawerActionsProps) {
  return <div className="settings-drawer-actions">{children}</div>;
}

// Save button with loading state
export interface SettingsDrawerSaveButtonProps {
  onClick: () => void;
  isPending?: boolean;
  hasChanges?: boolean;
  savedLabel?: string;
  saveLabel?: string;
}

export function SettingsDrawerSaveButton({
  onClick,
  isPending,
  hasChanges = true,
  savedLabel = "Saved",
  saveLabel = "Save Changes",
}: SettingsDrawerSaveButtonProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
      disabled={!hasChanges || isPending}
    >
      {isPending && <Loader2 className="h-4 w-4  animate-spin" />}
      {hasChanges ? saveLabel : savedLabel}
    </Button>
  );
}

// Settings section wrapper
export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <div className="settings-section">
      <h3 className="settings-section-title">{title}</h3>
      {description && (
        <p className="settings-section-description">{description}</p>
      )}
      {children}
    </div>
  );
}

// Settings grid block with title
export interface SettingsGridBlockProps {
  title?: string;
  children: React.ReactNode;
}

export function SettingsGridBlock({ title, children }: SettingsGridBlockProps) {
  return (
    <div className="settings-grid-block">
      {title && <h4 className="settings-grid-title">{title}</h4>}
      <div className="settings-grid">{children}</div>
    </div>
  );
}

// Settings form wrapper
export interface SettingsFormProps {
  children: React.ReactNode;
}

export function SettingsForm({ children }: SettingsFormProps) {
  return <div className="settings-form">{children}</div>;
}

// Settings field wrapper
export interface SettingsFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function SettingsField({ children, className }: SettingsFieldProps) {
  return <div className={cn("settings-field", className)}>{children}</div>;
}
