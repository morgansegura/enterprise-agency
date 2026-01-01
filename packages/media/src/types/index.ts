/**
 * Media Types
 *
 * All type definitions for the @enterprise/media package.
 *
 * @module @enterprise/media/types
 */

// Core media types
export type {
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
} from "./media";

// Folder types
export type {
  MediaFolder,
  MediaFolderListItem,
  CreateFolderInput,
  UpdateFolderInput,
  MoveFolderInput,
  FolderTreeNode,
  FolderTreeState,
} from "./folder";

// Upload types
export type {
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
} from "./upload";

// Component prop types
// Note: AspectRatioProps, ImageProps, VideoProps are defined on the actual
// components in the primitives module. These types are for reference.
export type {
  AspectRatio,
  ImageLoadingStyle,
  ImageObjectFit,
  ImageLoadingState,
  VideoSource,
  VideoTrack,
  VideoPlayerState,
  LightboxImage,
  LightboxContextValue,
  LightboxProps,
  LightboxProviderProps,
} from "./component-props";

// Extension types
export type {
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
} from "./extensions";
