/**
 * Core Media Types
 *
 * Shared types for the media system including images, videos, and documents.
 *
 * @module @enterprise/media/types
 */

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Type of media file
 */
export type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";

/**
 * Processing status of media
 */
export type MediaStatus = "PROCESSING" | "READY" | "ERROR" | "ARCHIVED";

// ============================================================================
// VARIANTS
// ============================================================================

/**
 * Responsive image variants and format variants
 */
export interface MediaVariants {
  /** 320w thumbnail */
  sm?: string;
  /** 768w medium */
  md?: string;
  /** 1280w large */
  lg?: string;
  /** 1920w extra large */
  xl?: string;
  /** WebP format (auto-generated for images) */
  webp?: string;
  /** AVIF format (auto-generated for images) */
  avif?: string;
  /** WebM video format */
  webm?: string;
  /** MP4 video format */
  mp4?: string;
  /** MP3 audio format */
  mp3?: string;
  /** OGG audio format */
  ogg?: string;
  /** Original file URL */
  original?: string;
}

// ============================================================================
// USER REFERENCE
// ============================================================================

/**
 * User who uploaded the media (minimal info)
 */
export interface MediaUploader {
  id: string;
  firstName: string;
  lastName: string;
}

// ============================================================================
// MEDIA ENTITY
// ============================================================================

/**
 * Full media entity with all metadata
 */
export interface Media {
  id: string;
  tenantId: string;
  /** Display filename (may be renamed) */
  fileName: string;
  /** Original filename at upload */
  originalName: string;
  /** MIME type (e.g., "image/jpeg") */
  mimeType: string;
  /** File size in bytes */
  fileSize: number;
  /** Storage key in CDN bucket */
  storageKey: string;
  type: MediaType;
  status: MediaStatus;
  /** Image/video width in pixels */
  width: number | null;
  /** Image/video height in pixels */
  height: number | null;
  /** Aspect ratio string (e.g., "16:9") */
  aspectRatio: string | null;
  /** BlurHash placeholder for progressive loading */
  blurHash: string | null;
  /** Video/audio duration in seconds */
  duration: number | null;
  /** Storage key for video thumbnail */
  thumbnailKey: string | null;
  /** Primary CDN URL */
  url: string;
  /** Thumbnail URL for videos */
  thumbnailUrl: string | null;
  /** Responsive/format variants */
  variants: MediaVariants | null;
  /** Alt text for accessibility */
  alt: string | null;
  /** Title attribute */
  title: string | null;
  /** Caption text */
  caption: string | null;
  /** Parent folder ID */
  folderId: string | null;
  /** Tags for filtering */
  tags: string[];
  /** User who uploaded */
  uploadedBy: MediaUploader;
  createdAt: string;
  updatedAt: string;
}

/**
 * Lightweight media for list views
 */
export interface MediaListItem {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  type: MediaType;
  status: MediaStatus;
  width: number | null;
  height: number | null;
  url: string;
  thumbnailUrl: string | null;
  blurHash: string | null;
  alt: string | null;
  folderId: string | null;
  tags: string[];
  createdAt: string;
}

// ============================================================================
// INPUT TYPES
// ============================================================================

/**
 * Input for updating media metadata
 */
export interface UpdateMediaInput {
  alt?: string;
  title?: string;
  caption?: string;
  folderId?: string | null;
  tags?: string[];
}

/**
 * Input for renaming a media file
 */
export interface RenameMediaInput {
  fileName: string;
}

/**
 * Input for moving media to a folder
 */
export interface MoveMediaInput {
  folderId: string | null;
}

/**
 * Input for cropping an image
 */
export interface CropMediaInput {
  /** X offset in pixels */
  x: number;
  /** Y offset in pixels */
  y: number;
  /** Crop width in pixels */
  width: number;
  /** Crop height in pixels */
  height: number;
  /** Target aspect ratio (optional) */
  aspectRatio?: string;
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Base input for bulk operations
 */
export interface BulkMediaInput {
  ids: string[];
}

/**
 * Input for bulk moving media
 */
export interface BulkMoveMediaInput extends BulkMediaInput {
  folderId: string | null;
}

/**
 * Input for bulk tagging media
 */
export interface BulkTagMediaInput extends BulkMediaInput {
  tags: string[];
  /** How to apply tags: add, replace existing, or remove */
  mode: "add" | "replace" | "remove";
}

// ============================================================================
// QUERY PARAMS
// ============================================================================

/**
 * Query parameters for listing media
 */
export interface MediaQueryParams {
  page?: number;
  limit?: number;
  /** Filter by folder (null for root) */
  folderId?: string | null;
  type?: MediaType;
  status?: MediaStatus;
  /** Search in fileName, alt, title, caption */
  search?: string;
  /** Filter by tags (AND logic) */
  tags?: string[];
  sortBy?: "createdAt" | "fileName" | "fileSize" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response for media list
 */
export interface MediaListResponse {
  data: MediaListItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// VIEW MODE
// ============================================================================

/**
 * Display mode for media library grid
 */
export type MediaViewMode = "grid" | "list";

/**
 * Sort options for media library
 */
export type MediaSortBy = "createdAt" | "fileName" | "fileSize" | "updatedAt";

/**
 * Sort order
 */
export type SortOrder = "asc" | "desc";
