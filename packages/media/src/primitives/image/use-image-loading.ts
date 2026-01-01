/**
 * useImageLoading Hook
 *
 * Handles image loading states with intersection observer for lazy loading.
 *
 * @module @enterprise/media/primitives/image
 */

"use client";

import * as React from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface UseImageLoadingOptions {
  /**
   * Callback when image loads successfully
   */
  onLoad?: () => void;
  /**
   * Callback when image fails to load
   */
  onError?: (error: Error) => void;
  /**
   * Fallback image URL on error
   */
  fallbackSrc?: string;
  /**
   * Root margin for intersection observer
   * @default '200px'
   */
  rootMargin?: string;
  /**
   * Threshold for intersection observer
   * @default 0.1
   */
  threshold?: number;
  /**
   * Disable lazy loading (load immediately)
   * @default false
   */
  eager?: boolean;
}

export interface UseImageLoadingReturn {
  /**
   * Whether the image is currently loading
   */
  isLoading: boolean;
  /**
   * Whether the image failed to load
   */
  hasError: boolean;
  /**
   * Whether the image is visible in viewport
   */
  isVisible: boolean;
  /**
   * Whether the image has loaded successfully
   */
  isLoaded: boolean;
  /**
   * Ref to attach to the container
   */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Handler for image load event
   */
  handleLoad: () => void;
  /**
   * Handler for image error event
   */
  handleError: () => void;
  /**
   * Retry loading the image
   */
  retry: () => void;
  /**
   * Current retry count
   */
  retryCount: number;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for managing image loading states
 *
 * @example
 * ```tsx
 * const {
 *   isLoading,
 *   hasError,
 *   isVisible,
 *   containerRef,
 *   handleLoad,
 *   handleError,
 *   retry,
 * } = useImageLoading({
 *   onLoad: () => console.log('Loaded'),
 *   onError: (err) => console.error(err),
 * });
 * ```
 */
export function useImageLoading(
  options: UseImageLoadingOptions = {},
): UseImageLoadingReturn {
  const {
    onLoad,
    onError,
    rootMargin = "200px",
    threshold = 0.1,
    eager = false,
  } = options;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(eager);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);

  // Intersection observer for lazy loading
  React.useEffect(() => {
    // Skip observer if eager loading
    if (eager) {
      setIsVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    // Check if IntersectionObserver is available (SSR safety)
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, eager]);

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = React.useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setIsLoaded(false);
    onError?.(new Error("Image failed to load"));
  }, [onError]);

  const retry = React.useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setIsLoaded(false);
    setRetryCount((c) => c + 1);
  }, []);

  return {
    isLoading,
    hasError,
    isVisible,
    isLoaded,
    containerRef,
    handleLoad,
    handleError,
    retry,
    retryCount,
  };
}
