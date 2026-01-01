/**
 * File Validation Utilities
 *
 * Helper functions for validating file types, sizes, and other properties.
 *
 * @module @enterprise/media/utils
 */

import type {
  MediaType,
  FileValidationOptions,
  FileValidationResult,
} from "../types";

// ============================================================================
// MIME TYPE MAPPINGS
// ============================================================================

/**
 * Mapping of media types to their allowed MIME types
 */
export const MEDIA_TYPE_MIME_MAP: Record<MediaType, string[]> = {
  IMAGE: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/avif",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ],
  VIDEO: [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
  ],
  AUDIO: [
    "audio/mpeg",
    "audio/wav",
    "audio/ogg",
    "audio/mp4",
    "audio/aac",
    "audio/flac",
    "audio/webm",
  ],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ],
};

/**
 * File extension to MIME type mapping
 */
export const EXTENSION_MIME_MAP: Record<string, string> = {
  // Images
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  tiff: "image/tiff",
  tif: "image/tiff",
  // Videos
  mp4: "video/mp4",
  webm: "video/webm",
  ogg: "video/ogg",
  ogv: "video/ogg",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  wmv: "video/x-ms-wmv",
  // Audio
  mp3: "audio/mpeg",
  wav: "audio/wav",
  oga: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  flac: "audio/flac",
  // Documents
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  csv: "text/csv",
};

/**
 * Default maximum file size (50MB)
 */
export const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024;

// ============================================================================
// TYPE DETECTION
// ============================================================================

/**
 * Detect media type from MIME type
 *
 * @example
 * getMediaTypeFromMime("image/jpeg") // "IMAGE"
 * getMediaTypeFromMime("video/mp4") // "VIDEO"
 * getMediaTypeFromMime("application/pdf") // "DOCUMENT"
 */
export function getMediaTypeFromMime(mimeType: string): MediaType | null {
  const normalized = mimeType.toLowerCase();

  for (const [type, mimes] of Object.entries(MEDIA_TYPE_MIME_MAP)) {
    if (mimes.includes(normalized)) {
      return type as MediaType;
    }
  }

  return null;
}

/**
 * Get MIME type from file extension
 *
 * @example
 * getMimeFromExtension("jpg") // "image/jpeg"
 * getMimeFromExtension(".pdf") // "application/pdf"
 */
export function getMimeFromExtension(extension: string): string | null {
  const ext = extension.replace(/^\./, "").toLowerCase();
  return EXTENSION_MIME_MAP[ext] || null;
}

/**
 * Get file extension from filename
 *
 * @example
 * getFileExtension("photo.jpg") // "jpg"
 * getFileExtension("document.PDF") // "pdf"
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Check if MIME type is an image
 */
export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Check if MIME type is a video
 */
export function isVideoMime(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

/**
 * Check if MIME type is audio
 */
export function isAudioMime(mimeType: string): boolean {
  return mimeType.startsWith("audio/");
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate file type against allowed types
 */
export function validateFileType(
  file: File,
  allowedTypes?: string[],
  allowedMediaTypes?: MediaType[],
): FileValidationResult {
  const mimeType = file.type || getMimeFromExtension(file.name) || "";
  const mediaType = getMediaTypeFromMime(mimeType);

  // Check MIME type whitelist
  if (allowedTypes && allowedTypes.length > 0) {
    const isAllowed = allowedTypes.some((pattern) => {
      if (pattern.endsWith("/*")) {
        const prefix = pattern.slice(0, -1);
        return mimeType.startsWith(prefix);
      }
      return mimeType === pattern;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type "${mimeType}" is not allowed`,
        type: mediaType || undefined,
      };
    }
  }

  // Check media type category whitelist
  if (allowedMediaTypes && allowedMediaTypes.length > 0 && mediaType) {
    if (!allowedMediaTypes.includes(mediaType)) {
      return {
        valid: false,
        error: `${mediaType} files are not allowed`,
        type: mediaType,
      };
    }
  }

  return {
    valid: true,
    type: mediaType || undefined,
  };
}

/**
 * Validate file size
 */
export function validateFileSize(
  file: File,
  maxSize = DEFAULT_MAX_FILE_SIZE,
): FileValidationResult {
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds maximum of ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate file against all options
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = {},
): FileValidationResult {
  const {
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    allowedTypes,
    allowedMediaTypes,
  } = options;

  // Validate size
  const sizeResult = validateFileSize(file, maxFileSize);
  if (!sizeResult.valid) return sizeResult;

  // Validate type
  const typeResult = validateFileType(file, allowedTypes, allowedMediaTypes);
  if (!typeResult.valid) return typeResult;

  return {
    valid: true,
    type: typeResult.type,
  };
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: File[],
  options: FileValidationOptions = {},
): { valid: File[]; rejected: Array<{ file: File; error: string }> } {
  const { maxFiles } = options;
  const valid: File[] = [];
  const rejected: Array<{ file: File; error: string }> = [];

  for (const file of files) {
    // Check max files limit
    if (maxFiles && valid.length >= maxFiles) {
      rejected.push({
        file,
        error: `Maximum of ${maxFiles} files allowed`,
      });
      continue;
    }

    const result = validateFile(file, options);
    if (result.valid) {
      valid.push(file);
    } else {
      rejected.push({
        file,
        error: result.error || "Invalid file",
      });
    }
  }

  return { valid, rejected };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get accept string for file input
 *
 * @example
 * getAcceptString(["IMAGE"]) // "image/*"
 * getAcceptString(["IMAGE", "VIDEO"]) // "image/*,video/*"
 */
export function getAcceptString(mediaTypes: MediaType[]): string {
  const patterns: string[] = [];

  for (const type of mediaTypes) {
    switch (type) {
      case "IMAGE":
        patterns.push("image/*");
        break;
      case "VIDEO":
        patterns.push("video/*");
        break;
      case "AUDIO":
        patterns.push("audio/*");
        break;
      case "DOCUMENT":
        patterns.push(".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv");
        break;
    }
  }

  return patterns.join(",");
}

/**
 * Generate a unique file name
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = getFileExtension(originalName);
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 50);

  return `${sanitized}-${timestamp}-${random}.${ext}`;
}
