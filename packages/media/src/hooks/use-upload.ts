/**
 * Upload Hooks
 *
 * React hooks for file upload with progress tracking.
 *
 * @module @enterprise/media/hooks
 */

"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Media,
  PresignedUploadRequest,
  PresignedUploadResponse,
  UploadProgressItem,
  UploadStatus,
  FileValidationOptions,
} from "../types";
import { validateFile, getMediaTypeFromMime } from "../utils/file-validation";
import { mediaKeys } from "./use-media";

// ============================================================================
// TYPES
// ============================================================================

export interface UploadApiClient {
  /** Get presigned upload URL */
  getPresignedUrl: (
    tenantId: string,
    request: PresignedUploadRequest,
  ) => Promise<PresignedUploadResponse>;
  /** Complete upload after file is uploaded */
  completeUpload: (
    tenantId: string,
    uploadId: string,
    data: { blurHash?: string; width?: number; height?: number },
  ) => Promise<Media>;
  /** Direct upload (alternative to presigned) */
  uploadFile?: (
    tenantId: string,
    file: File,
    options?: { folderId?: string; onProgress?: (progress: number) => void },
  ) => Promise<Media>;
}

export interface UseUploadOptions {
  /** API client for upload operations */
  apiClient: UploadApiClient;
  /** Tenant ID */
  tenantId: string;
  /** Default folder ID for uploads */
  defaultFolderId?: string | null;
  /** File validation options */
  validation?: FileValidationOptions;
  /** Maximum concurrent uploads */
  maxConcurrent?: number;
  /** Callback when upload starts */
  onUploadStart?: (item: UploadProgressItem) => void;
  /** Callback when upload progresses */
  onUploadProgress?: (item: UploadProgressItem) => void;
  /** Callback when upload completes */
  onUploadComplete?: (item: UploadProgressItem, media: Media) => void;
  /** Callback when upload fails */
  onUploadError?: (item: UploadProgressItem, error: Error) => void;
}

// ============================================================================
// UPLOAD QUEUE STATE
// ============================================================================

interface UploadQueueState {
  items: UploadProgressItem[];
  addItems: (files: File[], folderId?: string | null) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<UploadProgressItem>) => void;
  retryItem: (id: string) => void;
  cancelItem: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
}

/**
 * Hook for managing upload queue state
 */
export function useUploadQueue(options: UseUploadOptions): UploadQueueState {
  const { validation, onUploadStart } = options;
  const [items, setItems] = React.useState<UploadProgressItem[]>([]);

  const addItems = React.useCallback(
    (files: File[], folderId?: string | null) => {
      const newItems: UploadProgressItem[] = files.map((file) => {
        // Validate file
        const validationResult = validation
          ? validateFile(file, validation)
          : { valid: true, error: null, type: getMediaTypeFromMime(file.type) };

        const item: UploadProgressItem = {
          id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          file,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          type:
            validationResult.type ??
            getMediaTypeFromMime(file.type) ??
            "DOCUMENT",
          status: validationResult.valid ? "pending" : "error",
          progress: 0,
          folderId: folderId ?? null,
          error: validationResult.error ?? undefined,
          createdAt: new Date().toISOString(),
        };

        if (item.status === "pending" && onUploadStart) {
          onUploadStart(item);
        }

        return item;
      });

      setItems((prev) => [...prev, ...newItems]);
    },
    [validation, onUploadStart],
  );

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItem = React.useCallback(
    (id: string, updates: Partial<UploadProgressItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
      );
    },
    [],
  );

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
    setItems([]);
  }, []);

  return {
    items,
    addItems,
    removeItem,
    updateItem,
    retryItem,
    cancelItem,
    clearCompleted,
    clearAll,
  };
}

// ============================================================================
// SINGLE FILE UPLOAD
// ============================================================================

/**
 * Hook for uploading a single file with progress
 *
 * @example
 * ```tsx
 * const { mutate: upload, isPending } = useUploadFile({ apiClient, tenantId });
 *
 * const handleUpload = (file: File) => {
 *   upload({ file, folderId: 'folder-123' }, {
 *     onSuccess: (media) => console.log('Uploaded:', media),
 *   });
 * };
 * ```
 */
export function useUploadFile(options: UseUploadOptions) {
  const {
    apiClient,
    tenantId,
    defaultFolderId,
    validation,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
  } = options;
  const queryClient = useQueryClient();
  const [progress, setProgress] = React.useState(0);

  const mutation = useMutation({
    mutationFn: async ({
      file,
      folderId = defaultFolderId,
    }: {
      file: File;
      folderId?: string | null;
    }) => {
      // Validate file
      if (validation) {
        const result = validateFile(file, validation);
        if (!result.valid) {
          throw new Error(result.error || "File validation failed");
        }
      }

      const mediaType = getMediaTypeFromMime(file.type) ?? "DOCUMENT";

      // Use direct upload if available
      if (apiClient.uploadFile) {
        return apiClient.uploadFile(tenantId, file, {
          folderId: folderId ?? undefined,
          onProgress: (p) => {
            setProgress(p);
            if (onUploadProgress) {
              onUploadProgress({
                id: "single-upload",
                file,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                type: mediaType,
                status: "uploading",
                progress: p,
                folderId: folderId ?? null,
                createdAt: new Date().toISOString(),
              });
            }
          },
        });
      }

      // Otherwise use presigned URL flow
      const presigned = await apiClient.getPresignedUrl(tenantId, {
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        type: mediaType,
        folderId: folderId ?? undefined,
      });

      // Upload to storage
      await uploadToStorage(
        presigned.uploadUrl,
        file,
        presigned.fields,
        (p) => {
          setProgress(p);
          if (onUploadProgress) {
            onUploadProgress({
              id: presigned.uploadId,
              file,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type,
              type: mediaType,
              status: "uploading",
              progress: p,
              folderId: folderId ?? null,
              createdAt: new Date().toISOString(),
            });
          }
        },
      );

      // Complete upload
      return apiClient.completeUpload(tenantId, presigned.uploadId, {});
    },
    onSuccess: (media) => {
      setProgress(0);
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      if (onUploadComplete) {
        onUploadComplete(
          {
            id: media.id,
            file: new File([], media.fileName),
            fileName: media.fileName,
            fileSize: media.fileSize,
            mimeType: media.mimeType,
            type: media.type,
            status: "complete",
            progress: 100,
            folderId: media.folderId ?? null,
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            mediaId: media.id,
          },
          media,
        );
      }
    },
    onError: (error: Error, variables) => {
      setProgress(0);
      if (onUploadError) {
        onUploadError(
          {
            id: "single-upload",
            file: variables.file,
            fileName: variables.file.name,
            fileSize: variables.file.size,
            mimeType: variables.file.type,
            type: getMediaTypeFromMime(variables.file.type) ?? "DOCUMENT",
            status: "error",
            progress: 0,
            folderId: variables.folderId ?? null,
            error: error.message,
            createdAt: new Date().toISOString(),
          },
          error,
        );
      }
    },
  });

  return {
    ...mutation,
    progress,
  };
}

// ============================================================================
// BATCH UPLOAD
// ============================================================================

/**
 * Hook for uploading multiple files with queue management
 *
 * @example
 * ```tsx
 * const {
 *   items,
 *   addFiles,
 *   isUploading,
 *   startUpload,
 * } = useBatchUpload({ apiClient, tenantId });
 *
 * const handleDrop = (files: File[]) => {
 *   addFiles(files, 'folder-123');
 *   startUpload();
 * };
 * ```
 */
export function useBatchUpload(options: UseUploadOptions) {
  const {
    apiClient,
    tenantId,
    maxConcurrent = 3,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
  } = options;

  const queue = useUploadQueue(options);
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = React.useState(false);
  const abortControllers = React.useRef<Map<string, AbortController>>(
    new Map(),
  );

  const uploadItem = React.useCallback(
    async (item: UploadProgressItem) => {
      const controller = new AbortController();
      abortControllers.current.set(item.id, controller);

      try {
        queue.updateItem(item.id, { status: "uploading" });

        let media: Media;

        if (apiClient.uploadFile) {
          media = await apiClient.uploadFile(tenantId, item.file, {
            folderId: item.folderId ?? undefined,
            onProgress: (progress) => {
              queue.updateItem(item.id, { progress });
              if (onUploadProgress) {
                onUploadProgress({ ...item, status: "uploading", progress });
              }
            },
          });
        } else {
          const presigned = await apiClient.getPresignedUrl(tenantId, {
            fileName: item.fileName,
            mimeType: item.mimeType,
            fileSize: item.fileSize,
            type: item.type,
            folderId: item.folderId ?? undefined,
          });

          await uploadToStorage(
            presigned.uploadUrl,
            item.file,
            presigned.fields,
            (progress) => {
              queue.updateItem(item.id, { progress });
              if (onUploadProgress) {
                onUploadProgress({ ...item, status: "uploading", progress });
              }
            },
            controller.signal,
          );

          media = await apiClient.completeUpload(
            tenantId,
            presigned.uploadId,
            {},
          );
        }

        queue.updateItem(item.id, {
          status: "complete",
          progress: 100,
          completedAt: new Date().toISOString(),
          mediaId: media.id,
        });

        if (onUploadComplete) {
          onUploadComplete(
            { ...item, status: "complete", progress: 100 },
            media,
          );
        }

        queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        queue.updateItem(item.id, { status: "error", error: errorMessage });

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
    [
      apiClient,
      tenantId,
      queue,
      queryClient,
      onUploadProgress,
      onUploadComplete,
      onUploadError,
    ],
  );

  const startUpload = React.useCallback(async () => {
    setIsUploading(true);

    const pendingItems = queue.items.filter(
      (item) => item.status === "pending",
    );
    const chunks: UploadProgressItem[][] = [];

    for (let i = 0; i < pendingItems.length; i += maxConcurrent) {
      chunks.push(pendingItems.slice(i, i + maxConcurrent));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(uploadItem));
    }

    setIsUploading(false);
  }, [queue.items, maxConcurrent, uploadItem]);

  const cancelUpload = React.useCallback(
    (id: string) => {
      const controller = abortControllers.current.get(id);
      if (controller) {
        controller.abort();
      }
      queue.cancelItem(id);
    },
    [queue],
  );

  return {
    ...queue,
    isUploading,
    startUpload,
    cancelUpload,
    addFiles: queue.addItems,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Upload file to storage using presigned URL
 */
async function uploadToStorage(
  uploadUrl: string,
  file: File,
  fields?: Record<string, string>,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (signal) {
      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error("Upload cancelled"));
      });
    }

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("POST", uploadUrl);

    if (fields) {
      // Multipart form upload (e.g., S3)
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);
      xhr.send(formData);
    } else {
      // Direct PUT (e.g., GCS, R2)
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    }
  });
}
