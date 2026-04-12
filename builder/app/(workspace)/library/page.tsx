"use client";

import * as React from "react";
import {
  useLibraryItems,
  useDeleteLibraryItem,
  useToggleFavorite,
  type LibraryItem,
  type LibraryItemType,
} from "@/lib/hooks/use-library";
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Search,
  Star,
  Trash2,
  Copy,
  PanelTop,
  PanelBottom,
  LayoutGrid,
  Box,
  Menu,
  LibraryBig,
} from "lucide-react";

import "./library.css";

// =============================================================================
// Constants
// =============================================================================

type TabType = "all" | LibraryItemType;

const TABS: Array<{ value: TabType; label: string; icon: React.ReactNode }> = [
  { value: "all", label: "All", icon: <LibraryBig className="size-3.5" /> },
  {
    value: "HEADER",
    label: "Headers",
    icon: <PanelTop className="size-3.5" />,
  },
  {
    value: "FOOTER",
    label: "Footers",
    icon: <PanelBottom className="size-3.5" />,
  },
  {
    value: "SECTION",
    label: "Sections",
    icon: <LayoutGrid className="size-3.5" />,
  },
  { value: "BLOCK", label: "Blocks", icon: <Box className="size-3.5" /> },
  { value: "MENU", label: "Menus", icon: <Menu className="size-3.5" /> },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  HEADER: <PanelTop className="library-card-preview-icon" />,
  FOOTER: <PanelBottom className="library-card-preview-icon" />,
  SECTION: <LayoutGrid className="library-card-preview-icon" />,
  BLOCK: <Box className="library-card-preview-icon" />,
  MENU: <Menu className="library-card-preview-icon" />,
};

type ScopeFilter = "ALL" | "TENANT" | "GLOBAL";

// =============================================================================
// Library Page
// =============================================================================

export default function LibraryPage() {
  const { tenantId } = useResolvedTenant();
  const id = tenantId!;

  const [activeTab, setActiveTab] = React.useState<TabType>("all");
  const [search, setSearch] = React.useState("");
  const [scope, setScope] = React.useState<ScopeFilter>("ALL");

  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const { data: items, isLoading } = useLibraryItems(id, {
    type: activeTab !== "all" ? activeTab : undefined,
    search: debouncedSearch || undefined,
    scope: scope !== "ALL" ? scope : undefined,
  } as Record<string, unknown>);
  const deleteItem = useDeleteLibraryItem(id);
  const toggleFav = useToggleFavorite(id);

  // Count items by type for tab badges
  const typeCounts = React.useMemo(() => {
    if (!items) return {};
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.type] = (counts[item.type] || 0) + 1;
    }
    counts.all = items.length;
    return counts;
  }, [items]);

  const handleDelete = (item: LibraryItem) => {
    if (!window.confirm(`Delete "${item.name}" from library?`)) return;
    deleteItem.mutate(item.id);
  };

  const handleCopyId = (item: LibraryItem) => {
    navigator.clipboard.writeText(item.id);
    toast.success("ID copied");
  };

  return (
    <div className="library-page">
      {/* Header */}
      <div className="library-header">
        <h1 className="library-title">Component Library</h1>
        <p className="library-subtitle">
          Reusable headers, footers, sections, and blocks — save once, use
          everywhere
        </p>

        {/* Type tabs */}
        <div className="library-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className="library-tab"
              data-active={activeTab === tab.value || undefined}
              onClick={() => setActiveTab(tab.value)}
            >
              {/* {tab.icon} */}
              <span className="ml-1">{tab.label}</span>
              {/* {typeCounts[tab.value] !== undefined && (
                <span className="library-tab-count">
                  {typeCounts[tab.value]}
                </span>
              )} */}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="library-toolbar">
        <div className="library-search">
          <Search className="library-search-icon" />
          <Input
            placeholder="Search library..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="library-search-input"
          />
        </div>

        <div className="library-filters">
          <div className="library-scope-toggle">
            {(["ALL", "TENANT", "GLOBAL"] as const).map((s) => (
              <button
                key={s}
                type="button"
                className="library-scope-btn"
                data-active={scope === s || undefined}
                onClick={() => setScope(s)}
              >
                {s === "ALL"
                  ? "All"
                  : s === "TENANT"
                    ? "My Items"
                    : "Templates"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="library-grid">
        {isLoading ? (
          <div className="library-grid-inner">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="library-card animate-pulse">
                <div className="library-card-preview bg-(--el-100)" />
                <div className="library-card-body">
                  <div className="h-4 w-2/3 bg-(--el-100) rounded" />
                  <div className="h-3 w-full bg-(--el-50) rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !items?.length ? (
          <div className="library-empty">
            <LibraryBig className="library-empty-icon" />
            <h3>
              {search
                ? "No results found"
                : activeTab === "all"
                  ? "Your library is empty"
                  : `No ${activeTab.toLowerCase()}s in library`}
            </h3>
            <p>
              {search
                ? "Try a different search term"
                : "Save headers, footers, sections, and blocks from the editor to build your reusable component library."}
            </p>
          </div>
        ) : (
          <div className="library-grid-inner">
            {items.map((item) => (
              <div key={item.id} className="library-card">
                {/* Preview */}
                <div className="library-card-preview">
                  {item.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnailUrl} alt={item.name} />
                  ) : (
                    TYPE_ICONS[item.type] || (
                      <Box className="library-card-preview-icon" />
                    )
                  )}

                  {/* Scope badge */}
                  <span className="library-card-scope" data-scope={item.scope}>
                    {item.scope === "GLOBAL" ? "Template" : "Custom"}
                  </span>

                  {/* Favorite */}
                  <button
                    type="button"
                    className="library-card-fav"
                    data-active={item.isFavorite || undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFav.mutate(item.id);
                    }}
                  >
                    <Star
                      className="size-3.5"
                      fill={item.isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* Body */}
                <div className="library-card-body">
                  <span className="library-card-name">{item.name}</span>
                  {item.description && (
                    <span className="library-card-desc">
                      {item.description}
                    </span>
                  )}
                  <div className="library-card-meta">
                    <span className="library-card-category">
                      {item.category || item.type}
                    </span>
                    <span className="library-card-usage">
                      {item.usageCount > 0
                        ? `Used ${item.usageCount}x`
                        : "Never used"}
                    </span>
                  </div>
                </div>

                {/* Hover actions */}
                <div className="library-card-actions">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-(--el-200)"
                    onClick={() => handleCopyId(item)}
                  >
                    <Copy className="size-3" />
                    Copy ID
                  </Button>
                  {item.scope === "TENANT" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-(--el-200) text-(--status-error)"
                      onClick={() => handleDelete(item)}
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
