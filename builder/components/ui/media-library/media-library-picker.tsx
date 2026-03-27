"use client";
/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Loader2,
  Check,
  Grid3X3,
  List,
} from "lucide-react";
import { useAssets, useUploadAsset, type Asset } from "@/lib/hooks/use-assets";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import "./media-library-picker.css";

// =============================================================================
// Types
// =============================================================================

interface MediaLibraryPickerProps {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: Asset) => void;
  /** Filter by file type */
  fileType?: "image" | "video" | "audio" | "document";
  /** Current selected asset URL */
  currentUrl?: string;
  /** Dialog title */
  title?: string;
}

// =============================================================================
// Media Library Picker Component
// =============================================================================

export function MediaLibraryPicker({
  tenantId,
  open,
  onOpenChange,
  onSelect,
  fileType = "image",
  currentUrl,
  title = "Select Media",
}: MediaLibraryPickerProps) {
  const [search, setSearch] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch assets
  const { data: assets, isLoading } = useAssets(tenantId, { fileType });
  const uploadAsset = useUploadAsset(tenantId);

  // Filter assets by search
  const filteredAssets = React.useMemo(() => {
    if (!assets) return [];
    if (!search) return assets;
    const searchLower = search.toLowerCase();
    return assets.filter(
      (asset) =>
        asset.fileName.toLowerCase().includes(searchLower) ||
        asset.altText?.toLowerCase().includes(searchLower),
    );
  }, [assets, search]);

  // Handle file upload
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const asset = await uploadAsset.mutateAsync({ file });
        toast.success(`${file.name} uploaded`);
        setSelectedAsset(asset);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  // Handle drag and drop
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
    handleUpload(e.dataTransfer.files);
  };

  // Handle selection confirm
  const handleConfirm = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onOpenChange(false);
    }
  };

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedAsset(null);
      setSearch("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="media-library-dialog">
        <DialogHeader>
          <DialogTitle className="media-library-title">
            <ImageIcon className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="media-library-tabs">
          <TabsList className="media-library-tabs-list">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          {/* Library Tab */}
          <TabsContent value="library" className="media-library-content">
            {/* Search & View Toggle */}
            <div className="media-library-toolbar">
              <div className="media-library-search">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Search media..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="media-library-search-input"
                />
              </div>
              <div className="media-library-view-toggle">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
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

            {/* Assets Grid/List */}
            {isLoading ? (
              <div className="media-library-loading">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span>Loading media...</span>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="media-library-empty">
                <ImageIcon className="h-12 w-12" />
                <p>No media found</p>
                <span>Upload some files to get started</span>
              </div>
            ) : (
              <div
                className={cn(
                  "media-library-assets",
                  viewMode === "grid"
                    ? "media-library-assets-grid"
                    : "media-library-assets-list",
                )}
              >
                {filteredAssets.map((asset) => (
                  <AssetItem
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAsset?.id === asset.id}
                    isCurrent={currentUrl === asset.url}
                    viewMode={viewMode}
                    onClick={() => setSelectedAsset(asset)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="media-library-content">
            <div
              className={cn(
                "media-library-dropzone",
                isDragging && "media-library-dropzone-active",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={
                  fileType === "image"
                    ? "image/*"
                    : fileType === "video"
                      ? "video/*"
                      : fileType === "audio"
                        ? "audio/*"
                        : "*/*"
                }
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
              {uploadAsset.isPending ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12" />
                  <p>Drop files here or click to upload</p>
                  <span>Supports: JPG, PNG, GIF, SVG, WebP</span>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="media-library-footer">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedAsset}>
            <Check className="h-4 w-4" />
            Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// Asset Item Component
// =============================================================================

interface AssetItemProps {
  asset: Asset;
  isSelected: boolean;
  isCurrent: boolean;
  viewMode: "grid" | "list";
  onClick: () => void;
}

function AssetItem({
  asset,
  isSelected,
  isCurrent,
  viewMode,
  onClick,
}: AssetItemProps) {
  const isImage = asset.mimeType?.startsWith("image/");

  if (viewMode === "list") {
    return (
      <button
        className={cn(
          "media-library-asset-list-item",
          isSelected && "media-library-asset-selected",
          isCurrent && "media-library-asset-current",
        )}
        onClick={onClick}
      >
        <div className="media-library-asset-list-thumb">
          {isImage ? (
            <img
              src={asset.thumbnailUrl || asset.url}
              alt={asset.altText || asset.fileName}
            />
          ) : (
            <ImageIcon className="h-6 w-6" />
          )}
        </div>
        <div className="media-library-asset-list-info">
          <span className="media-library-asset-list-name">
            {asset.fileName}
          </span>
          <span className="media-library-asset-list-meta">
            {asset.width && asset.height
              ? `${asset.width}×${asset.height}`
              : formatBytes(asset.sizeBytes)}
          </span>
        </div>
        {isSelected && <Check className="h-4 w-4 text-[var(--accent-primary)]" />}
        {isCurrent && !isSelected && (
          <span className="media-library-asset-current-badge">Current</span>
        )}
      </button>
    );
  }

  return (
    <button
      className={cn(
        "media-library-asset-grid-item",
        isSelected && "media-library-asset-selected",
        isCurrent && "media-library-asset-current",
      )}
      onClick={onClick}
    >
      {isImage ? (
        <img
          src={asset.thumbnailUrl || asset.url}
          alt={asset.altText || asset.fileName}
          className="media-library-asset-grid-image"
        />
      ) : (
        <div className="media-library-asset-grid-placeholder">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}
      {isSelected && (
        <div className="media-library-asset-check">
          <Check className="h-4 w-4" />
        </div>
      )}
      {isCurrent && !isSelected && (
        <div className="media-library-asset-current-indicator">Current</div>
      )}
    </button>
  );
}

// =============================================================================
// Utilities
// =============================================================================

function formatBytes(bytes?: number): string {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
