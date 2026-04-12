"use client";
/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */

import * as React from "react";
import {
  useAssets,
  useUploadAsset,
  useUpdateAsset,
  useDeleteAsset,
  useMoveAsset,
  useBulkMoveAssets,
  useBulkDeleteAssets,
  type Asset,
  type MediaTypeFilter,
} from "@/lib/hooks/use-assets";
import {
  useFolderTree,
  useCreateFolder,
  useDeleteFolder,
  useUpdateFolder,
  type MediaFolder,
} from "@/lib/hooks/use-folders";
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
import { useResolvedTenant } from "@/lib/hooks/use-resolved-tenant";
import {
  Upload,
  Search,
  Image,
  FileVideo,
  FileAudio,
  FileText,
  Loader2,
  Check,
  Folder,
  FolderPlus,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Trash2,
  Pencil,
  X,
  FolderInput,
} from "lucide-react";

import { ImageEditor } from "@/components/ui/media-library/image-editor";
import { ConfirmDialog, PromptDialog } from "@/components/ui/confirm-dialog";
import "./media.css";

// =============================================================================
// Types
// =============================================================================

type FileTypeFilter = "all" | "image" | "video" | "audio" | "document";

const FILTER_TO_MEDIA_TYPE: Record<
  Exclude<FileTypeFilter, "all">,
  MediaTypeFilter
> = {
  image: "IMAGE",
  video: "VIDEO",
  audio: "AUDIO",
  document: "DOCUMENT",
};

// =============================================================================
// Media Library Page
// =============================================================================

export default function MediaLibraryPage() {
  const { tenantId } = useResolvedTenant();
  const id = tenantId!;

  // State
  const [search, setSearch] = React.useState("");
  const [fileTypeFilter, setFileTypeFilter] =
    React.useState<FileTypeFilter>("all");
  const [sortBy, setSortBy] = React.useState<
    "createdAt" | "fileName" | "sizeBytes" | "updatedAt"
  >("createdAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = React.useState(false);
  const [editingImage, setEditingImage] = React.useState<Asset | null>(null);
  /** null = "All Files" view, otherwise a specific folder */
  const [activeFolderId, setActiveFolderId] = React.useState<string | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = React.useState<{
    [name: string]: number;
  }>({});

  // Dialog states (replacing native window.prompt/confirm)
  const [createFolderOpen, setCreateFolderOpen] = React.useState(false);
  const [renameFolderTarget, setRenameFolderTarget] =
    React.useState<MediaFolder | null>(null);
  const [deleteFolderTarget, setDeleteFolderTarget] =
    React.useState<MediaFolder | null>(null);
  const [deleteAssetTarget, setDeleteAssetTarget] =
    React.useState<Asset | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  // Debounce search so we don't refetch on every keystroke
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  // Queries — server-side type, search, sort and folder filtering
  const { data: assets, isLoading, error } = useAssets(id, {
    type:
      fileTypeFilter !== "all"
        ? FILTER_TO_MEDIA_TYPE[fileTypeFilter]
        : undefined,
    search: debouncedSearch || undefined,
    folderId: activeFolderId,
    sortBy,
    sortOrder,
    pageSize: 100,
  });
  const { data: folderTree } = useFolderTree(id);
  const createFolder = useCreateFolder(id);
  const updateFolder = useUpdateFolder(id);
  const deleteFolder = useDeleteFolder(id);
  const uploadAsset = useUploadAsset(id);
  const updateAsset = useUpdateAsset(id);
  const deleteAsset = useDeleteAsset(id);
  const moveAsset = useMoveAsset(id);
  const bulkMoveAssets = useBulkMoveAssets(id);
  const bulkDeleteAssets = useBulkDeleteAssets(id);

  /** ID of folder currently being drag-hovered — for highlight */
  const [dropTargetFolderId, setDropTargetFolderId] = React.useState<
    string | null | undefined
  >(undefined);

  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // Filtered assets
  // ---------------------------------------------------------------------------

  // Server already handles type + search filtering. We still apply an
  // instant client-side search filter so typing feels snappy before the
  // debounced server query refetches.
  const filteredAssets = React.useMemo(() => {
    if (!assets) return [];
    if (!search || search === debouncedSearch) return assets;
    const q = search.toLowerCase();
    return assets.filter(
      (asset) =>
        asset.fileName.toLowerCase().includes(q) ||
        asset.altText?.toLowerCase().includes(q),
    );
  }, [assets, search, debouncedSearch]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const uploadFiles = React.useCallback(
    async (files: File[]) => {
      for (const file of files) {
        setUploadProgress((p) => ({ ...p, [file.name]: 0 }));
        try {
          await uploadAsset.mutateAsync({
            file,
            folderId: activeFolderId ?? undefined,
            onProgress: (percent) =>
              setUploadProgress((p) => ({ ...p, [file.name]: percent })),
          });
          toast.success(`${file.name} uploaded`);
        } catch (err) {
          toast.error(
            `Failed to upload ${file.name}: ${
              err instanceof Error ? err.message : "Unknown error"
            }`,
          );
        } finally {
          setUploadProgress((p) => {
            const next = { ...p };
            delete next[file.name];
            return next;
          });
        }
      }
    },
    [uploadAsset, activeFolderId],
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(Array.from(files));
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
    void uploadFiles(Array.from(files));
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

  const clearSelection = React.useCallback(() => setSelectedIds(new Set()), []);

  const selectAll = React.useCallback(() => {
    setSelectedIds(new Set(filteredAssets.map((a) => a.id)));
  }, [filteredAssets]);

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `Delete ${ids.length} file${ids.length === 1 ? "" : "s"}? This cannot be undone.`,
      )
    )
      return;
    try {
      const result = await bulkDeleteAssets.mutateAsync(ids);
      toast.success(
        `Deleted ${result.successIds.length} file${result.successIds.length === 1 ? "" : "s"}`,
      );
      if (result.failedIds.length > 0) {
        toast.error(`Failed to delete ${result.failedIds.length} file(s)`);
      }
      clearSelection();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk delete failed");
    }
  };

  const handleBulkMove = async (targetFolderId: string | null) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      await bulkMoveAssets.mutateAsync({ mediaIds: ids, folderId: targetFolderId });
      toast.success(
        `Moved ${ids.length} file${ids.length === 1 ? "" : "s"}`,
      );
      clearSelection();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk move failed");
    }
  };

  // Keyboard shortcuts
  // - Escape: clear selection
  // - Delete or Backspace: delete selection (when not typing)
  // - Cmd/Ctrl+A: select all visible assets
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip when typing in an input/textarea/contentEditable
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key === "Escape") {
        if (selectedIds.size > 0) {
          clearSelection();
          e.preventDefault();
        }
        return;
      }

      if (isTyping) return;

      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedIds.size > 0
      ) {
        e.preventDefault();
        void handleBulkDelete();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        selectAll();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // handleBulkDelete is stable by closure; listing only dep signals that matter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds.size, selectAll, clearSelection]);

  // ---------------------------------------------------------------------------
  // Drag & drop — assets into folders
  // ---------------------------------------------------------------------------

  const handleAssetDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    asset: Asset,
  ) => {
    // If the dragged asset is part of the current selection, move all selected;
    // otherwise just move that one asset.
    const ids = selectedIds.has(asset.id)
      ? Array.from(selectedIds)
      : [asset.id];
    e.dataTransfer.setData("application/x-media-ids", JSON.stringify(ids));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleFolderDragOver = (
    e: React.DragEvent,
    folderId: string | null,
  ) => {
    if (!e.dataTransfer.types.includes("application/x-media-ids")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetFolderId(folderId);
  };

  const handleFolderDragLeave = () => setDropTargetFolderId(undefined);

  const handleFolderDrop = async (
    e: React.DragEvent,
    folderId: string | null,
  ) => {
    const raw = e.dataTransfer.getData("application/x-media-ids");
    setDropTargetFolderId(undefined);
    if (!raw) return;
    e.preventDefault();
    let ids: string[];
    try {
      ids = JSON.parse(raw) as string[];
    } catch {
      return;
    }
    if (ids.length === 0) return;
    try {
      if (ids.length === 1) {
        await moveAsset.mutateAsync({ id: ids[0], folderId });
      } else {
        await bulkMoveAssets.mutateAsync({ mediaIds: ids, folderId });
      }
      toast.success(
        `Moved ${ids.length} file${ids.length === 1 ? "" : "s"}`,
      );
      clearSelection();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Move failed");
    }
  };

  // ---------------------------------------------------------------------------
  // Folder helpers
  // ---------------------------------------------------------------------------

  /** Walk the folder tree to find a folder by id (used to show breadcrumb). */
  const findFolder = React.useCallback(
    (folders: MediaFolder[] | undefined, folderId: string): MediaFolder | null => {
      if (!folders) return null;
      for (const f of folders) {
        if (f.id === folderId) return f;
        if (f.children?.length) {
          const found = findFolder(f.children, folderId);
          if (found) return found;
        }
      }
      return null;
    },
    [],
  );

  const activeFolder = activeFolderId
    ? findFolder(folderTree, activeFolderId)
    : null;

  const handleCreateFolder = async () => {
    const name = window.prompt(
      activeFolder
        ? `Create folder inside "${activeFolder.name}"`
        : "Create folder name",
    );
    if (!name?.trim()) return;
    try {
      await createFolder.mutateAsync({
        name: name.trim(),
        parentId: activeFolderId ?? undefined,
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create folder",
      );
    }
  };

  const handleRenameFolder = async (folder: MediaFolder) => {
    const name = window.prompt("Rename folder", folder.name);
    if (!name?.trim() || name.trim() === folder.name) return;
    try {
      await updateFolder.mutateAsync({
        id: folder.id,
        data: { name: name.trim() },
      });
      toast.success("Folder renamed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to rename folder",
      );
    }
  };

  const handleDeleteFolder = async (folder: MediaFolder) => {
    const itemCount =
      (folder._count?.assets ?? 0) + (folder._count?.children ?? 0);
    const message =
      itemCount > 0
        ? `"${folder.name}" contains ${itemCount} item${itemCount === 1 ? "" : "s"}. Delete the folder and all its contents?`
        : `Delete folder "${folder.name}"?`;
    if (!window.confirm(message)) return;
    try {
      await deleteFolder.mutateAsync({
        id: folder.id,
        deleteContents: itemCount > 0,
      });
      if (activeFolderId === folder.id) setActiveFolderId(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete folder",
      );
    }
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

      {/* Folder Sidebar */}
      <aside className="media-sidebar">
        <div className="media-sidebar-header">
          <span className="media-sidebar-title">Folders</span>
          <button
            type="button"
            className="media-sidebar-action"
            onClick={handleCreateFolder}
            title="New folder"
          >
            <FolderPlus className="size-3.5" />
          </button>
        </div>

        <div className="media-sidebar-tree">
          <button
            type="button"
            className={cn(
              "media-folder-item",
              activeFolderId === null && "media-folder-item-active",
              dropTargetFolderId === null && "media-folder-item-drop-target",
            )}
            onClick={() => setActiveFolderId(null)}
            onDragOver={(e) => handleFolderDragOver(e, null)}
            onDragLeave={handleFolderDragLeave}
            onDrop={(e) => handleFolderDrop(e, null)}
          >
            <Folder className="size-3.5" />
            <span>All Files</span>
          </button>

          {(folderTree ?? []).map((folder) => (
            <FolderTreeNode
              key={folder.id}
              folder={folder}
              activeFolderId={activeFolderId}
              dropTargetFolderId={dropTargetFolderId}
              onSelect={setActiveFolderId}
              onRename={handleRenameFolder}
              onDelete={handleDeleteFolder}
              onDragOver={handleFolderDragOver}
              onDragLeave={handleFolderDragLeave}
              onDrop={handleFolderDrop}
              depth={0}
            />
          ))}
        </div>
      </aside>

      {/* Main column */}
      <div className="media-main">
      {/* Breadcrumb */}
      <div className="media-breadcrumb">
        <button
          type="button"
          className="media-breadcrumb-link"
          onClick={() => setActiveFolderId(null)}
        >
          All Files
        </button>
        {activeFolder && (
          <>
            <ChevronRight className="size-3 text-(--el-400)" />
            <span className="media-breadcrumb-current">
              {activeFolder.name}
            </span>
          </>
        )}
      </div>

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
            {Object.entries(uploadProgress).length > 0 && (
              <div className="media-upload-progress-list">
                {Object.entries(uploadProgress).map(([name, percent]) => (
                  <div key={name} className="media-upload-progress-row">
                    <span className="media-upload-progress-name">{name}</span>
                    <div className="media-upload-progress-bar">
                      <div
                        className="media-upload-progress-bar-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="media-upload-progress-pct">
                      {percent}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <Upload className="media-upload-zone-icon" />
            <span className="media-upload-zone-text">
              {activeFolder
                ? `Drop files into "${activeFolder.name}"`
                : "Drop files here or click to upload"}
            </span>
            <span className="media-upload-zone-hint">
              JPG, PNG, GIF, SVG, WebP, PDF, and more
            </span>
          </>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="media-bulk-bar">
          <span className="media-bulk-count">
            {selectedIds.size} of {filteredAssets.length} selected
          </span>
          <div className="media-bulk-actions">
            {selectedIds.size < filteredAssets.length && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[12px]"
                onClick={selectAll}
              >
                Select all
              </Button>
            )}
            <Select
              value=""
              onValueChange={(v) =>
                handleBulkMove(v === "__root__" ? null : v)
              }
            >
              <SelectTrigger className="h-7 text-[12px] w-[180px]">
                <FolderInput className="size-3" />
                <SelectValue placeholder="Move to folder..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__root__">All Files (root)</SelectItem>
                {flattenFolders(folderTree ?? []).map(({ folder, depth }) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {"\u00A0".repeat(depth * 2)}
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[12px]"
              onClick={handleBulkDelete}
              disabled={bulkDeleteAssets.isPending}
            >
              <Trash2 className="size-3" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-[12px]"
              onClick={clearSelection}
            >
              <X className="size-3" />
              Clear
            </Button>
          </div>
        </div>
      )}

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

          <Select
            value={`${sortBy}:${sortOrder}`}
            onValueChange={(v) => {
              const [by, order] = v.split(":") as [
                typeof sortBy,
                typeof sortOrder,
              ];
              setSortBy(by);
              setSortOrder(order);
            }}
          >
            <SelectTrigger className="media-toolbar-filter-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt:desc">Newest first</SelectItem>
              <SelectItem value="createdAt:asc">Oldest first</SelectItem>
              <SelectItem value="fileName:asc">Name (A–Z)</SelectItem>
              <SelectItem value="fileName:desc">Name (Z–A)</SelectItem>
              <SelectItem value="sizeBytes:desc">Largest first</SelectItem>
              <SelectItem value="sizeBytes:asc">Smallest first</SelectItem>
              <SelectItem value="updatedAt:desc">Recently modified</SelectItem>
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
                  draggable
                  onDragStart={(e) => handleAssetDragStart(e, asset)}
                  onClick={(e) => {
                    // Cmd/Ctrl or Shift click → toggle selection
                    // Plain click → open details dialog
                    if (e.metaKey || e.ctrlKey || e.shiftKey) {
                      toggleSelect(asset.id);
                    } else if (selectedIds.size > 0) {
                      // When in selection mode, single click toggles too
                      toggleSelect(asset.id);
                    } else {
                      setSelectedAsset(asset);
                    }
                  }}
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
                      draggable={false}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*,video/*,audio/*";
                        input.onchange = async (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (!file) return;
                          try {
                            // Upload to the same folder, carry over title/alt/caption
                            const newAsset = await uploadAsset.mutateAsync({
                              file,
                              folderId: selectedAsset.folderId ?? undefined,
                              title: selectedAsset.title,
                              altText: selectedAsset.altText,
                            });
                            if (
                              selectedAsset.caption ||
                              selectedAsset.tags?.length ||
                              selectedAsset.usageContext
                            ) {
                              await updateAsset.mutateAsync({
                                id: newAsset.id,
                                data: {
                                  caption: selectedAsset.caption,
                                  tags: selectedAsset.tags,
                                  usageContext: selectedAsset.usageContext,
                                },
                              });
                            }
                            // Delete the original and close the details dialog
                            await deleteAsset.mutateAsync(selectedAsset.id);
                            setSelectedAsset(null);
                            toast.success("Media replaced");
                          } catch (err) {
                            toast.error(
                              err instanceof Error
                                ? err.message
                                : "Failed to replace media",
                            );
                          }
                        };
                        input.click();
                      }}
                    >
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
          if (!editingImage) return;
          try {
            const file = new File([blob], filename, { type: "image/jpeg" });
            // Upload the edited image into the same folder as the original
            const newAsset = await uploadAsset.mutateAsync({
              file,
              folderId: editingImage.folderId ?? undefined,
              altText: editingImage.altText,
              title: editingImage.title,
            });
            // Copy caption/tags/usageContext from original onto the new asset
            if (
              editingImage.caption ||
              editingImage.tags?.length ||
              editingImage.usageContext
            ) {
              await updateAsset.mutateAsync({
                id: newAsset.id,
                data: {
                  caption: editingImage.caption,
                  tags: editingImage.tags,
                  usageContext: editingImage.usageContext,
                },
              });
            }
            toast.success("Edited image saved");
            setEditingImage(null);
          } catch (err) {
            toast.error(
              err instanceof Error
                ? err.message
                : "Failed to save edited image",
            );
          }
        }}
      />
      </div>
    </div>
  );
}

// =============================================================================
// Helpers
// =============================================================================

/** Flatten a folder tree into [{folder, depth}] for dropdowns. */
function flattenFolders(
  folders: MediaFolder[],
  depth = 0,
): Array<{ folder: MediaFolder; depth: number }> {
  const out: Array<{ folder: MediaFolder; depth: number }> = [];
  for (const f of folders) {
    out.push({ folder: f, depth });
    if (f.children?.length) {
      out.push(...flattenFolders(f.children, depth + 1));
    }
  }
  return out;
}

// =============================================================================
// FolderTreeNode — recursive folder list item with rename/delete/drop actions
// =============================================================================

interface FolderTreeNodeProps {
  folder: MediaFolder;
  activeFolderId: string | null;
  dropTargetFolderId: string | null | undefined;
  depth: number;
  onSelect: (id: string) => void;
  onRename: (folder: MediaFolder) => void;
  onDelete: (folder: MediaFolder) => void;
  onDragOver: (e: React.DragEvent, folderId: string | null) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, folderId: string | null) => void;
}

function FolderTreeNode({
  folder,
  activeFolderId,
  dropTargetFolderId,
  depth,
  onSelect,
  onRename,
  onDelete,
  onDragOver,
  onDragLeave,
  onDrop,
}: FolderTreeNodeProps) {
  const [expanded, setExpanded] = React.useState(true);
  const isActive = activeFolderId === folder.id;
  const isDropTarget = dropTargetFolderId === folder.id;
  const hasChildren = (folder.children?.length ?? 0) > 0;
  const itemCount = folder._count?.assets ?? 0;

  return (
    <div className="media-folder-node">
      <div
        className={cn(
          "media-folder-item",
          isActive && "media-folder-item-active",
          isDropTarget && "media-folder-item-drop-target",
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
        onDragOver={(e) => onDragOver(e, folder.id)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, folder.id)}
      >
        {hasChildren ? (
          <button
            type="button"
            className="media-folder-toggle"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronDown className="size-3" />
            ) : (
              <ChevronRight className="size-3" />
            )}
          </button>
        ) : (
          <span className="media-folder-toggle-spacer" />
        )}
        <button
          type="button"
          className="media-folder-label"
          onClick={() => onSelect(folder.id)}
        >
          {isActive ? (
            <FolderOpen className="size-3.5" />
          ) : (
            <Folder className="size-3.5" />
          )}
          <span className="media-folder-name">{folder.name}</span>
          {itemCount > 0 && (
            <span className="media-folder-count">{itemCount}</span>
          )}
        </button>
        <div className="media-folder-actions">
          <button
            type="button"
            className="media-folder-action"
            onClick={() => onRename(folder)}
            title="Rename"
          >
            <Pencil className="size-3" />
          </button>
          <button
            type="button"
            className="media-folder-action"
            onClick={() => onDelete(folder)}
            title="Delete"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="media-folder-children">
          {folder.children!.map((child) => (
            <FolderTreeNode
              key={child.id}
              folder={child}
              activeFolderId={activeFolderId}
              dropTargetFolderId={dropTargetFolderId}
              depth={depth + 1}
              onSelect={onSelect}
              onRename={onRename}
              onDelete={onDelete}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}
