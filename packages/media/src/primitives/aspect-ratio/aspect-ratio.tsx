/**
 * AspectRatio Component
 *
 * Maintains consistent aspect ratio for media containers.
 * Used by Image and Video components for responsive layouts.
 *
 * @module @enterprise/media/primitives/aspect-ratio
 */

"use client";

import * as React from "react";
import { cn } from "@enterprise/tokens";
import type { AspectRatio as AspectRatioType } from "../../types";

// ============================================================================
// RATIO CALCULATIONS
// ============================================================================

/**
 * Convert ratio string to padding-bottom percentage
 */
function getRatioPadding(ratio: AspectRatioType): string {
  const ratios: Record<string, number> = {
    "1:1": 100,
    "4:3": 75,
    "16:9": 56.25,
    "21:9": 42.86,
    "3:2": 66.67,
    "2:3": 150,
    "9:16": 177.78,
  };

  return `${ratios[ratio] || 56.25}%`;
}

// ============================================================================
// TYPES
// ============================================================================

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Aspect ratio to maintain
   * @default '16:9'
   */
  ratio?: AspectRatioType;
  /**
   * Custom ratio as number (width / height)
   * Overrides the ratio prop if provided
   */
  customRatio?: number;
  children: React.ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * AspectRatio - Maintains consistent aspect ratio for content
 *
 * @example
 * ```tsx
 * <AspectRatio ratio="16:9">
 *   <Image src="/hero.jpg" alt="Hero" fill />
 * </AspectRatio>
 * ```
 */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  (
    { ratio = "16:9", customRatio, className, children, style, ...props },
    ref,
  ) => {
    const paddingBottom = customRatio
      ? `${(1 / customRatio) * 100}%`
      : ratio === "auto"
        ? undefined
        : getRatioPadding(ratio);

    // For 'auto' ratio, don't apply aspect ratio styles
    if (ratio === "auto" && !customRatio) {
      return (
        <div
          ref={ref}
          data-slot="aspect-ratio"
          data-ratio="auto"
          className={cn("aspect-ratio-auto", className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="aspect-ratio"
        data-ratio={ratio}
        className={cn("aspect-ratio relative w-full", className)}
        style={{ ...style, paddingBottom }}
        {...props}
      >
        <div data-slot="aspect-ratio-content" className="absolute inset-0">
          {children}
        </div>
      </div>
    );
  },
);

AspectRatio.displayName = "AspectRatio";
