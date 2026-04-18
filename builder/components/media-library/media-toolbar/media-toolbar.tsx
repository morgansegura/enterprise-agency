"use client";

import * as React from "react";
import {
  LayoutGrid,
  List as ListIcon,
  Search,
  Upload,
  ArrowDownUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MediaTypeFilter } from "@/lib/hooks/use-assets";
import type { GridDensity } from "../asset-grid";
import "./media-toolbar.css";

export type ViewMode = "grid" | "list";
export type SortBy = "createdAt" | "fileName" | "sizeBytes" | "updatedAt";
export type TypeFilter = "all" | "image" | "video" | "audio" | "document";

interface MediaToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (value: TypeFilter) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  density: GridDensity;
  onDensityChange: (density: GridDensity) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  onUploadClick: () => void;
  totalCount?: number;
}

export const TYPE_FILTER_TO_API: Record<
  Exclude<TypeFilter, "all">,
  MediaTypeFilter
> = {
  image: "IMAGE",
  video: "VIDEO",
  audio: "AUDIO",
  document: "DOCUMENT",
};

export function MediaToolbar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  view,
  onViewChange,
  density,
  onDensityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onUploadClick,
  totalCount,
}: MediaToolbarProps) {
  return (
    <div data-slot="media-toolbar">
      <div data-slot="media-toolbar-search">
        <Search aria-hidden="true" />
        <Input
          placeholder="Search media..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search media"
        />
      </div>

      <div data-slot="media-toolbar-filters">
        <Select
          value={typeFilter}
          onValueChange={(v) => onTypeFilterChange(v as TypeFilter)}
        >
          <SelectTrigger data-slot="media-toolbar-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => onSortByChange(v as SortBy)}>
          <SelectTrigger data-slot="media-toolbar-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date added</SelectItem>
            <SelectItem value="updatedAt">Date modified</SelectItem>
            <SelectItem value="fileName">Name</SelectItem>
            <SelectItem value="sizeBytes">Size</SelectItem>
          </SelectContent>
        </Select>

        <button
          type="button"
          data-slot="media-toolbar-order"
          data-order={sortOrder}
          onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
          aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
        >
          <ArrowDownUp aria-hidden="true" />
        </button>
      </div>

      <div data-slot="media-toolbar-view">
        <button
          type="button"
          data-slot="media-toolbar-view-btn"
          data-active={view === "grid" ? "true" : "false"}
          onClick={() => onViewChange("grid")}
          aria-label="Grid view"
        >
          <LayoutGrid aria-hidden="true" />
        </button>
        <button
          type="button"
          data-slot="media-toolbar-view-btn"
          data-active={view === "list" ? "true" : "false"}
          onClick={() => onViewChange("list")}
          aria-label="List view"
        >
          <ListIcon aria-hidden="true" />
        </button>
        {view === "grid" ? (
          <Select
            value={density}
            onValueChange={(v) => onDensityChange(v as GridDensity)}
          >
            <SelectTrigger data-slot="media-toolbar-density">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
      </div>

      {typeof totalCount === "number" ? (
        <div data-slot="media-toolbar-count" aria-live="polite">
          {totalCount.toLocaleString()} items
        </div>
      ) : null}

      <Button
        data-slot="media-toolbar-upload"
        onClick={onUploadClick}
        size="sm"
      >
        <Upload aria-hidden="true" />
        Upload
      </Button>
    </div>
  );
}
