/**
 * ImageError Component
 *
 * Error state with retry capability.
 *
 * @module @enterprise/media/primitives/image
 */

"use client";

import { cn } from "@enterprise/tokens";

// ============================================================================
// ICONS (Inline SVG to avoid external dependencies)
// ============================================================================

function ImageOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83" />
      <line x1="13.5" x2="6" y1="13.5" y2="21" />
      <line x1="18" x2="21" y1="12" y2="15" />
      <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59" />
      <path d="M21 15V5a2 2 0 0 0-2-2H9" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

// ============================================================================
// TYPES
// ============================================================================

export interface ImageErrorProps {
  /**
   * Alt text to display
   */
  alt?: string;
  /**
   * Callback to retry loading
   */
  onRetry?: () => void;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Custom error message
   */
  message?: string;
  /**
   * Show retry button
   * @default true
   */
  showRetry?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Error state for failed images with retry button
 *
 * @example
 * ```tsx
 * <ImageError alt="Photo" onRetry={() => setRetry(true)} />
 * <ImageError message="Custom error message" showRetry={false} />
 * ```
 */
export function ImageError({
  alt,
  onRetry,
  className,
  message = "Failed to load",
  showRetry = true,
}: ImageErrorProps) {
  return (
    <div
      data-slot="image-error"
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center",
        className,
      )}
      role="img"
      aria-label={alt || "Image failed to load"}
    >
      <ImageOffIcon className="h-8 w-8 mb-2 opacity-50" />
      <span className="text-sm opacity-70">{message}</span>
      {showRetry && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            "mt-2 flex items-center gap-1 px-3 py-1",
            "text-xs rounded-md",
            "transition-colors duration-200",
            "hover:opacity-80",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
          )}
        >
          <RefreshIcon className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  );
}

ImageError.displayName = "ImageError";
