/**
 * Image Primitive
 *
 * Enterprise-grade image component with lazy loading, blur placeholders,
 * and lightbox integration.
 *
 * @module @enterprise/media/primitives/image
 */

export { Image, type ImageProps } from "./image";
export {
  useImageLoading,
  type UseImageLoadingOptions,
  type UseImageLoadingReturn,
} from "./use-image-loading";
export { ImageSkeleton, type ImageSkeletonProps } from "./image-skeleton";
export { ImageError, type ImageErrorProps } from "./image-error";
