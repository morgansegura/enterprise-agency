"use client";

import * as React from "react";
import { Search, Trash2, Star, Layers, Box } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useLibraryItems,
  useDeleteLibraryItem,
  useUseLibraryItem,
  type LibraryItem,
  type LibraryItemType,
} from "@/lib/hooks/use-library";
import "./library-picker.css";

interface LibraryPickerProps {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Filter to a specific type, or show both */
  type?: LibraryItemType;
  /** Called when user picks an item — content is the serialized element */
  onSelect: (item: LibraryItem) => void;
}

/**
 * LibraryPicker — modal that lists saved sections/blocks and lets the user
 * insert one into the current page. Includes search, type filter, and delete.
 */
export function LibraryPicker({
  tenantId,
  open,
  onOpenChange,
  type,
  onSelect,
}: LibraryPickerProps) {
  const [search, setSearch] = React.useState("");
  const [activeType, setActiveType] = React.useState<LibraryItemType | "ALL">(
    type ?? "ALL",
  );

  const { data: items = [], isLoading } = useLibraryItems(tenantId, {
    type: activeType === "ALL" ? undefined : activeType,
    search: search || undefined,
  });
  const deleteItem = useDeleteLibraryItem(tenantId);
  const useItem = useUseLibraryItem(tenantId);

  const handleSelect = (item: LibraryItem) => {
    onSelect(item);
    useItem.mutate(item.id);
    onOpenChange(false);
  };

  const handleDelete = (e: React.MouseEvent, item: LibraryItem) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${item.name}" from library?`)) {
      deleteItem.mutate(item.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="library-picker-dialog">
        <DialogHeader>
          <DialogTitle>Library</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="library-picker-toolbar">
          <div className="library-picker-search">
            <Search className="library-picker-search-icon" />
            <Input
              placeholder="Search library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="library-picker-search-input"
            />
          </div>
          {!type && (
            <div className="library-picker-type-toggle">
              {(["ALL", "SECTION", "BLOCK"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`library-picker-type-btn ${
                    activeType === t ? "is-active" : ""
                  }`}
                  onClick={() => setActiveType(t)}
                >
                  {t === "ALL" ? "All" : t === "SECTION" ? "Sections" : "Blocks"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="library-picker-loading">Loading...</div>
        ) : items.length === 0 ? (
          <div className="library-picker-empty">
            <Box className="library-picker-empty-icon" />
            <p className="library-picker-empty-text">
              {search
                ? `No results for "${search}"`
                : "Your library is empty"}
            </p>
            <p className="library-picker-empty-hint">
              Save any section or block to reuse it across pages.
            </p>
          </div>
        ) : (
          <div className="library-picker-grid">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="library-picker-card"
                onClick={() => handleSelect(item)}
                title={item.description ?? item.name}
              >
                {item.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnailUrl}
                    alt={item.name}
                    className="library-picker-thumb"
                  />
                ) : (
                  <div className="library-picker-thumb library-picker-thumb-placeholder">
                    {item.type === "SECTION" ? (
                      <Layers className="size-6" />
                    ) : (
                      <Box className="size-6" />
                    )}
                  </div>
                )}
                <div className="library-picker-meta">
                  <div className="library-picker-name-row">
                    {item.isFavorite && (
                      <Star className="library-picker-fav size-3" />
                    )}
                    <span className="library-picker-name">{item.name}</span>
                  </div>
                  <span className="library-picker-type">
                    {item.type.toLowerCase()}
                    {item.usageCount > 0 && ` · used ${item.usageCount}×`}
                  </span>
                </div>
                {item.scope === "TENANT" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="library-picker-delete"
                    onClick={(e) => handleDelete(e, item)}
                    title="Delete from library"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
