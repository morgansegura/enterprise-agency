/**
 * Lightbox Component
 *
 * Full-screen image viewer with navigation, zoom, and keyboard controls.
 *
 * @module @enterprise/media/lightbox
 */

"use client";

import * as React from "react";
import { cn } from "@enterprise/tokens";
import { useLightbox } from "./use-lightbox";

// ============================================================================
// ICONS (Inline SVG to avoid external dependencies)
// ============================================================================

function CloseIcon({ className }: { className?: string }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
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
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ZoomInIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function ZoomOutIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function RotateCcwIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

// ============================================================================
// TYPES
// ============================================================================

export interface LightboxProps {
  /** Additional class name */
  className?: string;
  /** Whether to show zoom controls */
  showZoomControls?: boolean;
  /** Whether to show navigation buttons */
  showNavigation?: boolean;
  /** Whether to show image counter */
  showCounter?: boolean;
  /** Whether to show caption */
  showCaption?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Lightbox - Full-screen image viewer
 *
 * Must be wrapped in LightboxProvider to function.
 * Place this component at the root of your application.
 *
 * @example
 * ```tsx
 * <LightboxProvider>
 *   <Image src="/photo.jpg" alt="Photo" enableLightbox />
 *   <Lightbox />
 * </LightboxProvider>
 * ```
 *
 * Keyboard shortcuts:
 * - Escape: Close lightbox
 * - ArrowLeft: Previous image
 * - ArrowRight: Next image
 * - +/=: Zoom in
 * - -: Zoom out
 * - 0: Reset zoom
 */
export function Lightbox({
  className,
  showZoomControls = true,
  showNavigation = true,
  showCounter = true,
  showCaption = true,
  animationDuration = 200,
}: LightboxProps) {
  const {
    isOpen,
    currentImage,
    images,
    currentIndex,
    zoom,
    position,
    closeLightbox,
    nextImage,
    prevImage,
    zoomIn,
    zoomOut,
    resetZoom,
    setPosition,
  } = useLightbox();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const imageRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevImage();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextImage();
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "0":
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLightbox, nextImage, prevImage, zoomIn, zoomOut, resetZoom]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus trap
  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isOpen]);

  // Drag/pan handlers for zoomed images
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      }
    },
    [zoom, position],
  );

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, zoom, dragStart, setPosition],
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      if (zoom > 1 && e.touches.length === 1) {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y,
        });
      }
    },
    [zoom, position],
  );

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (isDragging && zoom > 1 && e.touches.length === 1) {
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        });
      }
    },
    [isDragging, zoom, dragStart, setPosition],
  );

  const handleTouchEnd = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  // Swipe navigation for mobile (when not zoomed)
  const touchStartX = React.useRef<number | null>(null);

  const handleSwipeStart = React.useCallback(
    (e: React.TouchEvent) => {
      if (zoom === 1) {
        touchStartX.current = e.touches[0].clientX;
      }
    },
    [zoom],
  );

  const handleSwipeEnd = React.useCallback(
    (e: React.TouchEvent) => {
      if (zoom === 1 && touchStartX.current !== null) {
        const diff = e.changedTouches[0].clientX - touchStartX.current;
        const threshold = 50;

        if (diff > threshold) {
          prevImage();
        } else if (diff < -threshold) {
          nextImage();
        }

        touchStartX.current = null;
      }
    },
    [zoom, prevImage, nextImage],
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeLightbox();
    }
  };

  if (!isOpen || !currentImage) return null;

  const hasMultiple = images.length > 1;

  return (
    <div
      ref={containerRef}
      data-slot="lightbox"
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        className,
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      tabIndex={-1}
      style={
        {
          "--lightbox-animation-duration": `${animationDuration}ms`,
        } as React.CSSProperties
      }
    >
      {/* Backdrop */}
      <div
        data-slot="lightbox-backdrop"
        className="absolute inset-0"
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        type="button"
        onClick={closeLightbox}
        data-slot="lightbox-close"
        className={cn(
          "absolute top-4 right-4 z-10",
          "p-2 rounded-full",
          "transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
        )}
        aria-label="Close lightbox"
      >
        <CloseIcon className="w-6 h-6" />
      </button>

      {/* Zoom controls */}
      {showZoomControls && (
        <div
          data-slot="lightbox-zoom-controls"
          className="absolute top-4 left-4 z-10 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className={cn(
              "p-2 rounded-full",
              "transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
            )}
            aria-label="Zoom out"
          >
            <ZoomOutIcon className="w-5 h-5" />
          </button>

          <span
            data-slot="lightbox-zoom-level"
            className="min-w-[3rem] text-center text-sm tabular-nums"
          >
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 3}
            className={cn(
              "p-2 rounded-full",
              "transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
            )}
            aria-label="Zoom in"
          >
            <ZoomInIcon className="w-5 h-5" />
          </button>

          {zoom !== 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className={cn(
                "p-2 rounded-full",
                "transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
              )}
              aria-label="Reset zoom"
            >
              <RotateCcwIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* Navigation - Previous */}
      {showNavigation && hasMultiple && (
        <button
          type="button"
          onClick={prevImage}
          data-slot="lightbox-nav-prev"
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-10",
            "p-3 rounded-full",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
          )}
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
      )}

      {/* Navigation - Next */}
      {showNavigation && hasMultiple && (
        <button
          type="button"
          onClick={nextImage}
          data-slot="lightbox-nav-next"
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-10",
            "p-3 rounded-full",
            "transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
          )}
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      )}

      {/* Image container */}
      <div
        ref={imageRef}
        data-slot="lightbox-image-container"
        className={cn(
          "max-w-[90vw] max-h-[90vh] overflow-hidden",
          zoom > 1 ? "cursor-grab" : "cursor-default",
          isDragging && "cursor-grabbing",
        )}
        style={{
          transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          transition: isDragging
            ? "none"
            : `transform ${animationDuration}ms ease-out`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => {
          handleTouchStart(e);
          handleSwipeStart(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => {
          handleTouchEnd();
          handleSwipeEnd(e);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          data-slot="lightbox-image"
          className="max-w-full max-h-[90vh] object-contain select-none"
          draggable={false}
        />
      </div>

      {/* Counter */}
      {showCounter && hasMultiple && (
        <div
          data-slot="lightbox-counter"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm tabular-nums"
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Caption */}
      {showCaption && (currentImage.alt || currentImage.caption) && (
        <div
          data-slot="lightbox-caption"
          className={cn(
            "absolute left-1/2 -translate-x-1/2",
            "text-center max-w-lg px-4",
            hasMultiple ? "bottom-12" : "bottom-4",
          )}
        >
          {currentImage.caption || currentImage.alt}
        </div>
      )}
    </div>
  );
}

Lightbox.displayName = "Lightbox";
