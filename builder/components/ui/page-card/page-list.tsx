"use client";

import * as React from "react";
import { Search, LayoutGrid, List, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageCard, type PageCardData, type PageCardActions } from "./page-card";

type ViewMode = "list" | "grid";
type StatusFilter = "all" | "published" | "draft";

interface PageListProps {
  pages: PageCardData[];
  actions?: PageCardActions;
  updatingIds?: string[];
  showSearch?: boolean;
  showFilters?: boolean;
  showViewToggle?: boolean;
  showDate?: boolean;
  showHomepageToggle?: boolean;
  defaultView?: ViewMode;
  emptyMessage?: string;
  className?: string;
}

export function PageList({
  pages,
  actions,
  updatingIds = [],
  showSearch = true,
  showFilters = true,
  showViewToggle = true,
  showDate = true,
  showHomepageToggle = true,
  defaultView = "list",
  emptyMessage = "No pages found",
  className,
}: PageListProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [viewMode, setViewMode] = React.useState<ViewMode>(defaultView);

  // Filter pages based on search and status
  const filteredPages = React.useMemo(() => {
    let result = pages;

    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (page) =>
          page.title.toLowerCase().includes(lowerSearch) ||
          page.slug.toLowerCase().includes(lowerSearch),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((page) => page.status === statusFilter);
    }

    return result;
  }, [pages, search, statusFilter]);

  // Sort: homepage first, then published, then by title
  const sortedPages = React.useMemo(() => {
    return [...filteredPages].sort((a, b) => {
      // Homepage always first
      if (a.isHomePage && !b.isHomePage) return -1;
      if (!a.isHomePage && b.isHomePage) return 1;
      // Then published
      if (a.status === "published" && b.status !== "published") return -1;
      if (a.status !== "published" && b.status === "published") return 1;
      // Then alphabetically
      return a.title.localeCompare(b.title);
    });
  }, [filteredPages]);

  const hasActiveFilters = search || statusFilter !== "all";

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {(showSearch || showFilters || showViewToggle) && (
        <div className="flex items-center gap-3">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="indent-9 pl-9 h-9"
              />
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Status Filter */}
            {showFilters && (
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as StatusFilter)}
              >
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* View Toggle */}
            {showViewToggle && (
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-r-none",
                    viewMode === "grid" && "bg-muted",
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-l-none border-l",
                    viewMode === "list" && "bg-muted",
                  )}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pages List/Grid */}
      {sortedPages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          {hasActiveFilters && (
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-1">
          {sortedPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              actions={actions}
              isUpdating={updatingIds.includes(page.id)}
              showDate={showDate}
              showHomepageToggle={showHomepageToggle}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              actions={actions}
              isUpdating={updatingIds.includes(page.id)}
              showDate={false}
              showHomepageToggle={showHomepageToggle}
              compact
              className="flex-col items-start gap-2 py-4"
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {hasActiveFilters && sortedPages.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {sortedPages.length} of {pages.length} pages
        </p>
      )}
    </div>
  );
}
