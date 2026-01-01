/**
 * Upload Types
 *
 * Types for file upload operations and progress tracking.
 *
 * @module @enterprise/media/types
 */

import type { MediaType } from "./media";

// ============================================================================
// PRESIGNED UPLOAD
// ============================================================================

/**
 * Request for a presigned upload URL
 */
export interface PresignedUploadRequest {
  fileName: string;
  mimeType: string;
  fileSize: number;
  type: MediaType;
}

/**
 * Response with presigned upload URL
 */
export interface PresignedUploadResponse {
  /** URL to upload file directly to CDN */
  uploadUrl: string;
  /** Storage key for the file */
  storageKey: string;
  /** When the presigned URL expires */
  expiresAt: string;
}

/**
 * Request to complete upload after file is uploaded to CDN
 */
export interface UploadCompleteRequest {
  storageKey: string;
  width?: number;
  height?: number;
  duration?: number;
  blurHash?: string;
}

// ============================================================================
// UPLOAD PROGRESS
// ============================================================================

/**
 * Upload progress status
 */
export type UploadStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "complete"
  | "error";

/**
 * Individual upload progress item
 */
export interface UploadProgressItem {
  /** Unique ID for this upload */
  id: string;
  /** Original file object */
  file: File;
  /** File name */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** MIME type */
  mimeType: string;
  /** Media type category */
  type: MediaType;
  /** Upload progress (0-100) */
  progress: number;
  /** Current status */
  status: UploadStatus;
  /** Error message if failed */
  error?: string;
  /** Resulting media ID if complete */
  mediaId?: string;
  /** Preview URL (for images) */
  previewUrl?: string;
  /** Abort controller for cancellation */
  abortController?: AbortController;
}

/**
 * Upload queue state
 */
export interface UploadQueueState {
  /** List of upload items */
  items: UploadProgressItem[];
  /** Whether any uploads are in progress */
  isUploading: boolean;
  /** Total upload progress (0-100) */
  totalProgress: number;
  /** Number of completed uploads */
  completedCount: number;
  /** Number of failed uploads */
  errorCount: number;
}

// ============================================================================
// UPLOAD OPTIONS
// ============================================================================

/**
 * Options for upload operations
 */
export interface UploadOptions {
  /** Target folder ID */
  folderId?: string | null;
  /** Alt text for images */
  alt?: string;
  /** Title for media */
  title?: string;
  /** Progress callback */
  onProgress?: (progress: number) => void;
  /** Abort signal */
  signal?: AbortSignal;
}

/**
 * Validation options for file upload
 */
export interface FileValidationOptions {
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Allowed MIME types */
  allowedTypes?: string[];
  /** Allowed media type categories */
  allowedMediaTypes?: MediaType[];
  /** Maximum number of files */
  maxFiles?: number;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  /** Whether the file is valid */
  valid: boolean;
  /** Validation error message */
  error?: string;
  /** Detected media type */
  type?: MediaType;
}

// ============================================================================
// DROPZONE
// ============================================================================

/**
 * Dropzone state
 */
export interface DropzoneState {
  /** Whether files are being dragged over */
  isDragOver: boolean;
  /** Whether the dropzone is active/accepting drops */
  isActive: boolean;
  /** Rejected files from last drop */
  rejectedFiles: File[];
}

/**
 * Dropzone props
 */
export interface DropzoneProps {
  /** Callback when files are dropped/selected */
  onFilesSelected: (files: File[]) => void;
  /** Callback when files are rejected */
  onFilesRejected?: (files: File[], errors: string[]) => void;
  /** Accepted file types (MIME patterns) */
  accept?: string[];
  /** Max file size in bytes */
  maxFileSize?: number;
  /** Max number of files */
  maxFiles?: number;
  /** Whether to allow multiple files */
  multiple?: boolean;
  /** Whether the dropzone is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}
