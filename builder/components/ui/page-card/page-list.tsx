"use client";

import * as React from "react";
import { FileText, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageCard, type PageCardData, type PageCardActions } from "./page-card";

import "./page-card.css";

// =============================================================================
// Types
// =============================================================================

interface PageListProps {
  pages: PageCardData[];
  actions?: PageCardActions;
  updatingIds?: string[];
  showDate?: boolean;
  showHomepageToggle?: boolean;
  pageSize?: number;
  emptyTitle?: string;
  emptyMessage?: string;
  onCreateFirst?: () => void;
  className?: string;
  /** @deprecated — filtering is handled by parent now */
  showSearch?: boolean;
  /** @deprecated */
  showFilters?: boolean;
  /** @deprecated */
  showViewToggle?: boolean;
  /** @deprecated */
  view?: "list" | "grid";
  /** @deprecated */
  defaultView?: "list" | "grid";
}

// =============================================================================
// PageList — Enterprise table
// =============================================================================

export function PageList({
  pages,
  actions,
  updatingIds = [],
  showDate = true,
  showHomepageToggle = true,
  pageSize = 20,
  emptyTitle = "No pages yet",
  emptyMessage = "Create your first page to get started",
  onCreateFirst,
  className,
}: PageListProps) {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Sort: homepage first, then published, then alphabetically
  const sortedPages = React.useMemo(() => {
    return [...pages].sort((a, b) => {
      if (a.isHomePage && !b.isHomePage) return -1;
      if (!a.isHomePage && b.isHomePage) return 1;
      if (a.status === "published" && b.status !== "published") return -1;
      if (a.status !== "published" && b.status === "published") return 1;
      return a.title.localeCompare(b.title);
    });
  }, [pages]);

  // Pagination
  const totalItems = sortedPages.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedPages = sortedPages.slice(startIndex, endIndex);

  // Reset to page 1 when the list changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [pages.length]);

  // ---- Empty state ----
  if (sortedPages.length === 0) {
    return (
      <div className={cn("page-list-empty", className)}>
        <FileText className="page-list-empty-icon" />
        <h3>{emptyTitle}</h3>
        <p>{emptyMessage}</p>
        {onCreateFirst && (
          <Button size="sm" onClick={onCreateFirst}>
            <PlusCircle className="h-4 w-4" />
            Create Page
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("page-table", className)}>
      {/* Table Header */}
      <div className="page-table-header">
        <div className="page-table-header-row">
          <div className="page-table-header-cell" style={{ flex: 1 }}>
            Title
          </div>
          <div className="page-table-header-cell" style={{ width: "12rem" }}>
            Slug
          </div>
          <div className="page-table-header-cell" style={{ width: "7rem" }}>
            Status
          </div>
          {showDate && (
            <div className="page-table-header-cell" style={{ width: "9rem" }}>
              Last Updated
            </div>
          )}
          <div className="page-table-header-cell" style={{ width: "3rem" }} />
        </div>
      </div>

      {/* Table Body */}
      <div className="page-table-body">
        {paginatedPages.map((page) => (
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

      {/* Pagination */}
      {totalItems > pageSize && (
        <div className="page-list-pagination">
          <span className="page-list-pagination-info">
            Showing {startIndex + 1}–{endIndex} of {totalItems}
          </span>
          <div className="page-list-pagination-controls">
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
      )}
    </div>
  );
}
