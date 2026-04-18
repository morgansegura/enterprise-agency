"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  useAssets,
  useAssetUsage,
  useUploadAsset,
  useUpdateAsset,
  useDeleteAsset,
  useBulkDeleteAssets,
  useBulkMoveAssets,
  useMoveAsset,
  useCropAsset,
  type Asset,
} from "@/lib/hooks/use-assets";
import {
  useFolderTree,
  useCreateFolder,
  useDeleteFolder,
  useUpdateFolder,
  type MediaFolder,
} from "@/lib/hooks/use-folders";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog, PromptDialog } from "@/components/ui/confirm-dialog";
import { ImageEditor } from "@/components/ui/media-library/image-editor";
import { FolderTree } from "../folder-tree";
import {
  MediaToolbar,
  TYPE_FILTER_TO_API,
  type ViewMode,
  type SortBy,
  type TypeFilter,
} from "../media-toolbar";
import { AssetGrid, type GridDensity } from "../asset-grid";
import { AssetList } from "../asset-list";
import { AssetDetailDrawer } from "../asset-detail-drawer";
import { BulkActionBar } from "../bulk-action-bar";
import { UploadQueue } from "../upload-queue";
import { UploadDropzone } from "../upload-dropzone";
import { EmptyState } from "../empty-state";
import { useMediaSelection } from "../hooks/use-media-selection";
import { useMediaUploadQueue } from "../hooks/use-media-upload-queue";
import { formatBytes, quotaPercent } from "../utils";
import "./media-library.css";

interface MediaLibraryProps {
  tenantId: string;
}

export function MediaLibrary({ tenantId }: MediaLibraryProps) {
  // ---------------- UI state ----------------
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all");
  const [sortBy, setSortBy] = React.useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [view, setView] = React.useState<ViewMode>("grid");
  const [density, setDensity] = React.useState<GridDensity>("comfortable");
  const [activeFolderId, setActiveFolderId] = React.useState<string | null>(
    null,
  );
  const [dropTargetFolderId, setDropTargetFolderId] = React.useState<
    string | null
  >(null);
  const [activeAsset, setActiveAsset] = React.useState<Asset | null>(null);
  const [editingImage, setEditingImage] = React.useState<Asset | null>(null);

  // Dialog state
  const [newFolderParent, setNewFolderParent] = React.useState<
    string | null | undefined
  >(undefined);
  const [renameFolderTarget, setRenameFolderTarget] =
    React.useState<MediaFolder | null>(null);
  const [deleteFolderTarget, setDeleteFolderTarget] =
    React.useState<MediaFolder | null>(null);
  const [deleteAssetTarget, setDeleteAssetTarget] =
    React.useState<Asset | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  // ---------------- Debounced search ----------------
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 200);
    return () => clearTimeout(t);
  }, [search]);

  // ---------------- Data ----------------
  const {
    data: assets,
    isLoading,
    error,
  } = useAssets(tenantId, {
    type:
      typeFilter !== "all" ? TYPE_FILTER_TO_API[typeFilter] : undefined,
    search: debouncedSearch || undefined,
    folderId: activeFolderId,
    sortBy,
    sortOrder,
    pageSize: 200,
  });
  const { data: folderTree } = useFolderTree(tenantId);
  const { data: usage } = useAssetUsage(tenantId);

  // ---------------- Mutations ----------------
  const createFolder = useCreateFolder(tenantId);
  const updateFolder = useUpdateFolder(tenantId);
  const deleteFolder = useDeleteFolder(tenantId);
  const uploadMutation = useUploadAsset(tenantId);
  const updateAsset = useUpdateAsset(tenantId);
  const deleteAssetMut = useDeleteAsset(tenantId);
  const bulkDeleteMut = useBulkDeleteAssets(tenantId);
  const bulkMoveMut = useBulkMoveAssets(tenantId);
  // Referenced for drag-drop onto single asset in the future; unused now
  void useMoveAsset;
  void useCropAsset;

  // ---------------- Upload queue ----------------
  const uploadQueue = useMediaUploadQueue(uploadMutation, {
    folderId: activeFolderId ?? undefined,
    concurrency: 3,
  });

  // ---------------- Selection ----------------
  const selection = useMediaSelection();
  const assetList = React.useMemo(() => assets ?? [], [assets]);

  const handleSelect = React.useCallback(
    (id: string, event: React.MouseEvent) => {
      if (event.shiftKey) {
        selection.selectRange(id, assetList);
      } else {
        selection.toggle(id, event);
      }
    },
    [assetList, selection],
  );

  const handleActivate = React.useCallback(
    (asset: Asset) => {
      setActiveAsset(asset);
      selection.select(asset.id);
    },
    [selection],
  );

  // ---------------- Keyboard shortcuts ----------------
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;

      if ((e.metaKey || e.ctrlKey) && e.key === "a") {
        e.preventDefault();
        selection.selectAll(assetList);
        return;
      }
      if (e.key === "Escape") {
        if (activeAsset) setActiveAsset(null);
        else selection.clear();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selection.count > 0) {
          e.preventDefault();
          setBulkDeleteOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeAsset, assetList, selection]);

  // ---------------- Clipboard paste ----------------
  React.useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        e.preventDefault();
        uploadQueue.enqueue(files);
      }
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [uploadQueue]);

  // ---------------- File input ----------------
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) uploadQueue.enqueue(files);
    e.target.value = "";
  };

  // ---------------- Folder drag/drop ----------------
  const handleFolderDrop = (folderId: string | null) => {
    const ids = Array.from(selection.selectedIds);
    if (ids.length === 0) return;
    bulkMoveMut
      .mutateAsync({ mediaIds: ids, folderId })
      .then(() => {
        toast.success(
          `Moved ${ids.length} file${ids.length === 1 ? "" : "s"}`,
        );
        selection.clear();
      })
      .catch((err: Error) => toast.error(err.message));
    setDropTargetFolderId(null);
  };

  // ---------------- Actions ----------------
  const handleSaveAsset = (patch: {
    title?: string;
    altText?: string;
    caption?: string;
    tags?: string[];
  }) => {
    if (!activeAsset) return;
    updateAsset
      .mutateAsync({ id: activeAsset.id, data: patch })
      .then(() => toast.success("Saved"))
      .catch((err: Error) => toast.error(err.message));
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selection.selectedIds);
    bulkDeleteMut
      .mutateAsync(ids)
      .then((res) => {
        toast.success(`Deleted ${res.successIds.length} item(s)`);
        selection.clear();
        setBulkDeleteOpen(false);
      })
      .catch((err: Error) => toast.error(err.message));
  };

  const handleDeleteAsset = () => {
    if (!deleteAssetTarget) return;
    deleteAssetMut
      .mutateAsync(deleteAssetTarget.id)
      .then(() => {
        toast.success("Deleted");
        if (activeAsset?.id === deleteAssetTarget.id) setActiveAsset(null);
        setDeleteAssetTarget(null);
      })
      .catch((err: Error) => toast.error(err.message));
  };

  const isFiltered =
    typeFilter !== "all" || debouncedSearch !== "" || activeFolderId !== null;

  return (
    <div data-slot="media-library">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={handleFilesSelected}
      />

      <aside data-slot="media-library-sidebar">
        <FolderTree
          folders={folderTree}
          activeFolderId={activeFolderId}
          dropTargetId={dropTargetFolderId}
          onSelect={setActiveFolderId}
          onCreateFolder={(parent) => setNewFolderParent(parent)}
          onRename={setRenameFolderTarget}
          onDelete={setDeleteFolderTarget}
          onAssetDrop={(id) => handleFolderDrop(id)}
          onDragEnter={setDropTargetFolderId}
          onDragLeave={(id) =>
            dropTargetFolderId === id
              ? setDropTargetFolderId(null)
              : undefined
          }
        />
        {usage ? (
          <div data-slot="media-library-usage">
            <div data-slot="media-library-usage-row">
              <span>{formatBytes(usage.usedBytes)}</span>
              {!usage.unlimited ? (
                <span>of {formatBytes(usage.quotaBytes)}</span>
              ) : (
                <span>{usage.counts.total.toLocaleString()} items</span>
              )}
            </div>
            {!usage.unlimited ? (
              <div data-slot="media-library-usage-bar">
                <span
                  data-slot="media-library-usage-fill"
                  style={{
                    width: `${quotaPercent(usage.usedBytes, usage.quotaBytes)}%`,
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </aside>

      <UploadDropzone onDrop={(files) => uploadQueue.enqueue(files)}>
        <MediaToolbar
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          view={view}
          onViewChange={setView}
          density={density}
          onDensityChange={setDensity}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onUploadClick={handleUploadClick}
          totalCount={assetList.length}
        />

        <div data-slot="media-library-body">
          {error ? (
            <div data-slot="media-library-error">
              Failed to load media: {(error as Error).message}
            </div>
          ) : isLoading ? (
            <div data-slot="media-library-loading">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} data-slot="media-library-skeleton" />
              ))}
            </div>
          ) : assetList.length === 0 ? (
            <EmptyState
              variant={isFiltered ? "filtered" : "empty"}
              onUploadClick={handleUploadClick}
              onClearFilters={() => {
                setTypeFilter("all");
                setSearch("");
                setActiveFolderId(null);
              }}
            />
          ) : view === "grid" ? (
            <AssetGrid
              assets={assetList}
              activeId={activeAsset?.id}
              density={density}
              isSelected={selection.isSelected}
              onSelect={handleSelect}
              onActivate={handleActivate}
            />
          ) : (
            <AssetList
              assets={assetList}
              activeId={activeAsset?.id}
              isSelected={selection.isSelected}
              onSelect={handleSelect}
              onActivate={handleActivate}
            />
          )}
        </div>
      </UploadDropzone>

      {activeAsset ? (
        <AssetDetailDrawer
          tenantId={tenantId}
          asset={activeAsset}
          onClose={() => setActiveAsset(null)}
          onSave={handleSaveAsset}
          onCrop={(a) => setEditingImage(a)}
          onDelete={(a) => setDeleteAssetTarget(a)}
        />
      ) : null}

      <BulkActionBar
        count={selection.count}
        onDelete={() => setBulkDeleteOpen(true)}
        onMoveToFolder={() => {
          // Simple: user clicks folder in tree to move via drag-drop or
          // selects via prompt. Keep MVP: rely on drag to folders.
          toast.info("Drag selected files to a folder to move them");
        }}
        onClear={selection.clear}
      />

      <UploadQueue
        jobs={uploadQueue.jobs}
        completedCount={uploadQueue.completedCount}
        totalCount={uploadQueue.totalCount}
        isActive={uploadQueue.isActive}
        onRemove={uploadQueue.remove}
        onClear={uploadQueue.clear}
      />

      {/* Image editor — outputs a blob, uploaded as a new asset */}
      <ImageEditor
        open={!!editingImage}
        onOpenChange={(open) => !open && setEditingImage(null)}
        imageUrl={editingImage?.url ?? ""}
        fileName={editingImage?.fileName ?? "edited.jpg"}
        onSave={async (blob, filename) => {
          if (!editingImage) return;
          try {
            const file = new File([blob], filename, { type: "image/jpeg" });
            const newAsset = await uploadMutation.mutateAsync({
              file,
              folderId: editingImage.folderId ?? undefined,
              altText: editingImage.altText,
              title: editingImage.title,
            });
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
              err instanceof Error ? err.message : "Failed to save",
            );
          }
        }}
      />

      <PromptDialog
        open={newFolderParent !== undefined}
        onOpenChange={(open) => !open && setNewFolderParent(undefined)}
        title="New folder"
        label="Name"
        confirmLabel="Create"
        onConfirm={(name) => {
          createFolder
            .mutateAsync({ name, parentId: newFolderParent ?? null })
            .then(() => toast.success("Folder created"))
            .catch((err: Error) => toast.error(err.message));
          setNewFolderParent(undefined);
        }}
      />

      <PromptDialog
        open={!!renameFolderTarget}
        onOpenChange={(open) => !open && setRenameFolderTarget(null)}
        title="Rename folder"
        label="Name"
        defaultValue={renameFolderTarget?.name}
        confirmLabel="Rename"
        onConfirm={(name) => {
          if (!renameFolderTarget) return;
          updateFolder
            .mutateAsync({ id: renameFolderTarget.id, data: { name } })
            .then(() => toast.success("Folder renamed"))
            .catch((err: Error) => toast.error(err.message));
          setRenameFolderTarget(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteFolderTarget}
        onOpenChange={(open) => !open && setDeleteFolderTarget(null)}
        title="Delete folder?"
        description={`"${deleteFolderTarget?.name}" and all files within will be removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (!deleteFolderTarget) return;
          deleteFolder
            .mutateAsync({ id: deleteFolderTarget.id })
            .then(() => toast.success("Folder deleted"))
            .catch((err: Error) => toast.error(err.message));
          setDeleteFolderTarget(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteAssetTarget}
        onOpenChange={(open) => !open && setDeleteAssetTarget(null)}
        title="Delete file?"
        description={`"${deleteAssetTarget?.fileName}" will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteAsset}
      />

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selection.count} file${selection.count === 1 ? "" : "s"}?`}
        description="These files will be permanently removed."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
