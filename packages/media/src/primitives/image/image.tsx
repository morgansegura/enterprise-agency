/**
 * Image Component
 *
 * Enterprise-grade image component with:
 * - Lazy loading with intersection observer
 * - Blur placeholder support (blurHash)
 * - Skeleton loading state
 * - Error state with retry
 * - Lightbox integration
 * - Full accessibility
 *
 * @module @enterprise/media/primitives/image
 */

"use client";

import * as React from "react";
import { cn } from "@enterprise/tokens";
import type { AspectRatio as AspectRatioType } from "../../types";
import { decodeBlurHash } from "../../utils/blurhash";
import { AspectRatio } from "../aspect-ratio";
import { useImageLoading } from "./use-image-loading";
import { ImageSkeleton } from "./image-skeleton";
import { ImageError } from "./image-error";

// ============================================================================
// TYPES
// ============================================================================

export interface ImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "onLoad" | "onError" | "placeholder"
  > {
  /**
   * Image source URL
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt: string;
  /**
   * Aspect ratio container (use 'auto' for natural dimensions)
   * @default 'auto'
   */
  aspectRatio?: AspectRatioType;
  /**
   * Image variant
   * @default 'default'
   */
  variant?: "default" | "rounded" | "circle";
  /**
   * Object fit behavior
   * @default 'cover'
   */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /**
   * Loading strategy
   * @default 'skeleton'
   */
  loadingStyle?: "blur" | "skeleton" | "none";
  /**
   * BlurHash placeholder string
   */
  blurHash?: string;
  /**
   * Fallback image URL on error
   */
  fallbackSrc?: string;
  /**
   * Custom error component
   */
  errorComponent?: React.ReactNode;
  /**
   * Enable lightbox on click
   */
  enableLightbox?: boolean;
  /**
   * Lightbox open handler (from context)
   */
  onLightboxOpen?: (src: string, alt: string) => void;
  /**
   * Load callback
   */
  onLoad?: () => void;
  /**
   * Error callback
   */
  onError?: (error: Error) => void;
  /**
   * Retry callback
   */
  onRetry?: () => void;
  /**
   * Container className
   */
  containerClassName?: string;
  /**
   * Priority loading (disables lazy loading)
   */
  priority?: boolean;
  /**
   * Image width
   */
  width?: number | string;
  /**
   * Image height
   */
  height?: number | string;
  /**
   * Sizes attribute for responsive images
   */
  sizes?: string;
  /**
   * Srcset for responsive images
   */
  srcSet?: string;
}

// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<string, string> = {
  default: "",
  rounded: "rounded-md",
  circle: "rounded-full",
};

const objectFitStyles: Record<string, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Image - Enterprise image component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Image src="/photo.jpg" alt="Photo" width={800} height={600} />
 *
 * // With aspect ratio
 * <Image src="/hero.jpg" alt="Hero" aspectRatio="16:9" />
 *
 * // With blur placeholder
 * <Image
 *   src="/photo.jpg"
 *   alt="Photo"
 *   blurHash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
 *   loadingStyle="blur"
 * />
 *
 * // Rounded variant
 * <Image src="/avatar.jpg" alt="User" variant="circle" width={100} height={100} />
 *
 * // Priority loading (above the fold)
 * <Image src="/hero.jpg" alt="Hero" priority />
 * ```
 */
export const Image = React.forwardRef<HTMLDivElement, ImageProps>(
  (
    {
      src,
      alt,
      className,
      containerClassName,
      variant = "default",
      objectFit = "cover",
      aspectRatio = "auto",
      loadingStyle = "skeleton",
      blurHash,
      fallbackSrc,
      errorComponent,
      enableLightbox = false,
      onLightboxOpen,
      onLoad,
      onError,
      onRetry,
      priority = false,
      width,
      height,
      sizes,
      srcSet,
      ...props
    },
    ref,
  ) => {
    const {
      isLoading,
      hasError,
      isVisible,
      handleLoad,
      handleError,
      retry,
      containerRef,
      retryCount,
    } = useImageLoading({
      onLoad,
      onError,
      fallbackSrc,
      eager: priority,
    });

    // Decode blur hash for placeholder
    const blurPlaceholder = React.useMemo(() => {
      if (loadingStyle === "blur" && blurHash) {
        return decodeBlurHash(blurHash);
      }
      return null;
    }, [loadingStyle, blurHash]);

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (
          containerRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, containerRef],
    );

    // Handle click for lightbox
    const handleClick = React.useCallback(() => {
      if (enableLightbox && !hasError) {
        onLightboxOpen?.(src, alt);
      }
    }, [enableLightbox, hasError, src, alt, onLightboxOpen]);

    // Handle keyboard for accessibility
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && enableLightbox) {
          e.preventDefault();
          handleClick();
        }
      },
      [enableLightbox, handleClick],
    );

    // Handle retry
    const handleRetry = React.useCallback(() => {
      retry();
      onRetry?.();
    }, [retry, onRetry]);

    // Build image source with retry cache bust
    const imageSrc = React.useMemo(() => {
      if (retryCount > 0 && src) {
        const separator = src.includes("?") ? "&" : "?";
        return `${src}${separator}_retry=${retryCount}`;
      }
      return src;
    }, [src, retryCount]);

    // Content wrapper
    const content = (
      <div
        ref={combinedRef}
        data-slot="image-container"
        className={cn(
          "relative overflow-hidden",
          variantStyles[variant],
          enableLightbox && "cursor-pointer",
          containerClassName,
        )}
        onClick={enableLightbox ? handleClick : undefined}
        onKeyDown={enableLightbox ? handleKeyDown : undefined}
        tabIndex={enableLightbox ? 0 : undefined}
        role={enableLightbox ? "button" : undefined}
        aria-label={enableLightbox ? `View ${alt} in lightbox` : undefined}
      >
        {/* Blur placeholder */}
        {loadingStyle === "blur" && blurPlaceholder && isLoading && (
          <div
            data-slot="image-placeholder"
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${blurPlaceholder.dataUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
              transform: "scale(1.1)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Loading skeleton */}
        {isLoading && loadingStyle === "skeleton" && <ImageSkeleton />}

        {/* Error state */}
        {hasError &&
          (errorComponent || <ImageError alt={alt} onRetry={handleRetry} />)}

        {/* Image (only render when visible for lazy loading) */}
        {isVisible && !hasError && (
          <img
            src={imageSrc}
            alt={alt}
            data-slot="image"
            data-loading={isLoading}
            data-loaded={!isLoading}
            className={cn(
              "block w-full h-full",
              variantStyles[variant],
              objectFitStyles[objectFit],
              isLoading && loadingStyle !== "blur" && "opacity-0",
              !isLoading && "opacity-100",
              "transition-opacity duration-300",
              className,
            )}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            width={width}
            height={height}
            sizes={sizes}
            srcSet={srcSet}
            {...props}
          />
        )}
      </div>
    );

    // Wrap in aspect ratio if specified
    if (aspectRatio !== "auto") {
      return (
        <AspectRatio ratio={aspectRatio} className={variantStyles[variant]}>
          {content}
        </AspectRatio>
      );
    }

    return content;
  },
);

Image.displayName = "Image";
