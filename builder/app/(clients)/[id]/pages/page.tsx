"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  usePages,
  useDeletePage,
  useDuplicatePage,
  useUpdatePage,
  type Page,
} from "@/lib/hooks/use-pages";
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
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
  Plus,
  Search,
  LayoutGrid,
  List,
  FileText,
  ExternalLink,
  PlusCircle,
  Home,
  Circle,
  CheckCircle2,
  Clock,
  Archive,
  ChevronDown,
} from "lucide-react";
import "./pages.css";

// Status configuration
const statusConfig = {
  draft: {
    label: "Draft",
    icon: Circle,
    className: "page-status-draft",
  },
  published: {
    label: "Published",
    icon: CheckCircle2,
    className: "page-status-published",
  },
  scheduled: {
    label: "Scheduled",
    icon: Clock,
    className: "page-status-scheduled",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    className: "page-status-archived",
  },
} as const;

type StatusKey = keyof typeof statusConfig;

interface StatusDropdownProps {
  status: string | undefined;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

function StatusDropdown({ status, onStatusChange, disabled }: StatusDropdownProps) {
  const currentStatus = (status || "draft") as StatusKey;
  const config = statusConfig[currentStatus] || statusConfig.draft;
  const StatusIcon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`page-status-dropdown ${config.className}`}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{config.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
        {Object.entries(statusConfig).map(([key, { label, icon: Icon, className }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onStatusChange(key)}
            className={currentStatus === key ? "bg-accent" : ""}
          >
            <Icon className={`h-4 w-4 mr-2 ${className.replace("page-status-", "text-status-")}`} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function PagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { data: pages, isLoading, error } = usePages(id);
  const deletePage = useDeletePage(id);
  const duplicatePage = useDuplicatePage(id);
  const updatePage = useUpdatePage(id);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleStatusChange = (pageId: string, newStatus: string) => {
    updatePage.mutate({ id: pageId, data: { status: newStatus } });
  };

  const handleEdit = (pageId: string) => {
    router.push(`/${id}/pages/${pageId}/edit`);
  };

  const handleDelete = (page: { id: string; title: string }) => {
    if (confirm(`Delete "${page.title}"?`)) {
      deletePage.mutate(page.id);
    }
  };

  const handleDuplicate = (pageId: string) => {
    duplicatePage.mutate(pageId);
  };

  const filteredPages = React.useMemo(() => {
    if (!pages) return [];
    return pages.filter((page) => {
      const matchesSearch =
        search === "" ||
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || page.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [pages, search, statusFilter]);

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

  if (error) {
    return (
      <div className="pages-error">
        <p>Error loading pages: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="pages-container">
      <div className="pages-header">
        <div className="pages-header-title">
          <h1>Pages</h1>
          <span className="pages-header-count">
            {pages?.length || 0} {pages?.length === 1 ? "page" : "pages"}
          </span>
        </div>
        <Button onClick={() => router.push(`/${id}/pages/new`)}>
          <PlusCircle className="h-4 w-4" />
          Create Page
        </Button>
      </div>

      <div className="pages-toolbar">
        <div className="pages-search">
          <Search className="pages-search-icon" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pages-search-input"
          />
        </div>
        <div className="pages-filters">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="pages-filter-select">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <div className="pages-view-toggle">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="pages-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="page-card">
              <Skeleton className="page-card-thumbnail" />
              <div className="page-card-content">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="pages-empty">
          <FileText className="pages-empty-icon" />
          <h3>No pages found</h3>
          <p>
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first page to get started"}
          </p>
          {!search && statusFilter === "all" && (
            <Button onClick={() => router.push(`/${id}/pages/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Page
            </Button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="scrollbar-y">
          <div className="pages-grid h-full">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className="page-card"
                onClick={() => handleEdit(page.id)}
              >
                <div className="page-card-thumbnail">
                  <FileText className="page-card-thumbnail-icon" />
                </div>
                <div className="page-card-content">
                  <div className="page-card-header">
                    <div className="page-card-badges">
                      {page.isHomePage && (
                        <span className="page-card-badge page-card-badge-home" title="Home Page">
                          <Home className="h-3 w-3" />
                        </span>
                      )}
                      <StatusDropdown
                        status={page.status}
                        onStatusChange={(newStatus) => handleStatusChange(page.id, newStatus)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="page-card-menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(page.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(page.id)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={`/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Page
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(page)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="page-card-title">{page.title}</h3>
                  <p className="page-card-meta">
                    Last edited {formatDate(page.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pages-list">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="page-list-item"
              onClick={() => handleEdit(page.id)}
            >
              <div className="page-list-item-icon">
                <FileText className="h-5 w-5" />
              </div>
              <div className="page-list-item-content">
                <h3 className="page-list-item-title">
                  {page.title}
                  {page.isHomePage && (
                    <span className="page-list-item-home-badge" title="Home Page">
                      <Home className="h-3 w-3" />
                    </span>
                  )}
                </h3>
                <p className="page-list-item-slug">/{page.slug}</p>
              </div>
              <StatusDropdown
                status={page.status}
                onStatusChange={(newStatus) => handleStatusChange(page.id, newStatus)}
              />
              <span className="page-list-item-date">
                {formatDate(page.updatedAt)}
              </span>
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
                  <DropdownMenuItem onClick={() => handleEdit(page.id)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDuplicate(page.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(page)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
