/**
 * Media Primitives
 *
 * Core display components for images, videos, and aspect ratios.
 *
 * @module @enterprise/media/primitives
 */

// AspectRatio
export { AspectRatio, type AspectRatioProps } from "./aspect-ratio";

// Image
export { Image, type ImageProps } from "./image";
export {
  useImageLoading,
  type UseImageLoadingOptions,
  type UseImageLoadingReturn,
} from "./image/use-image-loading";
export { ImageSkeleton, type ImageSkeletonProps } from "./image/image-skeleton";
export { ImageError, type ImageErrorProps } from "./image/image-error";

// Video
export { Video, type VideoProps } from "./video";
export { VideoControls, type VideoControlsProps } from "./video/video-controls";
export {
  useVideoPlayer,
  type UseVideoPlayerOptions,
  type UseVideoPlayerReturn,
} from "./video/use-video-player";
