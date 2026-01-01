/**
 * Media Hooks
 *
 * React Query hooks for media and folder operations.
 *
 * @module @enterprise/media/hooks
 */

// ============================================================================
// MEDIA HOOKS
// ============================================================================

export {
  // Query keys
  mediaKeys,
  // Types
  type MediaApiClient,
  type UseMediaOptions,
  // Hooks
  useMediaList,
  useMedia,
  useUpdateMedia,
  useDeleteMedia,
  useMoveMedia,
  useCropMedia,
  usePrefetchMedia,
  useInvalidateMedia,
} from "./use-media";

// ============================================================================
// FOLDER HOOKS
// ============================================================================

export {
  // Query keys
  folderKeys,
  // Types
  type FolderApiClient,
  type UseFoldersOptions,
  // Hooks
  useFolderList,
  useFolderTree,
  useFolder,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useMoveFolder,
  useInvalidateFolders,
} from "./use-folders";

// ============================================================================
// UPLOAD HOOKS
// ============================================================================

export {
  // Types
  type UploadApiClient,
  type UseUploadOptions,
  // Hooks
  useUploadQueue,
  useUploadFile,
  useBatchUpload,
} from "./use-upload";

// ============================================================================
// BULK OPERATIONS HOOKS
// ============================================================================

export {
  // Types
  type BulkOperationResult,
  type BulkApiClient,
  type UseBulkOperationsOptions,
  // Hooks
  useBulkMove,
  useBulkDelete,
  useBulkTag,
  useBulkUntag,
  useBulkOperations,
} from "./use-bulk-operations";
