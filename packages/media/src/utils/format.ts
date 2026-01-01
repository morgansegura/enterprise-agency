/**
 * Format Utilities
 *
 * Helper functions for formatting file sizes, durations, and other values.
 *
 * @module @enterprise/media/utils
 */

/**
 * Format bytes to human-readable string
 *
 * @example
 * formatBytes(1024) // "1 KB"
 * formatBytes(1234567) // "1.18 MB"
 * formatBytes(0) // "0 Bytes"
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format duration in seconds to human-readable string
 *
 * @example
 * formatDuration(65) // "1:05"
 * formatDuration(3661) // "1:01:01"
 * formatDuration(30) // "0:30"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format duration to descriptive string (e.g., "2 min 30 sec")
 *
 * @example
 * formatDurationLong(65) // "1 min 5 sec"
 * formatDurationLong(3661) // "1 hr 1 min"
 */
export function formatDurationLong(seconds: number): string {
  if (!seconds || seconds < 0) return "0 sec";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hr`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }
  if (secs > 0 && hours === 0) {
    parts.push(`${secs} sec`);
  }

  return parts.join(" ") || "0 sec";
}

/**
 * Format date to relative time string
 *
 * @example
 * formatRelativeTime(new Date()) // "just now"
 * formatRelativeTime(new Date(Date.now() - 60000)) // "1 minute ago"
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  }
  if (seconds < 86400) {
    const hrs = Math.floor(seconds / 3600);
    return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  }
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (seconds < 2592000) {
    const weeks = Math.floor(seconds / 604800);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  return then.toLocaleDateString();
}

/**
 * Format dimensions to string
 *
 * @example
 * formatDimensions(1920, 1080) // "1920 × 1080"
 * formatDimensions(null, null) // ""
 */
export function formatDimensions(
  width: number | null,
  height: number | null,
): string {
  if (width == null || height == null) return "";
  return `${width} × ${height}`;
}

/**
 * Calculate aspect ratio from dimensions
 *
 * @example
 * calculateAspectRatio(1920, 1080) // "16:9"
 * calculateAspectRatio(1080, 1080) // "1:1"
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Parse aspect ratio string to numeric value
 *
 * @example
 * parseAspectRatio("16:9") // 1.777...
 * parseAspectRatio("1:1") // 1
 * parseAspectRatio("auto") // null
 */
export function parseAspectRatio(ratio: string): number | null {
  if (ratio === "auto") return null;

  const [w, h] = ratio.split(":").map(Number);
  if (isNaN(w) || isNaN(h) || h === 0) return null;

  return w / h;
}
