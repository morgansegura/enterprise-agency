/**
 * Lightbox System
 *
 * Full-screen image/video viewer with gallery navigation.
 *
 * @module @enterprise/media/lightbox
 */

// Lightbox component
export { Lightbox, type LightboxProps } from "./lightbox";

// Context and provider
export {
  LightboxProvider,
  type LightboxProviderProps,
  type LightboxImage,
  type LightboxContextValue,
} from "./lightbox-context";

// Hook
export { useLightbox, useLightboxRequired } from "./use-lightbox";
