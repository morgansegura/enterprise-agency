/**
 * Video Component
 *
 * Enterprise-grade video player with:
 * - Lazy loading with intersection observer
 * - Custom controls with accessibility
 * - Poster image support
 * - Multiple source formats
 * - Caption/subtitle tracks
 * - Respects prefers-reduced-motion
 * - YouTube/Vimeo embed support
 *
 * @module @enterprise/media/primitives/video
 */

"use client";

import * as React from "react";
import { cn } from "@enterprise/tokens";
import type {
  AspectRatio as AspectRatioType,
  VideoSource,
  VideoTrack,
} from "../../types";
import {
  parseVideoUrl,
  getYouTubeEmbedUrl,
  getVimeoEmbedUrl,
} from "../../utils/video-url-parser";
import { AspectRatio } from "../aspect-ratio";
import { Image } from "../image";
import { useVideoPlayer } from "./use-video-player";
import { VideoControls } from "./video-controls";

// ============================================================================
// ICONS
// ============================================================================

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

// ============================================================================
// TYPES
// ============================================================================

export interface VideoProps
  extends Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    "src" | "onError" | "onPlay" | "onPause" | "onEnded" | "onTimeUpdate"
  > {
  /**
   * Video sources (multiple formats for browser compatibility)
   */
  sources?: VideoSource[];
  /**
   * Single source URL (convenience prop)
   */
  src?: string;
  /**
   * Poster image URL
   */
  poster?: string;
  /**
   * BlurHash for poster loading
   */
  posterBlurHash?: string;
  /**
   * Caption/subtitle tracks
   */
  tracks?: VideoTrack[];
  /**
   * Aspect ratio
   * @default '16:9'
   */
  aspectRatio?: AspectRatioType;
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: "default" | "rounded";
  /**
   * Show custom controls
   * @default true
   */
  showControls?: boolean;
  /**
   * Enable lazy loading
   * @default true
   */
  lazy?: boolean;
  /**
   * Autoplay when visible (muted for browser compatibility)
   * @default false
   */
  autoplayOnVisible?: boolean;
  /**
   * Respect prefers-reduced-motion
   * @default true
   */
  respectReducedMotion?: boolean;
  /**
   * YouTube video URL
   */
  youtubeUrl?: string;
  /**
   * Vimeo video URL
   */
  vimeoUrl?: string;
  /**
   * Generic embed URL (YouTube/Vimeo auto-detected)
   */
  embedUrl?: string;
  /**
   * Callbacks
   */
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onError?: (error: Error) => void;
  /**
   * Container className
   */
  containerClassName?: string;
}

// ============================================================================
// VARIANT STYLES
// ============================================================================

const variantStyles: Record<string, string> = {
  default: "",
  rounded: "rounded-md overflow-hidden",
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Video - Enterprise video player component
 *
 * @example
 * ```tsx
 * // Basic usage with sources
 * <Video
 *   sources={[
 *     { src: '/video.mp4', type: 'video/mp4' },
 *     { src: '/video.webm', type: 'video/webm' },
 *   ]}
 *   poster="/poster.jpg"
 * />
 *
 * // Single source
 * <Video src="/video.mp4" poster="/poster.jpg" />
 *
 * // YouTube embed
 * <Video youtubeUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
 *
 * // Vimeo embed
 * <Video vimeoUrl="https://vimeo.com/123456789" />
 *
 * // With captions
 * <Video
 *   src="/video.mp4"
 *   tracks={[
 *     { src: '/captions-en.vtt', kind: 'captions', srclang: 'en', label: 'English', default: true },
 *   ]}
 * />
 * ```
 */
export const Video = React.forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      sources = [],
      src,
      poster,
      posterBlurHash,
      tracks = [],
      aspectRatio = "16:9",
      variant = "default",
      showControls = true,
      lazy = true,
      autoplayOnVisible = false,
      respectReducedMotion = true,
      youtubeUrl,
      vimeoUrl,
      embedUrl,
      className,
      containerClassName,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onError,
      ...props
    },
    ref,
  ) => {
    const {
      videoRef,
      containerRef,
      isVisible,
      isPlaying,
      isMuted,
      isFullscreen,
      currentTime,
      duration,
      buffered,
      volume,
      prefersReducedMotion,
      play,
      togglePlay,
      toggleMute,
      seek,
      setVolume,
      toggleFullscreen,
    } = useVideoPlayer({
      lazy,
      autoplayOnVisible,
      respectReducedMotion,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onError,
    });

    // Forward ref
    React.useImperativeHandle(ref, () => videoRef.current!, [videoRef]);

    // Build sources array from src prop if needed
    const videoSources = React.useMemo(() => {
      if (sources.length > 0) return sources;
      if (src) {
        // Infer type from extension
        const ext = src.split(".").pop()?.toLowerCase();
        const typeMap: Record<string, VideoSource["type"]> = {
          mp4: "video/mp4",
          webm: "video/webm",
          ogg: "video/ogg",
        };
        return [{ src, type: typeMap[ext || "mp4"] || "video/mp4" }];
      }
      return [];
    }, [sources, src]);

    // Detect embed URL
    const detectedEmbed = React.useMemo(() => {
      if (youtubeUrl) {
        const parsed = parseVideoUrl(youtubeUrl);
        if (parsed.provider === "youtube" && parsed.videoId) {
          return getYouTubeEmbedUrl(parsed.videoId, { autoplay: false });
        }
      }
      if (vimeoUrl) {
        const parsed = parseVideoUrl(vimeoUrl);
        if (parsed.provider === "vimeo" && parsed.videoId) {
          return getVimeoEmbedUrl(parsed.videoId, { autoplay: false });
        }
      }
      if (embedUrl) {
        const parsed = parseVideoUrl(embedUrl);
        return parsed.embedUrl || embedUrl;
      }
      return null;
    }, [youtubeUrl, vimeoUrl, embedUrl]);

    // Handle embed videos (YouTube/Vimeo)
    if (detectedEmbed) {
      return (
        <AspectRatio ratio={aspectRatio}>
          <div
            ref={containerRef}
            data-slot="video-container"
            className={cn(
              "relative group",
              variantStyles[variant],
              containerClassName,
            )}
          >
            {isVisible && (
              <iframe
                src={detectedEmbed}
                data-slot="video-embed"
                className={cn("absolute inset-0 w-full h-full", className)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video player"
              />
            )}
          </div>
        </AspectRatio>
      );
    }

    // Native video player content
    const content = (
      <div
        ref={containerRef}
        data-slot="video-container"
        className={cn(
          "relative group",
          variantStyles[variant],
          containerClassName,
        )}
      >
        {/* Poster overlay (shown when not playing) */}
        {!isPlaying && poster && (
          <div className="absolute inset-0 z-10">
            <Image
              src={poster}
              alt="Video poster"
              blurHash={posterBlurHash}
              loadingStyle={posterBlurHash ? "blur" : "skeleton"}
              objectFit="cover"
              className="w-full h-full"
            />
            {/* Play button overlay */}
            <button
              type="button"
              onClick={play}
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
              )}
              aria-label="Play video"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <PlayIcon className="w-8 h-8 ml-1" />
              </div>
            </button>
          </div>
        )}

        {/* Video element */}
        {isVisible && (
          <video
            ref={videoRef}
            data-slot="video"
            className={cn(
              "w-full h-full object-cover",
              isPlaying ? "opacity-100" : "opacity-0",
              className,
            )}
            playsInline
            preload={lazy ? "none" : "metadata"}
            aria-label={props["aria-label"] || "Video player"}
            {...props}
          >
            {videoSources.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
            {tracks.map((track) => (
              <track
                key={track.src}
                src={track.src}
                kind={track.kind}
                srcLang={track.srclang}
                label={track.label}
                default={track.default}
              />
            ))}
            Your browser does not support the video tag.
          </video>
        )}

        {/* Custom controls */}
        {showControls && isVisible && isPlaying && (
          <VideoControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            isFullscreen={isFullscreen}
            currentTime={currentTime}
            duration={duration}
            buffered={buffered}
            volume={volume}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onSeek={seek}
            onVolumeChange={setVolume}
            onFullscreen={toggleFullscreen}
          />
        )}

        {/* Reduced motion notice */}
        {prefersReducedMotion && autoplayOnVisible && (
          <div
            className="absolute bottom-2 left-2 px-2 py-1 text-xs rounded"
            role="status"
          >
            Autoplay disabled (reduced motion)
          </div>
        )}
      </div>
    );

    // Wrap in aspect ratio
    if (aspectRatio === "auto") {
      return content;
    }

    return <AspectRatio ratio={aspectRatio}>{content}</AspectRatio>;
  },
);

Video.displayName = "Video";
