/**
 * Media Utilities
 *
 * Shared utility functions for the @enterprise/media package.
 *
 * @module @enterprise/media/utils
 */

// Formatting utilities
export {
  formatBytes,
  formatDuration,
  formatDurationLong,
  formatRelativeTime,
  formatDimensions,
  calculateAspectRatio,
  parseAspectRatio,
} from "./format";

// File validation utilities
export {
  MEDIA_TYPE_MIME_MAP,
  EXTENSION_MIME_MAP,
  DEFAULT_MAX_FILE_SIZE,
  getMediaTypeFromMime,
  getMimeFromExtension,
  getFileExtension,
  isImageMime,
  isVideoMime,
  isAudioMime,
  validateFileType,
  validateFileSize,
  validateFile,
  validateFiles,
  getAcceptString,
  generateFileName,
} from "./file-validation";

// BlurHash utilities
export {
  type BlurHashOptions,
  type DecodedBlurHash,
  isValidBlurHash,
  decodeBlurHashToPixels,
  decodeBlurHash,
  decodeBlurHashAsync,
  getBlurHashDimensions,
  getBlurHashCss,
  getBlurHashStyle,
} from "./blurhash";

// Video URL parsing utilities
export {
  type VideoProvider,
  type ParsedVideoUrl,
  type VideoEmbedOptions,
  parseYouTubeUrl,
  isYouTubeUrl,
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
  parseVimeoUrl,
  isVimeoUrl,
  getVimeoEmbedUrl,
  getVimeoThumbnailUrl,
  parseVideoUrl,
  getEmbedUrl,
  getThumbnailUrl,
  isDirectVideoUrl,
  isEmbeddableVideoUrl,
  parseTimeString,
  formatTimeString,
} from "./video-url-parser";
