"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/layout/page-header";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  PlusCircle,
  Circle,
  CheckCircle2,
  Clock,
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import "./content-list.css";

// =============================================================================
// Status configuration
// =============================================================================

export const statusConfig = {
  draft: {
    label: "Draft",
    icon: Circle,
    className: "content-status-draft",
  },
  published: {
    label: "Published",
    icon: CheckCircle2,
    className: "content-status-published",
  },
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    className: "content-status-scheduled",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className: "content-status-archived",
  },
} as const;

export type StatusKey = keyof typeof statusConfig;

// =============================================================================
// Types
// =============================================================================

export interface ContentItem {
  id: string;
  title: string;
  slug?: string;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface MenuAction<T> {
  label: string;
  icon: LucideIcon;
  onClick: (item: T) => void;
  destructive?: boolean;
  separator?: boolean;
  href?: (item: T) => string;
  external?: boolean;
}

export interface BadgeConfig<T> {
  show: (item: T) => boolean;
  icon: LucideIcon;
  className: string;
  title: string;
}

/** Column definition for the table view */
export interface ColumnDef<T> {
  key: string;
  header: string;
  headerClassName?: string;
  cellClassName?: string;
  render: (item: T) => React.ReactNode;
}

// =============================================================================
// Status Dropdown
// =============================================================================

interface StatusDropdownProps {
  status: string | undefined;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

export function StatusDropdown({
  status,
  onStatusChange,
  disabled,
}: StatusDropdownProps) {
  const currentStatus = (status || "draft") as StatusKey;
  const config = statusConfig[currentStatus] || statusConfig.draft;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`content-status-dropdown ${config.className}`}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
        >
          <span>{config.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
        {Object.entries(statusConfig).map(
          ([key, { label, icon: Icon, className }]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onStatusChange(key)}
              className={currentStatus === key ? "bg-accent" : ""}
            >
              <Icon
                className={`h-4 w-4 ${className.replace("content-status-", "text-status-")}`}
              />
              {label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =============================================================================
// Status Pill (non-interactive)
// =============================================================================

export function StatusPill({ status }: { status: string | undefined }) {
  const currentStatus = (status || "draft") as StatusKey;
  const config = statusConfig[currentStatus] || statusConfig.draft;

  return (
    <span className={`content-status-pill ${config.className}`}>
      {config.label}
    </span>
  );
}

// =============================================================================
// ContentList Props
// =============================================================================

export interface ContentListProps<T extends ContentItem> {
  title: string;
  singularName: string;
  pluralName: string;
  icon: LucideIcon;

  items: T[] | undefined;
  isLoading: boolean;
  error: Error | null;

  onCreate: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onStatusChange?: (item: T, status: string) => void;

  menuActions?: MenuAction<T>[];
  badges?: BadgeConfig<T>[];
  filterOptions?: FilterOption[];
  showStatus?: boolean;
  searchFields?: (keyof T)[];
  columns?: ColumnDef<T>[];
  pageSize?: number;

  renderThumbnail?: (item: T) => React.ReactNode;
  renderMeta?: (item: T) => React.ReactNode;
  renderListMeta?: (item: T) => React.ReactNode;
}

// =============================================================================
// ContentList Component
// =============================================================================

const SKELETON_ROWS = 8;

export function ContentList<T extends ContentItem>({
  title,
  singularName,
  pluralName,
  icon: Icon,
  items,
  isLoading,
  error,
  onCreate,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
  menuActions = [],
  badges = [],
  filterOptions,
  showStatus = true,
  searchFields = ["title", "slug"] as (keyof T)[],
  columns,
  pageSize = 20,
  renderThumbnail,
  renderMeta,
}: ContentListProps<T>) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [currentPage, setCurrentPage] = useState(1);

  // ---- Filtering ----
  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter((item) => {
      const matchesSearch =
        search === "" ||
        searchFields.some((field) => {
          const value = item[field];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(search.toLowerCase())
          );
        });
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter, searchFields]);

  // ---- Pagination ----
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // ---- Date formatting ----
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // ---- Default menu actions ----
  const defaultMenuActions: MenuAction<T>[] = [
    { label: "Edit", icon: Pencil, onClick: onEdit },
    ...(onDuplicate
      ? [{ label: "Duplicate", icon: Copy, onClick: onDuplicate } as MenuAction<T>]
      : []),
    ...menuActions,
    { label: "Delete", icon: Trash2, onClick: onDelete, destructive: true, separator: true },
  ];

  // ---- Filter options for PageHeader ----
  const headerFilterOptions = filterOptions || [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
  ];

  // ---- Error state ----
  if (error) {
    return (
      <div className="content-list-container">
        <PageHeader
          title={title}
          icon={Icon}
          description={`Error loading ${pluralName}`}
        />
        <div className="content-list-error">
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  // ---- Render actions dropdown for a row ----
  const renderActionsMenu = (item: T) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="content-actions-trigger"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {defaultMenuActions.map((action) => (
          <React.Fragment key={action.label}>
            {action.separator && <DropdownMenuSeparator />}
            {action.href ? (
              <DropdownMenuItem asChild>
                <a
                  href={action.href(item)}
                  target={action.external ? "_blank" : undefined}
                  rel={action.external ? "noopener noreferrer" : undefined}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </a>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className={action.destructive ? "text-destructive focus:text-destructive [&>svg]:text-destructive" : ""}
                onClick={() => action.onClick(item)}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </DropdownMenuItem>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ---- Render table row (default columns) ----
  const renderTableRow = (item: T) => (
    <div
      key={item.id}
      className="content-table-row"
      onClick={() => onEdit(item)}
    >
      {/* Title */}
      <div className="content-table-cell content-table-cell-title">
        <span className="content-table-cell-title-text">{item.title}</span>
        {badges.map((badge, index) =>
          badge.show(item) ? (
            <span key={index} className={`content-badge ${badge.className}`} title={badge.title}>
              <badge.icon className="h-3 w-3" />
            </span>
          ) : null,
        )}
      </div>

      {/* Slug */}
      <div className="content-table-cell content-table-cell-slug">
        <span className="content-table-cell-slug-text">
          {item.slug ? `/${item.slug}` : "—"}
        </span>
      </div>

      {/* Status */}
      {showStatus && (
        <div className="content-table-cell content-table-cell-status">
          {onStatusChange ? (
            <StatusDropdown
              status={item.status}
              onStatusChange={(newStatus) => onStatusChange(item, newStatus)}
            />
          ) : (
            <StatusPill status={item.status} />
          )}
        </div>
      )}

      {/* Date */}
      <div className="content-table-cell content-table-cell-date">
        <span className="content-table-cell-date-text">
          {formatDate(item.updatedAt)}
        </span>
      </div>

      {/* Actions */}
      <div className="content-table-cell content-table-cell-actions">
        {renderActionsMenu(item)}
      </div>
    </div>
  );

  // ---- Render custom-columns table row ----
  const renderCustomTableRow = (item: T) => (
    <div
      key={item.id}
      className="content-table-row"
      onClick={() => onEdit(item)}
    >
      {columns!.map((col) => (
        <div key={col.key} className={`content-table-cell ${col.cellClassName || ""}`}>
          {col.render(item)}
        </div>
      ))}
      <div className="content-table-cell content-table-cell-actions">
        {renderActionsMenu(item)}
      </div>
    </div>
  );

  // ---- Pagination controls ----
  const renderPagination = () => {
    if (totalItems <= pageSize) return null;
    return (
      <div className="content-list-pagination">
        <span className="content-list-pagination-info">
          Showing {startIndex + 1}–{endIndex} of {totalItems}
        </span>
        <div className="content-list-pagination-controls">
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="content-list-container">
      {/* Page Header */}
      <PageHeader
        title={title}
        icon={Icon}
        count={items?.length || 0}
        singularName={singularName.toLowerCase()}
        pluralName={pluralName}
        actionLabel={`New ${singularName}`}
        onAction={onCreate}
        showSearch
        searchPlaceholder={`Search ${pluralName}...`}
        searchValue={search}
        onSearchChange={setSearch}
        showFilter={showStatus || !!filterOptions}
        filterOptions={headerFilterOptions}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        showViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content */}
      {isLoading ? (
        <div className="content-table">
          {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
            <div key={i} className="content-table-skeleton-row">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-32 hidden md:block" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24 hidden lg:block" />
              <Skeleton className="h-4 w-8" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="content-list-empty">
          <Icon className="content-list-empty-icon" />
          <h3>
            {search || statusFilter !== "all"
              ? `No ${pluralName} found`
              : `No ${pluralName} yet`}
          </h3>
          <p>
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : `Create your first ${singularName.toLowerCase()} to get started`}
          </p>
          {!search && statusFilter === "all" && (
            <Button onClick={onCreate} size="sm">
              <PlusCircle className="h-4 w-4" />
              Create {singularName}
            </Button>
          )}
        </div>
      ) : viewMode === "list" ? (
        <>
          <div className="content-table">
            {/* Table Header */}
            <div className="content-table-header">
              {columns ? (
                <div className="content-table-header-row">
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className={`content-table-header-cell ${col.headerClassName || ""}`}
                    >
                      {col.header}
                    </div>
                  ))}
                  <div className="content-table-header-cell content-table-header-cell-actions" />
                </div>
              ) : (
                <div className="content-table-header-row">
                  <div className="content-table-header-cell content-table-header-cell-title">
                    Title
                  </div>
                  <div className="content-table-header-cell content-table-header-cell-slug">
                    Slug
                  </div>
                  {showStatus && (
                    <div className="content-table-header-cell content-table-header-cell-status">
                      Status
                    </div>
                  )}
                  <div className="content-table-header-cell content-table-header-cell-date">
                    Updated
                  </div>
                  <div className="content-table-header-cell content-table-header-cell-actions" />
                </div>
              )}
            </div>

            {/* Table Body */}
            <div className="content-table-body">
              {paginatedItems.map((item) =>
                columns ? renderCustomTableRow(item) : renderTableRow(item),
              )}
            </div>
          </div>

          {renderPagination()}
        </>
      ) : (
        /* Grid View */
        <div className="content-list-grid">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="content-card"
              onClick={() => onEdit(item)}
            >
              <div className="content-card-thumbnail">
                {renderThumbnail ? (
                  renderThumbnail(item)
                ) : (
                  <Icon className="content-card-thumbnail-icon" />
                )}
              </div>
              <div className="content-card-content">
                <div className="content-card-header">
                  <div className="content-card-badges">
                    {badges.map((badge, index) =>
                      badge.show(item) ? (
                        <span
                          key={index}
                          className={`content-badge ${badge.className}`}
                          title={badge.title}
                        >
                          <badge.icon className="h-3 w-3" />
                        </span>
                      ) : null,
                    )}
                    {showStatus && <StatusPill status={item.status} />}
                  </div>
                  {renderActionsMenu(item)}
                </div>
                <h3 className="content-card-title">{item.title}</h3>
                {renderMeta ? (
                  renderMeta(item)
                ) : (
                  <p className="content-card-meta">
                    Updated {formatDate(item.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
