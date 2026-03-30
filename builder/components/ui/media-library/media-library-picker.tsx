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
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
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

          {/* URL Import Tab */}
          <TabsContent value="url" className="media-library-content">
            <UrlImportTab
              onSelect={(asset) => {
                setSelectedAsset(asset);
                onSelect(asset);
                onOpenChange(false);
              }}
            />
          </TabsContent>

          {/* Stock Photos Tab */}
          <TabsContent value="stock" className="media-library-content">
            <StockPhotosTab
              onSelect={(url) => {
                const asset: Asset = {
                  id: `stock-${Date.now()}`,
                  tenantId,
                  fileKey: url,
                  fileName: url.split("/").pop() || "stock-photo",
                  fileType: "image",
                  url,
                };
                onSelect(asset);
                onOpenChange(false);
              }}
            />
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
        {isSelected && <Check className="h-4 w-4 text-(--accent-primary)" />}
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

// =============================================================================
// URL Import Tab
// =============================================================================

function UrlImportTab({ onSelect }: { onSelect: (asset: Asset) => void }) {
  const [url, setUrl] = React.useState("");
  const [preview, setPreview] = React.useState("");

  const handlePaste = (value: string) => {
    setUrl(value);
    // Show preview for image URLs
    if (value.match(/\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i) || value.startsWith("data:image")) {
      setPreview(value);
    } else {
      setPreview("");
    }
  };

  const handleImport = () => {
    if (!url) return;
    onSelect({
      id: `url-${Date.now()}`,
      tenantId: "",
      fileKey: url,
      fileName: url.split("/").pop()?.split("?")[0] || "imported-image",
      fileType: "image",
      url,
    });
  };

  return (
    <div className="media-library-url-tab">
      <p className="media-library-url-desc">
        Paste an image URL to use it directly
      </p>
      <Input
        value={url}
        onChange={(e) => handlePaste(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="h-9 text-[13px]"
      />
      {preview && (
         
        <img src={preview} alt="Preview" className="media-library-url-preview" />
      )}
      <Button onClick={handleImport} disabled={!url} className="w-full">
        Use This Image
      </Button>
    </div>
  );
}

// =============================================================================
// Stock Photos Tab (Pexels)
// =============================================================================

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || "";

interface PexelsPhoto {
  id: number;
  src: { medium: string; large: string; original: string };
  alt: string;
  photographer: string;
}

function StockPhotosTab({ onSelect }: { onSelect: (url: string) => void }) {
  const [query, setQuery] = React.useState("");
  const [photos, setPhotos] = React.useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  const searchPhotos = async () => {
    if (!query.trim()) return;

    if (!PEXELS_API_KEY) {
      // Fallback: use Unsplash Source (no API key needed)
      const unsplashPhotos: PexelsPhoto[] = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        src: {
          medium: `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}&sig=${i}`,
          large: `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&sig=${i}`,
          original: `https://source.unsplash.com/1200x800/?${encodeURIComponent(query)}&sig=${i}`,
        },
        alt: `${query} stock photo ${i + 1}`,
        photographer: "Unsplash",
      }));
      setPhotos(unsplashPhotos);
      setSearched(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`,
        { headers: { Authorization: PEXELS_API_KEY } },
      );
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="media-library-stock-tab">
      <div className="media-library-stock-search">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search free stock photos..."
          className="h-9 text-[13px] flex-1"
          onKeyDown={(e) => e.key === "Enter" && searchPhotos()}
        />
        <Button onClick={searchPhotos} disabled={loading || !query.trim()} size="sm">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        </Button>
      </div>

      {!searched && (
        <div className="media-library-empty">
          <ImageIcon className="h-10 w-10" />
          <p>Search for free stock photos</p>
          <span>{PEXELS_API_KEY ? "Powered by Pexels" : "Powered by Unsplash"}</span>
        </div>
      )}

      {searched && photos.length === 0 && (
        <div className="media-library-empty">
          <p>No photos found</p>
          <span>Try a different search term</span>
        </div>
      )}

      {photos.length > 0 && (
        <div className="media-library-assets media-library-assets-grid">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              className="media-library-asset-grid-item"
              onClick={() => onSelect(photo.src.large)}
              title={`${photo.alt} by ${photo.photographer}`}
            >
              { }
              <img
                src={photo.src.medium}
                alt={photo.alt}
                className="media-library-asset-grid-image"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <p className="media-library-stock-credit">
        {PEXELS_API_KEY ? "Photos provided by Pexels" : "Photos provided by Unsplash"}
      </p>
    </div>
  );
}

function formatBytes(bytes?: number): string {
  if (!bytes) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
