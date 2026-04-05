"use client";
/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */

import * as React from "react";
import {
  useAssets,
  useUploadAsset,
  useUpdateAsset,
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
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
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
} from "lucide-react";

import { ImageEditor } from "@/components/ui/media-library/image-editor";
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
  const [editingImage, setEditingImage] = React.useState<Asset | null>(null);

  // Queries
  const { data: assets, isLoading, error } = useAssets(id);
  const uploadAsset = useUploadAsset(id);
  const updateAsset = useUpdateAsset(id);
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
          <span className="media-toolbar-count">
            {filteredAssets.length} {filteredAssets.length !== (assets?.length || 0) ? `of ${assets?.length || 0}` : ""} items
          </span>
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

      {/* Attachment Details — WordPress-style full-screen overlay */}
      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <DialogContent className="media-attachment-dialog">
          {selectedAsset && (
            <>
              {/* Header */}
              <div className="media-attachment-header">
                <h2 className="media-attachment-title">Attachment details</h2>
                <div className="media-attachment-nav">
                  <Button variant="ghost" size="icon" className="h-8 w-8"
                    onClick={() => { const i = filteredAssets.findIndex((a) => a.id === selectedAsset.id); if (i > 0) setSelectedAsset(filteredAssets[i - 1]); }}
                    disabled={filteredAssets.findIndex((a) => a.id === selectedAsset.id) <= 0}
                  >←</Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"
                    onClick={() => { const i = filteredAssets.findIndex((a) => a.id === selectedAsset.id); if (i < filteredAssets.length - 1) setSelectedAsset(filteredAssets[i + 1]); }}
                    disabled={filteredAssets.findIndex((a) => a.id === selectedAsset.id) >= filteredAssets.length - 1}
                  >→</Button>
                </div>
              </div>

              {/* Split layout: image left, fields right */}
              <div className="media-attachment-body">
                {/* Left: Image preview */}
                <div className="media-attachment-preview">
                  {selectedAsset.mimeType?.startsWith("image/") ? (
                    <img src={selectedAsset.url} alt={selectedAsset.altText || selectedAsset.fileName} />
                  ) : (
                    <div className="media-attachment-file-icon">
                      {React.createElement(getFileIcon(selectedAsset.fileType), { className: "h-16 w-16" })}
                      <span>{selectedAsset.fileType}</span>
                    </div>
                  )}
                  {selectedAsset.mimeType?.startsWith("image/") && (
                    <Button variant="outline" size="sm" className="media-attachment-edit-btn" onClick={() => setEditingImage(selectedAsset)}>
                      Edit Image
                    </Button>
                  )}
                </div>

                {/* Right: Metadata + editable fields */}
                <div className="media-attachment-sidebar">
                  {/* Read-only metadata */}
                  <div className="media-attachment-meta">
                    <p><strong>Uploaded on:</strong> {selectedAsset.createdAt ? new Date(selectedAsset.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Unknown"}</p>
                    <p><strong>File name:</strong> {selectedAsset.fileName}</p>
                    <p><strong>File type:</strong> {selectedAsset.mimeType || selectedAsset.fileType}</p>
                    <p><strong>File size:</strong> {formatFileSize(selectedAsset.sizeBytes)}</p>
                    {selectedAsset.width && selectedAsset.height && (
                      <p><strong>Dimensions:</strong> {selectedAsset.width} × {selectedAsset.height} pixels</p>
                    )}
                  </div>

                  {/* Editable fields */}
                  <div className="media-attachment-fields">
                    <div className="media-attachment-field">
                      <label>Alternative Text</label>
                      <textarea
                        value={selectedAsset.altText || ""}
                        onChange={(e) => setSelectedAsset({ ...selectedAsset, altText: e.target.value })}
                        onBlur={() => updateAsset.mutate({ id: selectedAsset.id, data: { altText: selectedAsset.altText } })}
                        placeholder="Describe this image for accessibility"
                        rows={2}
                      />
                      <span className="media-attachment-hint">
                        Describe the purpose of the image. Leave empty if purely decorative.
                      </span>
                    </div>
                    <div className="media-attachment-field">
                      <label>Title</label>
                      <Input
                        value={selectedAsset.title || ""}
                        onChange={(e) => setSelectedAsset({ ...selectedAsset, title: e.target.value })}
                        onBlur={() => updateAsset.mutate({ id: selectedAsset.id, data: { title: selectedAsset.title } })}
                        className="h-8 text-[13px]"
                      />
                    </div>
                    <div className="media-attachment-field">
                      <label>Caption</label>
                      <textarea
                        value={selectedAsset.caption || ""}
                        onChange={(e) => setSelectedAsset({ ...selectedAsset, caption: e.target.value })}
                        onBlur={() => updateAsset.mutate({ id: selectedAsset.id, data: { caption: selectedAsset.caption } })}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* File URL */}
                  <div className="media-attachment-field">
                    <label>File URL</label>
                    <div className="media-attachment-url">
                      <Input value={selectedAsset.url} readOnly className="h-8 text-[13px]" />
                      <Button variant="outline" size="sm" onClick={() => handleCopyUrl(selectedAsset.url)}>
                        Copy URL to clipboard
                      </Button>
                    </div>
                  </div>

                  {/* Replace media */}
                  <div className="media-attachment-field">
                    <label>Replace media</label>
                    <Button variant="outline" size="sm" onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*,video/*,audio/*";
                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file) return;
                        try { await uploadAsset.mutateAsync({ file }); handleDelete(selectedAsset); toast.success("Media replaced"); }
                        catch { toast.error("Failed to replace media"); }
                      };
                      input.click();
                    }}>
                      Upload a new file
                    </Button>
                  </div>

                  {/* Bottom links */}
                  <div className="media-attachment-links">
                    <a href={selectedAsset.url} target="_blank" rel="noopener noreferrer">Download file</a>
                    <span>|</span>
                    <button type="button" onClick={() => handleDelete(selectedAsset)} className="media-attachment-delete">
                      Delete permanently
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Editor */}
      <ImageEditor
        open={!!editingImage}
        onOpenChange={(open) => !open && setEditingImage(null)}
        imageUrl={editingImage?.url || ""}
        fileName={editingImage?.fileName || "edited.jpg"}
        onSave={async (blob, filename) => {
          try {
            const file = new File([blob], filename, { type: "image/jpeg" });
            await uploadAsset.mutateAsync({ file });
            toast.success("Edited image saved");
            setEditingImage(null);
          } catch {
            toast.error("Failed to save edited image");
          }
        }}
      />
    </div>
  );
}
