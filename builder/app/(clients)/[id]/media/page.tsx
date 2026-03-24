"use client";
/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */

import * as React from "react";
import {
  useAssets,
  useUploadAsset,
  useDeleteAsset,
  type Asset,
} from "@/lib/hooks/use-assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Upload,
  Search,
  Image,
  FileVideo,
  FileAudio,
  FileText,
  Loader2,
  Check,
  Copy,
  ExternalLink,
  Trash2,
} from "lucide-react";

import "./media.css";

// =============================================================================
// Types
// =============================================================================

type FileTypeFilter = "all" | "image" | "video" | "audio" | "document";

// =============================================================================
// Media Library Page
// =============================================================================

export default function MediaLibraryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  // State
  const [search, setSearch] = React.useState("");
  const [fileTypeFilter, setFileTypeFilter] =
    React.useState<FileTypeFilter>("all");
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = React.useState(false);

  // Queries
  const { data: assets, isLoading, error } = useAssets(id);
  const uploadAsset = useUploadAsset(id);
  const deleteAsset = useDeleteAsset(id);

  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // Filtered assets
  // ---------------------------------------------------------------------------

  const filteredAssets = React.useMemo(() => {
    if (!assets) return [];
    return assets.filter((asset) => {
      // File type filter
      if (fileTypeFilter !== "all" && asset.fileType !== fileTypeFilter) {
        return false;
      }
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        return (
          asset.fileName.toLowerCase().includes(q) ||
          asset.altText?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assets, search, fileTypeFilter]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        await uploadAsset.mutateAsync({ file });
        toast.success(`${file.name} uploaded`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      try {
        await uploadAsset.mutateAsync({ file });
        toast.success(`${file.name} uploaded`);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    });
  };

  const handleDelete = (asset: Asset) => {
    if (confirm(`Delete "${asset.fileName}"?`)) {
      deleteAsset.mutate(asset.id, {
        onSuccess: () => {
          toast.success("Asset deleted");
          setSelectedAsset(null);
        },
      });
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const toggleSelect = (assetId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(assetId)) {
        next.delete(assetId);
      } else {
        next.add(assetId);
      }
      return next;
    });
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "video":
        return FileVideo;
      case "audio":
        return FileAudio;
      default:
        return FileText;
    }
  };

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className="media-page">
        <div className="settings-error">
          <p>Error loading media: {error.message}</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="media-page">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Upload Zone */}
      <div
        className={cn(
          "media-upload-zone",
          isDragging && "media-upload-zone-active",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploadAsset.isPending ? (
          <>
            <Loader2 className="media-upload-zone-icon animate-spin" />
            <span className="media-upload-zone-text">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="media-upload-zone-icon" />
            <span className="media-upload-zone-text">
              Drop files here or click to upload
            </span>
            <span className="media-upload-zone-hint">
              JPG, PNG, GIF, SVG, WebP, PDF, and more
            </span>
          </>
        )}
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="media-toolbar">
        <div className="media-toolbar-search">
          <Search className="media-toolbar-search-icon" />
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="media-toolbar-search-input"
          />
        </div>
        <div className="media-toolbar-filters">
          <Select
            value={fileTypeFilter}
            onValueChange={(v) => setFileTypeFilter(v as FileTypeFilter)}
          >
            <SelectTrigger className="media-toolbar-filter-select">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="media-skeleton-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="media-skeleton-thumb" />
          ))}
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="media-empty">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image className="media-empty-icon" />
          <h3>No media found</h3>
          <p>
            {search || fileTypeFilter !== "all"
              ? "Try adjusting your filters"
              : "Upload some files to get started"}
          </p>
          {!search && fileTypeFilter === "all" && (
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          )}
        </div>
      ) : (
        <div className="media-grid">
          <div className="media-grid-inner">
            {filteredAssets.map((asset) => {
              const isImage = asset.mimeType?.startsWith("image/");
              const isSelected = selectedIds.has(asset.id);
              const FileIcon = getFileIcon(asset.fileType);

              return (
                <button
                  key={asset.id}
                  className={cn(
                    "media-thumb",
                    isSelected && "media-thumb-selected",
                  )}
                  onClick={() => setSelectedAsset(asset)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    toggleSelect(asset.id);
                  }}
                >
                  {isImage ? (
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.altText || asset.fileName}
                      className="media-thumb-image"
                    />
                  ) : (
                    <div className="media-thumb-overlay">
                      <FileIcon className="media-thumb-overlay-icon" />
                      <span className="media-thumb-overlay-label">
                        {asset.fileType}
                      </span>
                    </div>
                  )}
                  <span className="media-thumb-name">{asset.fileName}</span>
                  {isSelected && (
                    <span className="media-thumb-check">
                      <Check />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <Sheet
        open={!!selectedAsset}
        onOpenChange={(open) => !open && setSelectedAsset(null)}
      >
        <SheetContent>
          {selectedAsset && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedAsset.fileName}</SheetTitle>
              </SheetHeader>

              <div className="media-detail-preview">
                {selectedAsset.mimeType?.startsWith("image/") ? (
                  <img
                    src={selectedAsset.url}
                    alt={selectedAsset.altText || selectedAsset.fileName}
                  />
                ) : (
                  <div className="media-thumb-overlay">
                    {React.createElement(getFileIcon(selectedAsset.fileType), {
                      className: "media-thumb-overlay-icon",
                    })}
                    <span className="media-thumb-overlay-label">
                      {selectedAsset.fileType}
                    </span>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="media-detail-meta">
                <div>
                  <p className="media-detail-meta-label">File Type</p>
                  <p className="media-detail-meta-value">
                    {selectedAsset.fileType}
                  </p>
                </div>
                <div>
                  <p className="media-detail-meta-label">File Size</p>
                  <p className="media-detail-meta-value">
                    {formatFileSize(selectedAsset.sizeBytes)}
                  </p>
                </div>
                {selectedAsset.width && selectedAsset.height && (
                  <div>
                    <p className="media-detail-meta-label">Dimensions</p>
                    <p className="media-detail-meta-value">
                      {selectedAsset.width} x {selectedAsset.height}
                    </p>
                  </div>
                )}
                {selectedAsset.altText && (
                  <div>
                    <p className="media-detail-meta-label">Alt Text</p>
                    <p className="media-detail-meta-value">
                      {selectedAsset.altText}
                    </p>
                  </div>
                )}
              </div>

              {/* URL */}
              <div className="media-detail-url">
                <p className="media-detail-url-label">URL</p>
                <div className="media-detail-url-row">
                  <Input
                    value={selectedAsset.url}
                    readOnly
                    className="media-detail-url-input"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyUrl(selectedAsset.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(selectedAsset.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="media-detail-actions">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAsset(null)}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedAsset)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
