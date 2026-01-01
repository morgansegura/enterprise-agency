/**
 * Video URL Parser Utilities
 *
 * Parse and extract information from YouTube, Vimeo, and other video URLs.
 *
 * @module @enterprise/media/utils
 */

// ============================================================================
// TYPES
// ============================================================================

export type VideoProvider = "youtube" | "vimeo" | "direct" | "unknown";

export interface ParsedVideoUrl {
  /** The detected video provider */
  provider: VideoProvider;
  /** The video ID (for YouTube/Vimeo) */
  videoId: string | null;
  /** The original URL */
  originalUrl: string;
  /** Embed URL for iframe */
  embedUrl: string | null;
  /** Thumbnail URL */
  thumbnailUrl: string | null;
  /** Start time in seconds (if specified) */
  startTime: number | null;
}

export interface VideoEmbedOptions {
  /** Auto-play video */
  autoplay?: boolean;
  /** Start muted */
  muted?: boolean;
  /** Show player controls */
  controls?: boolean;
  /** Loop video */
  loop?: boolean;
  /** Start time in seconds */
  start?: number;
  /** Enable picture-in-picture */
  pip?: boolean;
  /** Enable fullscreen */
  fullscreen?: boolean;
}

// ============================================================================
// YOUTUBE PARSING
// ============================================================================

/**
 * YouTube URL patterns
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - youtube.com/v/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 */
const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/,
];

/**
 * Parse a YouTube URL and extract the video ID
 *
 * @example
 * parseYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
 * // { videoId: "dQw4w9WgXcQ", startTime: null }
 */
export function parseYouTubeUrl(
  url: string,
): { videoId: string; startTime: number | null } | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Parse start time from URL
      let startTime: number | null = null;

      try {
        const urlObj = new URL(url);
        const timeParam = urlObj.searchParams.get("t");
        if (timeParam) {
          startTime = parseTimeString(timeParam);
        }
      } catch {
        // Invalid URL, continue without start time
      }

      return {
        videoId: match[1],
        startTime,
      };
    }
  }

  return null;
}

/**
 * Check if a URL is a YouTube video
 */
export function isYouTubeUrl(url: string): boolean {
  return parseYouTubeUrl(url) !== null;
}

/**
 * Get YouTube embed URL
 *
 * @example
 * getYouTubeEmbedUrl("dQw4w9WgXcQ")
 * // "https://www.youtube.com/embed/dQw4w9WgXcQ"
 */
export function getYouTubeEmbedUrl(
  videoId: string,
  options: VideoEmbedOptions = {},
): string {
  const params = new URLSearchParams();

  if (options.autoplay) params.set("autoplay", "1");
  if (options.muted) params.set("mute", "1");
  if (options.controls === false) params.set("controls", "0");
  if (options.loop) {
    params.set("loop", "1");
    params.set("playlist", videoId); // Required for loop
  }
  if (options.start) params.set("start", String(options.start));
  if (options.pip === false) params.set("disablekb", "1");

  // Always set these for better UX
  params.set("rel", "0"); // Don't show related videos
  params.set("modestbranding", "1"); // Minimal branding

  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`;
}

/**
 * Get YouTube thumbnail URL
 *
 * @example
 * getYouTubeThumbnailUrl("dQw4w9WgXcQ", "maxresdefault")
 * // "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
 */
export function getYouTubeThumbnailUrl(
  videoId: string,
  quality:
    | "default"
    | "mqdefault"
    | "hqdefault"
    | "sddefault"
    | "maxresdefault" = "hqdefault",
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

// ============================================================================
// VIMEO PARSING
// ============================================================================

/**
 * Vimeo URL patterns
 * - vimeo.com/VIDEO_ID
 * - player.vimeo.com/video/VIDEO_ID
 */
const VIMEO_PATTERNS = [
  /vimeo\.com\/(\d+)/,
  /player\.vimeo\.com\/video\/(\d+)/,
];

/**
 * Parse a Vimeo URL and extract the video ID
 *
 * @example
 * parseVimeoUrl("https://vimeo.com/123456789")
 * // { videoId: "123456789", startTime: null }
 */
export function parseVimeoUrl(
  url: string,
): { videoId: string; startTime: number | null } | null {
  for (const pattern of VIMEO_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Parse start time from URL hash
      let startTime: number | null = null;

      try {
        const urlObj = new URL(url);
        const hash = urlObj.hash.replace("#", "");
        if (hash.startsWith("t=")) {
          startTime = parseTimeString(hash.slice(2));
        }
      } catch {
        // Invalid URL, continue without start time
      }

      return {
        videoId: match[1],
        startTime,
      };
    }
  }

  return null;
}

/**
 * Check if a URL is a Vimeo video
 */
export function isVimeoUrl(url: string): boolean {
  return parseVimeoUrl(url) !== null;
}

/**
 * Get Vimeo embed URL
 *
 * @example
 * getVimeoEmbedUrl("123456789")
 * // "https://player.vimeo.com/video/123456789"
 */
export function getVimeoEmbedUrl(
  videoId: string,
  options: VideoEmbedOptions = {},
): string {
  const params = new URLSearchParams();

  if (options.autoplay) params.set("autoplay", "1");
  if (options.muted) params.set("muted", "1");
  if (options.loop) params.set("loop", "1");
  if (options.controls === false) params.set("controls", "0");
  if (options.pip === false) params.set("pip", "0");

  // Better defaults
  params.set("byline", "0"); // Hide byline
  params.set("portrait", "0"); // Hide portrait
  params.set("title", "0"); // Hide title

  const queryString = params.toString();
  let embedUrl = `https://player.vimeo.com/video/${videoId}`;
  if (queryString) embedUrl += `?${queryString}`;
  if (options.start) embedUrl += `#t=${options.start}s`;

  return embedUrl;
}

/**
 * Get Vimeo thumbnail URL (requires API call in practice)
 * This returns a placeholder - real implementation needs Vimeo API
 */
export function getVimeoThumbnailUrl(videoId: string): string {
  // Vimeo doesn't have a public thumbnail URL pattern like YouTube
  // This would need to be fetched from their oEmbed API
  return `https://vumbnail.com/${videoId}.jpg`;
}

// ============================================================================
// UNIFIED PARSING
// ============================================================================

/**
 * Parse any video URL and return provider-agnostic info
 *
 * @example
 * parseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
 * // { provider: "youtube", videoId: "dQw4w9WgXcQ", embedUrl: "...", ... }
 */
export function parseVideoUrl(url: string): ParsedVideoUrl {
  // Try YouTube
  const youtubeResult = parseYouTubeUrl(url);
  if (youtubeResult) {
    return {
      provider: "youtube",
      videoId: youtubeResult.videoId,
      originalUrl: url,
      embedUrl: getYouTubeEmbedUrl(youtubeResult.videoId),
      thumbnailUrl: getYouTubeThumbnailUrl(youtubeResult.videoId),
      startTime: youtubeResult.startTime,
    };
  }

  // Try Vimeo
  const vimeoResult = parseVimeoUrl(url);
  if (vimeoResult) {
    return {
      provider: "vimeo",
      videoId: vimeoResult.videoId,
      originalUrl: url,
      embedUrl: getVimeoEmbedUrl(vimeoResult.videoId),
      thumbnailUrl: getVimeoThumbnailUrl(vimeoResult.videoId),
      startTime: vimeoResult.startTime,
    };
  }

  // Check if it's a direct video URL
  if (isDirectVideoUrl(url)) {
    return {
      provider: "direct",
      videoId: null,
      originalUrl: url,
      embedUrl: null, // Direct videos don't need embedding
      thumbnailUrl: null,
      startTime: null,
    };
  }

  // Unknown provider
  return {
    provider: "unknown",
    videoId: null,
    originalUrl: url,
    embedUrl: null,
    thumbnailUrl: null,
    startTime: null,
  };
}

/**
 * Get embed URL for any video provider
 */
export function getEmbedUrl(
  url: string,
  options: VideoEmbedOptions = {},
): string | null {
  const parsed = parseVideoUrl(url);

  if (parsed.provider === "youtube" && parsed.videoId) {
    return getYouTubeEmbedUrl(parsed.videoId, options);
  }

  if (parsed.provider === "vimeo" && parsed.videoId) {
    return getVimeoEmbedUrl(parsed.videoId, options);
  }

  return null;
}

/**
 * Get thumbnail URL for any video provider
 */
export function getThumbnailUrl(url: string): string | null {
  const parsed = parseVideoUrl(url);
  return parsed.thumbnailUrl;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Check if URL is a direct video file
 */
export function isDirectVideoUrl(url: string): boolean {
  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".ogv",
    ".mov",
    ".avi",
    ".wmv",
    ".m4v",
  ];

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return videoExtensions.some((ext) => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Check if URL is an embeddable video (YouTube/Vimeo)
 */
export function isEmbeddableVideoUrl(url: string): boolean {
  return isYouTubeUrl(url) || isVimeoUrl(url);
}

/**
 * Parse time string (e.g., "1m30s", "90", "1:30") to seconds
 */
export function parseTimeString(time: string): number | null {
  if (!time) return null;

  // Handle "1m30s" format
  const minsMatch = time.match(/(\d+)m/);
  const secsMatch = time.match(/(\d+)s/);

  if (minsMatch || secsMatch) {
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    const secs = secsMatch ? parseInt(secsMatch[1], 10) : 0;
    return mins * 60 + secs;
  }

  // Handle "1:30" format
  if (time.includes(":")) {
    const parts = time.split(":").map((p) => parseInt(p, 10));
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  // Handle plain seconds
  const seconds = parseInt(time, 10);
  return isNaN(seconds) ? null : seconds;
}

/**
 * Format seconds to time string (e.g., "1:30")
 */
export function formatTimeString(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
