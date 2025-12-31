"use client";

import * as React from "react";
import {
  FileText,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Home,
  ExternalLink,
  Check,
  ChevronDown,
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
  compact = false,
  className,
}: PageCardProps) {
  const [statusOpen, setStatusOpen] = React.useState(false);

  const handleStatusChange = (newStatus: "draft" | "published") => {
    if (newStatus !== page.status) {
      actions?.onStatusChange?.(page, newStatus);
    }
    setStatusOpen(false);
  };

  const dateDisplay = React.useMemo(() => {
    if (!page.updatedAt && !page.createdAt) return null;
    const date = new Date(page.updatedAt || page.createdAt!);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return formatDistanceToNow(date, { addSuffix: false });
    return format(date, "MM/dd/yyyy");
  }, [page.updatedAt, page.createdAt]);

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-3 border rounded-lg hover:border-(--primary) transition-colors cursor-pointer",
        isUpdating && "opacity-60 pointer-events-none",
        className,
      )}
    >
      {/* Icon */}
      <div className="shrink-0">
        <FileText
          className={cn(
            "h-5 w-5",
            page.status === "published"
              ? "text-muted-foreground"
              : "text-muted-foreground/60",
          )}
        />
      </div>

      {/* Title & Slug */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{page.title}</span>
          {page.isHomePage && (
            <span className="shrink-0 inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              <Home className="h-3 w-3" />
              Home
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">/{page.slug}</span>
      </div>

      {/* Status Dropdown */}
      <Popover open={statusOpen} onOpenChange={setStatusOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 gap-1.5 text-xs font-medium px-2",
              page.status === "published"
                ? "text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30"
                : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-950/30",
            )}
            disabled={isUpdating}
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                page.status === "published" ? "bg-green-500" : "bg-yellow-500",
              )}
            />
            {page.status === "published" ? "Published" : "Draft"}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-1" align="end">
          <button
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
              page.status === "published"
                ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
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
                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                : "hover:bg-muted",
            )}
            onClick={() => handleStatusChange("draft")}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            Draft
            {page.status === "draft" && <Check className="h-3 w-3 ml-auto" />}
          </button>
        </PopoverContent>
      </Popover>

      {/* Date */}
      {showDate && dateDisplay && !compact && (
        <span className="text-xs text-muted-foreground w-24 text-right shrink-0">
          {dateDisplay}
        </span>
      )}

      {/* Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={isUpdating}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {actions?.onEdit && (
            <DropdownMenuItem onClick={() => actions.onEdit?.(page)}>
              <Pencil className="h-4 w-4 " />
              Edit Page
            </DropdownMenuItem>
          )}
          {actions?.onPreview && (
            <DropdownMenuItem onClick={() => actions.onPreview?.(page)}>
              <ExternalLink className="h-4 w-4 " />
              Preview
            </DropdownMenuItem>
          )}
          {actions?.onDuplicate && (
            <DropdownMenuItem onClick={() => actions.onDuplicate?.(page)}>
              <Copy className="h-4 w-4 " />
              Duplicate
            </DropdownMenuItem>
          )}
          {showHomepageToggle && actions?.onSetHomePage && !page.isHomePage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.onSetHomePage?.(page)}>
                <Home className="h-4 w-4 " />
                Set as Homepage
              </DropdownMenuItem>
            </>
          )}
          {actions?.onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => actions.onDelete?.(page)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 " />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
