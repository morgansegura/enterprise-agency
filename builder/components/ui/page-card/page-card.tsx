"use client";

import * as React from "react";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Home,
  ExternalLink,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow, format } from "date-fns";

import "./page-card.css";

// =============================================================================
// Types
// =============================================================================

export interface PageCardData {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  isHomePage?: boolean;
  updatedAt?: string;
  createdAt?: string;
}

export interface PageCardActions {
  onEdit?: (page: PageCardData) => void;
  onDuplicate?: (page: PageCardData) => void;
  onDelete?: (page: PageCardData) => void;
  onStatusChange?: (page: PageCardData, status: "draft" | "published") => void;
  onSetHomePage?: (page: PageCardData) => void;
  onPreview?: (page: PageCardData) => void;
}

// =============================================================================
// Date helper
// =============================================================================

function useDateDisplay(updatedAt?: string, createdAt?: string) {
  return React.useMemo(() => {
    if (!updatedAt && !createdAt) return "—";
    const date = new Date(updatedAt || createdAt!);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return formatDistanceToNow(date, { addSuffix: false });
    return format(date, "MMM d, yyyy");
  }, [updatedAt, createdAt]);
}

// =============================================================================
// PageCard — Table row variant
// =============================================================================

interface PageCardProps {
  page: PageCardData;
  actions?: PageCardActions;
  isUpdating?: boolean;
  showDate?: boolean;
  showHomepageToggle?: boolean;
  compact?: boolean;
  className?: string;
}

export function PageCard({
  page,
  actions,
  isUpdating = false,
  showDate = true,
  showHomepageToggle = true,
  className,
}: PageCardProps) {
  const [statusOpen, setStatusOpen] = React.useState(false);
  const dateDisplay = useDateDisplay(page.updatedAt, page.createdAt);

  const handleStatusChange = (newStatus: "draft" | "published") => {
    if (newStatus !== page.status) {
      actions?.onStatusChange?.(page, newStatus);
    }
    setStatusOpen(false);
  };

  return (
    <div
      className={cn(
        "page-row",
        isUpdating && "page-row-updating",
        className,
      )}
      onClick={() => actions?.onEdit?.(page)}
    >
      {/* Title */}
      <div className="page-row-title">
        <span className="page-row-title-link">{page.title}</span>
        {page.isHomePage && (
          <span className="page-row-home-badge">
            <Home className="h-3 w-3" />
            Home
          </span>
        )}
      </div>

      {/* Slug */}
      <div className="page-row-slug">
        <span className="page-row-slug-text">/{page.slug}</span>
      </div>

      {/* Status */}
      <div className="page-row-status">
        <Popover open={statusOpen} onOpenChange={setStatusOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "page-status-pill cursor-pointer",
                page.status === "published"
                  ? "page-status-published"
                  : "page-status-draft",
              )}
              onClick={(e) => e.stopPropagation()}
              disabled={isUpdating}
            >
              {page.status === "published" ? "Published" : "Draft"}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-36 p-1"
            align="start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                page.status === "published"
                  ? "bg-green-50 text-green-700"
                  : "hover:bg-muted",
              )}
              onClick={() => handleStatusChange("published")}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Published
              {page.status === "published" && (
                <Check className="h-3 w-3 ml-auto" />
              )}
            </button>
            <button
              className={cn(
                "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                page.status === "draft"
                  ? "bg-amber-50 text-amber-700"
                  : "hover:bg-muted",
              )}
              onClick={() => handleStatusChange("draft")}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Draft
              {page.status === "draft" && (
                <Check className="h-3 w-3 ml-auto" />
              )}
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Date */}
      {showDate && (
        <div className="page-row-date">
          <span className="page-row-date-text">{dateDisplay}</span>
        </div>
      )}

      {/* Actions */}
      <div className="page-row-actions">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="page-row-actions-trigger"
              disabled={isUpdating}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {actions?.onEdit && (
              <DropdownMenuItem onClick={() => actions.onEdit?.(page)}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {actions?.onDuplicate && (
              <DropdownMenuItem onClick={() => actions.onDuplicate?.(page)}>
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
            )}
            {actions?.onPreview && (
              <DropdownMenuItem onClick={() => actions.onPreview?.(page)}>
                <ExternalLink className="h-4 w-4" />
                Preview
              </DropdownMenuItem>
            )}
            {showHomepageToggle &&
              actions?.onSetHomePage &&
              !page.isHomePage && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => actions.onSetHomePage?.(page)}
                  >
                    <Home className="h-4 w-4" />
                    Set as Homepage
                  </DropdownMenuItem>
                </>
              )}
            {actions?.onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => actions.onDelete?.(page)}
                  className="text-destructive focus:text-destructive [&>svg]:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
