"use client";

import * as React from "react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout/page-layout";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Plus,
  Search,
  LayoutGrid,
  List,
  PlusCircle,
  Circle,
  CheckCircle2,
  Clock,
  Archive,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

import "./content-list.css";

// Status configuration
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

// Base item interface - extend this for specific content types
export interface ContentItem {
  id: string;
  title: string;
  slug?: string;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
}

// Status Dropdown Component
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
  const StatusIcon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`content-status-dropdown ${config.className}`}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
        >
          <StatusIcon className="h-3.5 w-3.5" />
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
                className={`h-4 w-4  ${className.replace("content-status-", "text-status-")}`}
              />
              {label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Filter option type
export interface FilterOption {
  value: string;
  label: string;
}

// Menu action type
export interface MenuAction<T> {
  label: string;
  icon: LucideIcon;
  onClick: (item: T) => void;
  destructive?: boolean;
  separator?: boolean;
  href?: (item: T) => string;
  external?: boolean;
}

// Badge renderer type
export interface BadgeConfig<T> {
  show: (item: T) => boolean;
  icon: LucideIcon;
  className: string;
  title: string;
}

// Main ContentList Props
export interface ContentListProps<T extends ContentItem> {
  // Content configuration
  title: string;
  singularName: string;
  pluralName: string;
  icon: LucideIcon;

  // Data
  items: T[] | undefined;
  isLoading: boolean;
  error: Error | null;

  // Actions
  onCreate: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onStatusChange?: (item: T, status: string) => void;

  // Optional customizations
  menuActions?: MenuAction<T>[];
  badges?: BadgeConfig<T>[];
  filterOptions?: FilterOption[];
  showStatus?: boolean;
  searchFields?: (keyof T)[];

  // Custom renderers
  renderThumbnail?: (item: T) => React.ReactNode;
  renderMeta?: (item: T) => React.ReactNode;
  renderListMeta?: (item: T) => React.ReactNode;
}

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
  renderThumbnail,
  renderMeta,
  renderListMeta,
}: ContentListProps<T>) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter items
  const filteredItems = React.useMemo(() => {
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

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  // Default menu actions
  const defaultMenuActions: MenuAction<T>[] = [
    {
      label: "Edit",
      icon: Pencil,
      onClick: onEdit,
    },
    ...(onDuplicate
      ? [
          {
            label: "Duplicate",
            icon: Copy,
            onClick: onDuplicate,
          } as MenuAction<T>,
        ]
      : []),
    ...menuActions,
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      destructive: true,
      separator: true,
    },
  ];

  if (error) {
    return (
      <PageLayout title={title} description={`Error loading ${pluralName}`}>
        <div className="content-list-error">
          <p>{error.message}</p>
        </div>
      </PageLayout>
    );
  }

  // Toolbar component
  const toolbarContent = (
    <>
      <div className="content-list-search">
        <Search className="content-list-search-icon" />
        <Input
          placeholder={`Search ${pluralName}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="content-list-search-input"
        />
      </div>
      <div className="content-list-filters">
        {(showStatus || filterOptions) && (
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="content-list-filter-select">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {filterOptions ? (
                filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        )}
        <div className="content-list-view-toggle">
          <Button
            variant={viewMode === "grid" ? "outline" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "outline" : "ghost"}
            size="icon-sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <PageLayout
      title={title}
      description={`${items?.length || 0} ${items?.length === 1 ? singularName : pluralName}`}
      actions={
        <Button onClick={onCreate}>
          <PlusCircle className="h-4 w-4" />
          Create {singularName}
        </Button>
      }
      toolbar={toolbarContent}
    >
      {/* Content */}
      {isLoading ? (
        <div className="content-list-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="content-card">
              <Skeleton className="content-card-thumbnail" />
              <div className="content-card-content">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="content-list-empty">
          <Icon className="content-list-empty-icon" />
          <h3>No {pluralName} found</h3>
          <p>
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : `Create your first ${singularName} to get started`}
          </p>
          {!search && statusFilter === "all" && (
            <Button onClick={onCreate}>
              <PlusCircle className="h-4 w-4 " />
              Create {singularName}
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="content-list-grid">
          {filteredItems.map((item) => (
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
                          className={`content-card-badge ${badge.className}`}
                          title={badge.title}
                        >
                          <badge.icon className="h-3 w-3" />
                        </span>
                      ) : null,
                    )}
                    {showStatus && onStatusChange && (
                      <StatusDropdown
                        status={item.status}
                        onStatusChange={(newStatus) =>
                          onStatusChange(item, newStatus)
                        }
                      />
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="content-card-menu"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {defaultMenuActions.map((action) => (
                        <React.Fragment key={action.label}>
                          {action.separator && <DropdownMenuSeparator />}
                          {action.href ? (
                            <DropdownMenuItem asChild>
                              <a
                                href={action.href(item)}
                                target={action.external ? "_blank" : undefined}
                                rel={
                                  action.external
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                              >
                                <action.icon className="h-4 w-4 " />
                                {action.label}
                              </a>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className={
                                action.destructive ? "text-destructive" : ""
                              }
                              onClick={() => action.onClick(item)}
                            >
                              <action.icon className="h-4 w-4 " />
                              {action.label}
                            </DropdownMenuItem>
                          )}
                        </React.Fragment>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="content-card-title">{item.title}</h3>
                {renderMeta ? (
                  renderMeta(item)
                ) : (
                  <p className="content-card-meta">
                    Last edited {formatDate(item.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="content-list-rows">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="content-list-item"
              onClick={() => onEdit(item)}
            >
              <div className="content-list-item-icon">
                <Icon className="h-5 w-5" />
              </div>
              <div className="content-list-item-content">
                <h3 className="content-list-item-title">
                  {item.title}
                  {badges.map((badge, index) =>
                    badge.show(item) ? (
                      <span
                        key={index}
                        className={`content-list-item-badge ${badge.className}`}
                        title={badge.title}
                      >
                        <badge.icon className="h-3 w-3" />
                      </span>
                    ) : null,
                  )}
                </h3>
                {item.slug && (
                  <p className="content-list-item-slug">/{item.slug}</p>
                )}
              </div>
              {showStatus && onStatusChange && (
                <StatusDropdown
                  status={item.status}
                  onStatusChange={(newStatus) =>
                    onStatusChange(item, newStatus)
                  }
                />
              )}
              {renderListMeta ? (
                renderListMeta(item)
              ) : (
                <span className="content-list-item-date">
                  {formatDate(item.updatedAt)}
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {defaultMenuActions.map((action) => (
                    <React.Fragment key={action.label}>
                      {action.separator && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        className={action.destructive ? "text-destructive" : ""}
                        onClick={() => action.onClick(item)}
                      >
                        <action.icon className="h-4 w-4 " />
                        {action.label}
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
