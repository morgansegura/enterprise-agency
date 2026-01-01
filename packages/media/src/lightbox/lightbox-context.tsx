/**
 * Lightbox Context
 *
 * Context-based state management for the lightbox component.
 *
 * @module @enterprise/media/lightbox
 */

"use client";

import * as React from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface LightboxImage {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional image width */
  width?: number;
  /** Optional image height */
  height?: number;
  /** Optional caption */
  caption?: string;
  /** Optional BlurHash for placeholder */
  blurHash?: string;
}

export interface LightboxContextValue {
  /** Whether lightbox is open */
  isOpen: boolean;
  /** Current image being displayed */
  currentImage: LightboxImage | null;
  /** All images in the gallery */
  images: LightboxImage[];
  /** Current image index */
  currentIndex: number;
  /** Current zoom level */
  zoom: number;
  /** Pan position */
  position: { x: number; y: number };
  /** Open lightbox with an image (optionally with gallery) */
  openLightbox: (image: LightboxImage, images?: LightboxImage[]) => void;
  /** Close lightbox */
  closeLightbox: () => void;
  /** Navigate to next image */
  nextImage: () => void;
  /** Navigate to previous image */
  prevImage: () => void;
  /** Navigate to specific image */
  goToImage: (index: number) => void;
  /** Zoom in */
  zoomIn: () => void;
  /** Zoom out */
  zoomOut: () => void;
  /** Reset zoom to 1x */
  resetZoom: () => void;
  /** Set zoom level */
  setZoom: (zoom: number) => void;
  /** Set pan position */
  setPosition: (position: { x: number; y: number }) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const LightboxContext = React.createContext<LightboxContextValue | null>(null);

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access lightbox context
 *
 * @example
 * ```tsx
 * const { openLightbox, closeLightbox } = useLightbox();
 *
 * // Open a single image
 * openLightbox({ src: '/photo.jpg', alt: 'My photo' });
 *
 * // Open a gallery
 * openLightbox(
 *   { src: '/photo1.jpg', alt: 'Photo 1' },
 *   [
 *     { src: '/photo1.jpg', alt: 'Photo 1' },
 *     { src: '/photo2.jpg', alt: 'Photo 2' },
 *   ]
 * );
 * ```
 */
export function useLightbox(): LightboxContextValue {
  const context = React.useContext(LightboxContext);

  if (!context) {
    // Return a no-op implementation if not wrapped in provider
    // This allows components to work without requiring the provider
    return {
      isOpen: false,
      currentImage: null,
      images: [],
      currentIndex: -1,
      zoom: 1,
      position: { x: 0, y: 0 },
      openLightbox: () => {},
      closeLightbox: () => {},
      nextImage: () => {},
      prevImage: () => {},
      goToImage: () => {},
      zoomIn: () => {},
      zoomOut: () => {},
      resetZoom: () => {},
      setZoom: () => {},
      setPosition: () => {},
    };
  }

  return context;
}

/**
 * Hook that throws if not wrapped in LightboxProvider
 * Use this when the lightbox is required
 */
export function useLightboxRequired(): LightboxContextValue {
  const context = React.useContext(LightboxContext);

  if (!context) {
    throw new Error(
      "useLightboxRequired must be used within a LightboxProvider",
    );
  }

  return context;
}

// ============================================================================
// PROVIDER
// ============================================================================

export interface LightboxProviderProps {
  /** Children */
  children: React.ReactNode;
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Zoom step for keyboard/button controls */
  zoomStep?: number;
}

/**
 * Provider for lightbox state
 *
 * @example
 * ```tsx
 * <LightboxProvider>
 *   <Image src="/photo.jpg" alt="Photo" enableLightbox />
 *   <Lightbox />
 * </LightboxProvider>
 * ```
 */
export function LightboxProvider({
  children,
  minZoom = 0.5,
  maxZoom = 3,
  zoomStep = 0.25,
}: LightboxProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [images, setImages] = React.useState<LightboxImage[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [zoom, setZoomState] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const currentImage = currentIndex >= 0 ? images[currentIndex] : null;

  // Reset zoom when image changes
  React.useEffect(() => {
    setZoomState(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  const openLightbox = React.useCallback(
    (image: LightboxImage, imageList?: LightboxImage[]) => {
      const list = imageList || [image];
      const index = list.findIndex((img) => img.src === image.src);

      setImages(list);
      setCurrentIndex(index >= 0 ? index : 0);
      setZoomState(1);
      setPosition({ x: 0, y: 0 });
      setIsOpen(true);
    },
    [],
  );

  const closeLightbox = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const nextImage = React.useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = React.useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = React.useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index);
      }
    },
    [images.length],
  );

  const zoomIn = React.useCallback(() => {
    setZoomState((z) => Math.min(z + zoomStep, maxZoom));
  }, [zoomStep, maxZoom]);

  const zoomOut = React.useCallback(() => {
    setZoomState((z) => Math.max(z - zoomStep, minZoom));
  }, [zoomStep, minZoom]);

  const resetZoom = React.useCallback(() => {
    setZoomState(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const setZoom = React.useCallback(
    (newZoom: number) => {
      setZoomState(Math.max(minZoom, Math.min(maxZoom, newZoom)));
    },
    [minZoom, maxZoom],
  );

  const value = React.useMemo(
    () => ({
      isOpen,
      currentImage,
      images,
      currentIndex,
      zoom,
      position,
      openLightbox,
      closeLightbox,
      nextImage,
      prevImage,
      goToImage,
      zoomIn,
      zoomOut,
      resetZoom,
      setZoom,
      setPosition,
    }),
    [
      isOpen,
      currentImage,
      images,
      currentIndex,
      zoom,
      position,
      openLightbox,
      closeLightbox,
      nextImage,
      prevImage,
      goToImage,
      zoomIn,
      zoomOut,
      resetZoom,
      setZoom,
      setPosition,
    ],
  );

  return (
    <LightboxContext.Provider value={value}>
      {children}
    </LightboxContext.Provider>
  );
}

LightboxProvider.displayName = "LightboxProvider";
