"use client";

import * as React from "react";
import {
  Search,
  LayoutGrid,
  List,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "./page-header.css";
import { Button } from "../../ui/button";

// =============================================================================
// Types
// =============================================================================

export interface FilterOption {
  value: string;
  label: string;
}

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Icon displayed before title */
  icon?: LucideIcon;
  /** Count or description shown below title */
  count?: number;
  /** Singular name for count (e.g., "post") */
  singularName?: string;
  /** Plural name for count (e.g., "posts") */
  pluralName?: string;
  /** Custom description (overrides count display) */
  description?: string;

  /** Primary action button */
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;

  /** Search configuration */
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;

  /** Filter dropdown */
  showFilter?: boolean;
  filterOptions?: FilterOption[];
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;

  /** View toggle (grid/list) */
  showViewToggle?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;

  /** Additional toolbar content */
  toolbarContent?: React.ReactNode;

  /** Additional actions (beside primary action) */
  additionalActions?: React.ReactNode;

  /** Custom class names */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function PageHeader({
  title,
  icon: _Icon,
  count,
  singularName,
  pluralName,
  description,
  actionLabel,
  actionIcon: ActionIcon = PlusCircle,
  onAction,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  showFilter = false,
  filterOptions,
  filterValue = "all",
  onFilterChange,
  filterPlaceholder = "All Status",
  showViewToggle = false,
  viewMode = "list",
  onViewModeChange,
  toolbarContent,
  additionalActions,
  className,
}: PageHeaderProps) {
  // Build count description
  const countDescription = React.useMemo(() => {
    if (description) return description;
    if (count === undefined) return undefined;
    const name = count === 1 ? singularName : pluralName;
    return `${count} ${name || "items"}`;
  }, [description, count, singularName, pluralName]);

  const hasToolbar =
    showSearch || showFilter || showViewToggle || toolbarContent;

  return (
    <div className={cn("page-header", className)}>
      {/* Header Row */}
      <div className="page-header-row">
        <div className="page-header-title-section">
          {/* {Icon && (
            <div className="page-header-icon">
              <Icon />
            </div>
          )} */}
          <div className="page-header-text">
            <h1 className="page-header-title">{title}</h1>
            {countDescription && (
              <p className="page-header-count">{countDescription}</p>
            )}
          </div>
        </div>

        <div className="page-header-actions">
          {additionalActions}
          {actionLabel && onAction && (
            <Button size="sm" onClick={onAction}>
              <ActionIcon className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar Row */}
      {hasToolbar && (
        <div className="page-header-toolbar">
          {/* Left side - Search */}
          <div className="page-header-toolbar-left">
            {showSearch && (
              <div className="page-header-search">
                <Search className="page-header-search-icon" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="page-header-search-input"
                />
              </div>
            )}
            {toolbarContent}
          </div>

          {/* Right side - Filters & View Toggle */}
          <div className="page-header-toolbar-right">
            {showFilter && (
              <Select value={filterValue} onValueChange={onFilterChange}>
                <SelectTrigger className="page-header-filter-select">
                  <SelectValue placeholder={filterPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{filterPlaceholder}</SelectItem>
                  {filterOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {showViewToggle && (
              <div className="page-header-view-toggle">
                <Button
                  variant={viewMode === "grid" ? "outline" : "ghost"}
                  size="icon-sm"
                  onClick={() => onViewModeChange?.("grid")}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "outline" : "ghost"}
                  size="icon-sm"
                  onClick={() => onViewModeChange?.("list")}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
