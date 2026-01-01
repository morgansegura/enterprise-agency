/**
 * @enterprise/media
 *
 * Enterprise-grade media components and library for the agency platform.
 * Designed for extensibility to support ad management, social media,
 * and email marketing integrations.
 *
 * @example
 * ```tsx
 * // Import primitives
 * import { Image, Video, AspectRatio } from '@enterprise/media/primitives';
 *
 * // Import lightbox
 * import { Lightbox, LightboxProvider } from '@enterprise/media/lightbox';
 *
 * // Import media library
 * import { MediaLibrary } from '@enterprise/media/library';
 *
 * // Import hooks
 * import { useMedia, useUpload, useFolders } from '@enterprise/media/hooks';
 *
 * // Import utilities
 * import { formatBytes, validateFileType } from '@enterprise/media/utils';
 *
 * // Import types
 * import type { Media, MediaType, MediaFolder } from '@enterprise/media/types';
 * ```
 */

// ============================================================================
// TYPES
// Note: Types are available via "@enterprise/media/types" subpath
// ============================================================================
export type {
  // Core media types
  MediaType,
  MediaStatus,
  MediaVariants,
  MediaUploader,
  Media,
  MediaListItem,
  UpdateMediaInput,
  RenameMediaInput,
  MoveMediaInput,
  CropMediaInput,
  BulkMediaInput,
  BulkMoveMediaInput,
  BulkTagMediaInput,
  MediaQueryParams,
  MediaListResponse,
  MediaViewMode,
  MediaSortBy,
  SortOrder,
  // Folder types
  MediaFolder,
  MediaFolderListItem,
  CreateFolderInput,
  UpdateFolderInput,
  MoveFolderInput,
  FolderTreeNode,
  FolderTreeState,
  // Upload types
  PresignedUploadRequest,
  PresignedUploadResponse,
  UploadCompleteRequest,
  UploadStatus,
  UploadProgressItem,
  UploadQueueState,
  UploadOptions,
  FileValidationOptions,
  FileValidationResult,
  DropzoneState,
  DropzoneProps,
  // Component type aliases (from types module)
  AspectRatio as AspectRatioType,
  ImageLoadingStyle,
  ImageObjectFit,
  ImageLoadingState,
  VideoSource,
  VideoTrack,
  VideoPlayerState,
  LightboxImage,
  LightboxContextValue,
  LightboxProps as LightboxPropsType,
  LightboxProviderProps,
  // Extension types
  AdPlatform,
  AdCreativeSize,
  AdCreativeContext,
  SocialPlatform,
  SocialPostType,
  SocialMediaContext,
  EmailMarketingContext,
  UsageContextType,
  DimensionConstraints,
  MediaUsageContext,
  MediaValidationHook,
  MediaTransformHook,
  MediaLibraryAction,
  MediaLibraryFilter,
  MediaLibraryExtension,
} from "./types";

// ============================================================================
// UTILITIES
// ============================================================================
export * from "./utils";

// ============================================================================
// PRIMITIVES (Components)
// Re-export components from primitives module
// ============================================================================
export {
  // AspectRatio component
  AspectRatio,
  type AspectRatioProps,
  // Image component and helpers
  Image,
  type ImageProps,
  useImageLoading,
  type UseImageLoadingOptions,
  type UseImageLoadingReturn,
  ImageSkeleton,
  type ImageSkeletonProps,
  ImageError,
  type ImageErrorProps,
  // Video component and helpers
  Video,
  type VideoProps,
  VideoControls,
  type VideoControlsProps,
  useVideoPlayer,
  type UseVideoPlayerOptions,
  type UseVideoPlayerReturn,
} from "./primitives";

// ============================================================================
// LIGHTBOX
// ============================================================================
export * from "./lightbox";

// ============================================================================
// LIBRARY
// ============================================================================
export * from "./library";

// ============================================================================
// HOOKS
// ============================================================================
export * from "./hooks";
