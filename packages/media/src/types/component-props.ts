/**
 * Component Prop Types
 *
 * Types for media component props (Image, Video, AspectRatio, etc.)
 *
 * @module @enterprise/media/types
 */

import type { CSSProperties, ReactNode } from "react";

// ============================================================================
// ASPECT RATIO
// ============================================================================

/**
 * Supported aspect ratios for media components
 */
export type AspectRatio =
  | "1:1"
  | "4:3"
  | "16:9"
  | "21:9"
  | "3:2"
  | "2:3"
  | "9:16"
  | "auto";

/**
 * AspectRatio component props
 */
export interface AspectRatioProps {
  /** Aspect ratio to maintain */
  ratio: AspectRatio | number;
  /** Content to display */
  children: ReactNode;
  /** Additional class name */
  className?: string;
  /** Custom styles */
  style?: CSSProperties;
}

// ============================================================================
// IMAGE
// ============================================================================

/**
 * Image loading style
 */
export type ImageLoadingStyle = "blur" | "skeleton" | "none";

/**
 * Image object fit
 */
export type ImageObjectFit =
  | "contain"
  | "cover"
  | "fill"
  | "none"
  | "scale-down";

/**
 * Image loading state
 */
export interface ImageLoadingState {
  /** Whether the image is currently loading */
  isLoading: boolean;
  /** Whether the image failed to load */
  hasError: boolean;
  /** Whether the image is visible in viewport */
  isVisible: boolean;
}

/**
 * Image component props
 */
export interface ImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility (required) */
  alt: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Fill container (use with aspectRatio) */
  fill?: boolean;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Loading strategy */
  loading?: "lazy" | "eager";
  /** Priority loading (disables lazy) */
  priority?: boolean;
  /** Loading style */
  loadingStyle?: ImageLoadingStyle;
  /** BlurHash placeholder string */
  blurHash?: string;
  /** Base64 blur data URL */
  blurDataUrl?: string;
  /** Object fit mode */
  objectFit?: ImageObjectFit;
  /** Object position */
  objectPosition?: string;
  /** Aspect ratio container */
  aspectRatio?: AspectRatio;
  /** Enable lightbox on click */
  enableLightbox?: boolean;
  /** Fallback image URL on error */
  fallbackSrc?: string;
  /** Load callback */
  onLoad?: () => void;
  /** Error callback */
  onError?: (error: Error) => void;
  /** Retry callback */
  onRetry?: () => void;
  /** Additional class name */
  className?: string;
  /** Container class name */
  containerClassName?: string;
  /** Custom styles */
  style?: CSSProperties;
}

// ============================================================================
// VIDEO
// ============================================================================

/**
 * Video source with format type
 */
export interface VideoSource {
  src: string;
  type: "video/mp4" | "video/webm" | "video/ogg";
}

/**
 * Video caption/subtitle track
 */
export interface VideoTrack {
  src: string;
  kind: "subtitles" | "captions" | "descriptions";
  srclang: string;
  label: string;
  default?: boolean;
}

/**
 * Video player state
 */
export interface VideoPlayerState extends ImageLoadingState {
  /** Whether the video is playing */
  isPlaying: boolean;
  /** Whether the video is muted */
  isMuted: boolean;
  /** Whether the video is fullscreen */
  isFullscreen: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Buffered amount in seconds */
  buffered: number;
  /** Volume level (0-1) */
  volume: number;
  /** Playback rate */
  playbackRate: number;
}

/**
 * Video component props
 */
export interface VideoProps {
  /** Video sources (multiple formats for compatibility) */
  sources?: VideoSource[];
  /** Single source URL (convenience prop) */
  src?: string;
  /** Poster image URL */
  poster?: string;
  /** BlurHash for poster loading */
  posterBlurHash?: string;
  /** Video title for accessibility */
  title?: string;
  /** Caption/subtitle tracks */
  tracks?: VideoTrack[];
  /** Aspect ratio */
  aspectRatio?: AspectRatio;
  /** Auto-play when visible */
  autoPlay?: boolean;
  /** Start muted */
  muted?: boolean;
  /** Loop playback */
  loop?: boolean;
  /** Show controls */
  controls?: boolean;
  /** Use native browser controls */
  nativeControls?: boolean;
  /** Plays inline on mobile */
  playsInline?: boolean;
  /** Enable lazy loading */
  lazy?: boolean;
  /** Autoplay when visible (respects reduced motion) */
  autoplayOnVisible?: boolean;
  /** Respect prefers-reduced-motion */
  respectReducedMotion?: boolean;
  /** YouTube video URL or ID */
  youtubeUrl?: string;
  /** Vimeo video URL or ID */
  vimeoUrl?: string;
  /** Play callback */
  onPlay?: () => void;
  /** Pause callback */
  onPause?: () => void;
  /** Ended callback */
  onEnded?: () => void;
  /** Time update callback */
  onTimeUpdate?: (currentTime: number) => void;
  /** Progress callback */
  onProgress?: (buffered: number) => void;
  /** Error callback */
  onError?: (error: Error) => void;
  /** Additional class name */
  className?: string;
  /** Container class name */
  containerClassName?: string;
  /** Custom styles */
  style?: CSSProperties;
}

// ============================================================================
// LIGHTBOX
// ============================================================================

/**
 * Lightbox image item
 */
export interface LightboxImage {
  /** Image source URL */
  src: string;
  /** Alt text */
  alt: string;
  /** Optional caption */
  caption?: string;
  /** Optional width */
  width?: number;
  /** Optional height */
  height?: number;
}

/**
 * Lightbox context value
 */
export interface LightboxContextValue {
  /** Whether lightbox is open */
  isOpen: boolean;
  /** Current image index */
  currentIndex: number;
  /** Array of images */
  images: LightboxImage[];
  /** Open lightbox */
  open: (images: LightboxImage[], startIndex?: number) => void;
  /** Close lightbox */
  close: () => void;
  /** Go to next image */
  next: () => void;
  /** Go to previous image */
  prev: () => void;
  /** Go to specific index */
  goTo: (index: number) => void;
  /** Register an image for lightbox */
  register: (image: LightboxImage) => void;
  /** Unregister an image */
  unregister: (src: string) => void;
}

/**
 * Lightbox component props
 */
export interface LightboxProps {
  /** Whether to show navigation */
  showNavigation?: boolean;
  /** Whether to show counter (1/5) */
  showCounter?: boolean;
  /** Whether to show caption */
  showCaption?: boolean;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Additional class name */
  className?: string;
}

/**
 * Lightbox provider props
 */
export interface LightboxProviderProps {
  children: ReactNode;
}
