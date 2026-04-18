"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Upload, X } from "lucide-react";
import {
  useAssets,
  useUploadAsset,
  type Asset,
  type MediaTypeFilter,
} from "@/lib/hooks/use-assets";
import { AssetCard } from "../asset-card";
import { EmptyState } from "../empty-state";
import { UploadDropzone } from "../upload-dropzone";
import { UploadQueue } from "../upload-queue";
import { useMediaUploadQueue } from "../hooks/use-media-upload-queue";
import "./media-picker.css";

export interface MediaPickerProps {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: Asset) => void;
  /** Filter by file type */
  fileType?: "image" | "video" | "audio" | "document";
  /** Dialog title */
  title?: string;
  /** Currently selected URL, for active state */
  currentUrl?: string;
  /** Multi-select: returns array via onSelectMany */
  multiple?: boolean;
  onSelectMany?: (assets: Asset[]) => void;
}

const TYPE_MAP: Record<
  Exclude<NonNullable<MediaPickerProps["fileType"]>, undefined>,
  MediaTypeFilter
> = {
  image: "IMAGE",
  video: "VIDEO",
  audio: "AUDIO",
  document: "DOCUMENT",
};

/**
 * Compact media picker dialog — reuses AssetCard + AssetGrid from the master
 * library so visuals (BlurHash, dominant-color backgrounds, variant thumbnails)
 * stay consistent across builder surfaces.
 */
export function MediaPicker({
  tenantId,
  open,
  onOpenChange,
  onSelect,
  onSelectMany,
  fileType,
  title = "Select media",
  currentUrl,
  multiple = false,
}: MediaPickerProps) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 200);
    return () => clearTimeout(t);
  }, [search]);

  React.useEffect(() => {
    if (!open) {
      setSelectedIds(new Set());
      setSearch("");
    }
  }, [open]);

  const { data: assets, isLoading } = useAssets(tenantId, {
    type: fileType ? TYPE_MAP[fileType] : undefined,
    search: debouncedSearch || undefined,
    pageSize: 100,
  });

  const uploadMutation = useUploadAsset(tenantId);
  const uploadQueue = useMediaUploadQueue(uploadMutation, { concurrency: 3 });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCardClick = (asset: Asset) => {
    if (multiple) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(asset.id)) next.delete(asset.id);
        else next.add(asset.id);
        return next;
      });
    } else {
      onSelect(asset);
      onOpenChange(false);
    }
  };

  const handleMultiConfirm = () => {
    const list = (assets ?? []).filter((a) => selectedIds.has(a.id));
    onSelectMany?.(list);
    onOpenChange(false);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) uploadQueue.enqueue(files);
    e.target.value = "";
  };

  const activeId = React.useMemo(() => {
    if (!currentUrl || !assets) return null;
    return assets.find((a) => a.url === currentUrl)?.id ?? null;
  }, [currentUrl, assets]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-slot="media-picker">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFilesSelected}
          accept={fileType ? `${fileType}/*` : undefined}
        />

        <div data-slot="media-picker-toolbar">
          <div data-slot="media-picker-search">
            <Search aria-hidden="true" />
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                data-slot="media-picker-search-clear"
                aria-label="Clear search"
              >
                <X aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload aria-hidden="true" />
            Upload
          </Button>
        </div>

        <UploadDropzone onDrop={(files) => uploadQueue.enqueue(files)}>
          <div data-slot="media-picker-body">
            {isLoading ? (
              <div data-slot="media-picker-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} data-slot="media-picker-skeleton" />
                ))}
              </div>
            ) : (assets ?? []).length === 0 ? (
              <EmptyState
                variant={debouncedSearch ? "no-results" : "empty"}
                onUploadClick={() => fileInputRef.current?.click()}
              />
            ) : (
              <div data-slot="media-picker-grid">
                {(assets ?? []).map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    selected={selectedIds.has(asset.id)}
                    active={activeId === asset.id}
                    density="comfortable"
                    onSelect={() => handleCardClick(asset)}
                    onActivate={() => handleCardClick(asset)}
                  />
                ))}
              </div>
            )}
          </div>
        </UploadDropzone>

        {multiple ? (
          <footer data-slot="media-picker-footer">
            <span>{selectedIds.size} selected</span>
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleMultiConfirm}
                disabled={selectedIds.size === 0}
              >
                Insert
              </Button>
            </div>
          </footer>
        ) : null}

        <UploadQueue
          jobs={uploadQueue.jobs}
          completedCount={uploadQueue.completedCount}
          totalCount={uploadQueue.totalCount}
          isActive={uploadQueue.isActive}
          onRemove={uploadQueue.remove}
          onClear={uploadQueue.clear}
        />
      </DialogContent>
    </Dialog>
  );
}
