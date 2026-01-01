/**
 * Upload Context
 *
 * Context for managing upload queue state in the media library.
 *
 * @module @enterprise/media/library
 */

"use client";

import * as React from "react";
import type {
  UploadProgressItem,
  UploadStatus,
  FileValidationOptions,
  Media,
} from "../../types";
import {
  validateFile,
  getMediaTypeFromMime,
} from "../../utils/file-validation";

// ============================================================================
// TYPES
// ============================================================================

export interface UploadContextValue {
  /** Items in the upload queue */
  items: UploadProgressItem[];
  /** Whether any uploads are in progress */
  isUploading: boolean;
  /** Total progress (0-100) */
  totalProgress: number;
  /** Count of pending items */
  pendingCount: number;
  /** Count of uploading items */
  uploadingCount: number;
  /** Count of completed items */
  completedCount: number;
  /** Count of failed items */
  failedCount: number;
  /** Add files to the queue */
  addFiles: (files: File[], folderId?: string | null) => void;
  /** Remove an item from the queue */
  removeItem: (id: string) => void;
  /** Retry a failed item */
  retryItem: (id: string) => void;
  /** Cancel an uploading item */
  cancelItem: (id: string) => void;
  /** Clear completed items */
  clearCompleted: () => void;
  /** Clear all items */
  clearAll: () => void;
  /** Start uploading pending items */
  startUpload: () => void;
  /** Pause uploads */
  pauseUpload: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const UploadContext = React.createContext<UploadContextValue | null>(null);

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access upload context
 *
 * @example
 * ```tsx
 * const { items, addFiles, isUploading } = useUpload();
 *
 * const handleDrop = (files: File[]) => {
 *   addFiles(files, 'folder-123');
 * };
 * ```
 */
export function useUpload(): UploadContextValue {
  const context = React.useContext(UploadContext);

  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }

  return context;
}

/**
 * Optional upload hook that returns null if not in provider
 */
export function useUploadOptional(): UploadContextValue | null {
  return React.useContext(UploadContext);
}

// ============================================================================
// PROVIDER
// ============================================================================

export interface UploadProviderProps {
  /** Children */
  children: React.ReactNode;
  /** File validation options */
  validation?: FileValidationOptions;
  /** Maximum concurrent uploads */
  maxConcurrent?: number;
  /** Upload function - must be provided */
  onUpload: (
    item: UploadProgressItem,
    onProgress: (progress: number) => void,
  ) => Promise<Media>;
  /** Callback when upload starts */
  onUploadStart?: (item: UploadProgressItem) => void;
  /** Callback when upload completes */
  onUploadComplete?: (item: UploadProgressItem, media: Media) => void;
  /** Callback when upload fails */
  onUploadError?: (item: UploadProgressItem, error: Error) => void;
  /** Callback when all uploads complete */
  onAllComplete?: () => void;
}

/**
 * Provider for upload queue state
 *
 * @example
 * ```tsx
 * <UploadProvider
 *   onUpload={async (item, onProgress) => {
 *     // Upload implementation
 *     return uploadedMedia;
 *   }}
 *   onUploadComplete={(item, media) => {
 *     console.log('Uploaded:', media);
 *   }}
 * >
 *   <MediaLibrary />
 * </UploadProvider>
 * ```
 */
export function UploadProvider({
  children,
  validation,
  maxConcurrent = 3,
  onUpload,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  onAllComplete,
}: UploadProviderProps) {
  const [items, setItems] = React.useState<UploadProgressItem[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const abortControllers = React.useRef<Map<string, AbortController>>(
    new Map(),
  );
  const uploadingRef = React.useRef(false);

  // Computed values
  const pendingCount = items.filter((i) => i.status === "pending").length;
  const uploadingCount = items.filter((i) => i.status === "uploading").length;
  const completedCount = items.filter((i) => i.status === "complete").length;
  const failedCount = items.filter((i) => i.status === "error").length;

  const totalProgress = React.useMemo(() => {
    if (items.length === 0) return 0;
    const totalBytes = items.reduce((sum, i) => sum + i.fileSize, 0);
    const uploadedBytes = items.reduce(
      (sum, i) => sum + (i.fileSize * i.progress) / 100,
      0,
    );
    return Math.round((uploadedBytes / totalBytes) * 100);
  }, [items]);

  const generateId = () =>
    `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const addFiles = React.useCallback(
    (files: File[], folderId?: string | null) => {
      const newItems: UploadProgressItem[] = files.map((file) => {
        const validationResult = validation
          ? validateFile(file, validation)
          : { valid: true, error: null, type: getMediaTypeFromMime(file.type) };

        return {
          id: generateId(),
          file,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          type:
            validationResult.type ??
            getMediaTypeFromMime(file.type) ??
            "DOCUMENT",
          status: validationResult.valid
            ? ("pending" as UploadStatus)
            : ("error" as UploadStatus),
          progress: 0,
          folderId: folderId ?? null,
          error: validationResult.error ?? undefined,
          createdAt: new Date().toISOString(),
        };
      });

      setItems((prev) => [...prev, ...newItems]);
    },
    [validation],
  );

  const updateItem = React.useCallback(
    (id: string, updates: Partial<UploadProgressItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      );
    },
    [],
  );

  const removeItem = React.useCallback((id: string) => {
    // Cancel if uploading
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(id);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const retryItem = React.useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "pending" as UploadStatus,
              progress: 0,
              error: undefined,
            }
          : item,
      ),
    );
  }, []);

  const cancelItem = React.useCallback((id: string) => {
    const controller = abortControllers.current.get(id);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(id);
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.status === "uploading"
          ? { ...item, status: "error" as UploadStatus, error: "Cancelled" }
          : item,
      ),
    );
  }, []);

  const clearCompleted = React.useCallback(() => {
    setItems((prev) => prev.filter((item) => item.status !== "complete"));
  }, []);

  const clearAll = React.useCallback(() => {
    // Cancel all active uploads
    abortControllers.current.forEach((controller) => controller.abort());
    abortControllers.current.clear();
    setItems([]);
  }, []);

  const uploadItem = React.useCallback(
    async (item: UploadProgressItem) => {
      const controller = new AbortController();
      abortControllers.current.set(item.id, controller);

      try {
        updateItem(item.id, { status: "uploading" });

        if (onUploadStart) {
          onUploadStart(item);
        }

        const media = await onUpload(item, (progress) => {
          updateItem(item.id, { progress });
        });

        updateItem(item.id, {
          status: "complete",
          progress: 100,
          completedAt: new Date().toISOString(),
          mediaId: media.id,
        });

        if (onUploadComplete) {
          onUploadComplete(
            { ...item, status: "complete", progress: 100, mediaId: media.id },
            media,
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        updateItem(item.id, { status: "error", error: errorMessage });

        if (onUploadError) {
          onUploadError(
            { ...item, status: "error", error: errorMessage },
            error instanceof Error ? error : new Error(errorMessage),
          );
        }
      } finally {
        abortControllers.current.delete(item.id);
      }
    },
    [onUpload, onUploadStart, onUploadComplete, onUploadError, updateItem],
  );

  const startUpload = React.useCallback(async () => {
    if (uploadingRef.current) return;

    uploadingRef.current = true;
    setIsUploading(true);
    setIsPaused(false);

    const processQueue = async () => {
      while (!isPaused) {
        // Get pending items
        const currentItems = items.filter((i) => i.status === "pending");
        if (currentItems.length === 0) break;

        // Get items currently uploading
        const currentlyUploading = items.filter(
          (i) => i.status === "uploading",
        ).length;
        const slotsAvailable = maxConcurrent - currentlyUploading;

        if (slotsAvailable <= 0) {
          // Wait for a slot
          await new Promise((resolve) => setTimeout(resolve, 100));
          continue;
        }

        // Start new uploads
        const toUpload = currentItems.slice(0, slotsAvailable);
        await Promise.all(toUpload.map(uploadItem));
      }
    };

    await processQueue();

    uploadingRef.current = false;
    setIsUploading(false);

    // Check if all complete
    const allComplete = items.every(
      (i) => i.status === "complete" || i.status === "error",
    );
    if (allComplete && onAllComplete) {
      onAllComplete();
    }
  }, [items, isPaused, maxConcurrent, uploadItem, onAllComplete]);

  const pauseUpload = React.useCallback(() => {
    setIsPaused(true);
  }, []);

  // Auto-start uploads when files are added
  React.useEffect(() => {
    const hasPending = items.some((i) => i.status === "pending");
    if (hasPending && !isUploading && !isPaused) {
      startUpload();
    }
  }, [items, isUploading, isPaused, startUpload]);

  const value = React.useMemo(
    () => ({
      items,
      isUploading,
      totalProgress,
      pendingCount,
      uploadingCount,
      completedCount,
      failedCount,
      addFiles,
      removeItem,
      retryItem,
      cancelItem,
      clearCompleted,
      clearAll,
      startUpload,
      pauseUpload,
    }),
    [
      items,
      isUploading,
      totalProgress,
      pendingCount,
      uploadingCount,
      completedCount,
      failedCount,
      addFiles,
      removeItem,
      retryItem,
      cancelItem,
      clearCompleted,
      clearAll,
      startUpload,
      pauseUpload,
    ],
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

UploadProvider.displayName = "UploadProvider";
