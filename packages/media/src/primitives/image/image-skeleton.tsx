/**
 * ImageSkeleton Component
 *
 * Loading placeholder for images with shimmer animation.
 *
 * @module @enterprise/media/primitives/image
 */

"use client";

import { cn } from "@enterprise/tokens";

// ============================================================================
// TYPES
// ============================================================================

export interface ImageSkeletonProps {
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Custom skeleton color (CSS color value)
   */
  color?: string;
  /**
   * Enable shimmer animation
   * @default true
   */
  animate?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Skeleton loading state for images
 *
 * @example
 * ```tsx
 * <ImageSkeleton />
 * <ImageSkeleton animate={false} color="#f0f0f0" />
 * ```
 */
export function ImageSkeleton({
  className,
  color,
  animate = true,
}: ImageSkeletonProps) {
  return (
    <div
      data-slot="image-skeleton"
      className={cn("absolute inset-0", animate && "animate-pulse", className)}
      style={color ? { backgroundColor: color } : undefined}
      aria-hidden="true"
    />
  );
}

ImageSkeleton.displayName = "ImageSkeleton";
