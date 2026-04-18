import type { Asset, AssetVariant } from "@/lib/hooks/use-assets";

export function formatBytes(bytes?: number | null): string {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function formatDuration(seconds?: number | null): string {
  if (seconds === null || seconds === undefined) return "—";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function formatDimensions(asset: Asset): string {
  if (!asset.width || !asset.height) return "—";
  return `${asset.width} × ${asset.height}`;
}

export function formatRelativeTime(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < week) return `${Math.floor(diff / day)}d ago`;
  if (diff < month) return `${Math.floor(diff / week)}w ago`;
  if (diff < year) return `${Math.floor(diff / month)}mo ago`;
  return `${Math.floor(diff / year)}y ago`;
}

export function isImage(asset: Asset): boolean {
  return asset.fileType === "image";
}

export function isVideo(asset: Asset): boolean {
  return asset.fileType === "video";
}

export function isAudio(asset: Asset): boolean {
  return asset.fileType === "audio";
}

/**
 * Pick the best thumbnail URL for a grid display.
 * Priority: thumbnail variant → thumbnailUrl → sm variant → url.
 */
export function pickThumbnailUrl(asset: Asset): string | null {
  if (asset.thumbnailUrl) return asset.thumbnailUrl;
  const v = asset.variants;
  if (v?.thumbnail?.url) return v.thumbnail.url;
  if (v?.sm?.url) return v.sm.url;
  if (isImage(asset)) return asset.url;
  return null;
}

/**
 * Build a srcset string from available size variants (JPEG only — WebP/AVIF
 * belong in <picture> sources).
 */
export function buildSrcSet(asset: Asset): string | undefined {
  const v = asset.variants;
  if (!v) return undefined;
  const parts: string[] = [];
  const push = (variant: AssetVariant | undefined) => {
    if (variant) parts.push(`${variant.url} ${variant.width}w`);
  };
  push(v.sm);
  push(v.md);
  push(v.lg);
  push(v.xl);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

export function formatBitRate(bytes: number, durationSec: number): string {
  if (!durationSec) return "—";
  const bitsPerSec = (bytes * 8) / durationSec;
  if (bitsPerSec < 1000) return `${Math.round(bitsPerSec)} bps`;
  if (bitsPerSec < 1_000_000) return `${(bitsPerSec / 1000).toFixed(0)} kbps`;
  return `${(bitsPerSec / 1_000_000).toFixed(1)} Mbps`;
}

export function quotaPercent(used: number, quota: number): number {
  if (!quota) return 0;
  return Math.min(100, Math.round((used / quota) * 100));
}
