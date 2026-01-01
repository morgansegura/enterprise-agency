/**
 * useVideoPlayer Hook
 *
 * Manages video player state and controls with lazy loading support.
 *
 * @module @enterprise/media/primitives/video
 */

"use client";

import * as React from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface UseVideoPlayerOptions {
  /**
   * Enable lazy loading
   * @default true
   */
  lazy?: boolean;
  /**
   * Autoplay when visible (respects reduced motion)
   * @default false
   */
  autoplayOnVisible?: boolean;
  /**
   * Respect prefers-reduced-motion setting
   * @default true
   */
  respectReducedMotion?: boolean;
  /**
   * Root margin for intersection observer
   * @default '200px'
   */
  rootMargin?: string;
  /**
   * Callbacks
   */
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onProgress?: (buffered: number) => void;
  onError?: (error: Error) => void;
}

export interface UseVideoPlayerReturn {
  /** Ref to attach to the video element */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the video is visible in viewport */
  isVisible: boolean;
  /** Whether the video is loading */
  isLoading: boolean;
  /** Whether the video is currently playing */
  isPlaying: boolean;
  /** Whether the video is muted */
  isMuted: boolean;
  /** Whether the video is in fullscreen mode */
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
  /** Whether user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Play the video */
  play: () => Promise<void>;
  /** Pause the video */
  pause: () => void;
  /** Toggle play/pause */
  togglePlay: () => void;
  /** Toggle mute */
  toggleMute: () => void;
  /** Seek to a specific time */
  seek: (time: number) => void;
  /** Set volume (0-1) */
  setVolume: (volume: number) => void;
  /** Set playback rate */
  setPlaybackRate: (rate: number) => void;
  /** Enter fullscreen */
  enterFullscreen: () => Promise<void>;
  /** Exit fullscreen */
  exitFullscreen: () => Promise<void>;
  /** Toggle fullscreen */
  toggleFullscreen: () => Promise<void>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for managing video player state and controls
 *
 * @example
 * ```tsx
 * const {
 *   videoRef,
 *   containerRef,
 *   isPlaying,
 *   togglePlay,
 *   seek,
 * } = useVideoPlayer({
 *   onPlay: () => console.log('Playing'),
 *   onPause: () => console.log('Paused'),
 * });
 * ```
 */
export function useVideoPlayer(
  options: UseVideoPlayerOptions = {},
): UseVideoPlayerReturn {
  const {
    lazy = true,
    autoplayOnVisible = false,
    respectReducedMotion = true,
    rootMargin = "200px",
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onProgress,
    onError,
  } = options;

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] = React.useState(!lazy);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [volume, setVolumeState] = React.useState(1);
  const [playbackRate, setPlaybackRateState] = React.useState(1);

  // Check for reduced motion preference
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Intersection observer for lazy loading
  React.useEffect(() => {
    if (!lazy) return;

    const element = containerRef.current;
    if (!element) return;

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
      { rootMargin, threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [lazy, rootMargin]);

  // Autoplay when visible (if enabled and no reduced motion)
  React.useEffect(() => {
    if (!autoplayOnVisible || !isVisible) return;
    if (respectReducedMotion && prefersReducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    // Try to autoplay muted (browsers allow this)
    video.muted = true;
    video.play().catch(() => {
      // Autoplay blocked, that's okay
    });
  }, [
    autoplayOnVisible,
    isVisible,
    respectReducedMotion,
    prefersReducedMotion,
  ]);

  // Video event handlers
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };

    const handleProgressUpdate = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered(bufferedEnd);
        onProgress?.(bufferedEnd);
      }
    };

    const handleVolumeChange = () => {
      setVolumeState(video.volume);
      setIsMuted(video.muted);
    };

    const handleRateChange = () => {
      setPlaybackRateState(video.playbackRate);
    };

    const handleError = () => {
      setIsLoading(false);
      onError?.(new Error("Video failed to load"));
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgressUpdate);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("ratechange", handleRateChange);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("progress", handleProgressUpdate);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("ratechange", handleRateChange);
      video.removeEventListener("error", handleError);
    };
  }, [onPlay, onPause, onEnded, onTimeUpdate, onProgress, onError]);

  // Fullscreen change handler
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Control functions
  const play = React.useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
    } catch {
      // Play was prevented, try muted
      video.muted = true;
      await video.play();
    }
  }, []);

  const pause = React.useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const togglePlay = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  const toggleMute = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  }, []);

  const seek = React.useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
  }, []);

  const setVolume = React.useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = Math.max(0, Math.min(newVolume, 1));
    if (newVolume > 0) {
      video.muted = false;
    }
  }, []);

  const setPlaybackRate = React.useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
  }, []);

  const enterFullscreen = React.useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      await container.requestFullscreen();
    } catch {
      // Fullscreen not supported
    }
  }, []);

  const exitFullscreen = React.useCallback(async () => {
    try {
      await document.exitFullscreen();
    } catch {
      // Already exited
    }
  }, []);

  const toggleFullscreen = React.useCallback(async () => {
    if (document.fullscreenElement) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  return {
    videoRef,
    containerRef,
    isVisible,
    isLoading,
    isPlaying,
    isMuted,
    isFullscreen,
    currentTime,
    duration,
    buffered,
    volume,
    playbackRate,
    prefersReducedMotion,
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
    setVolume,
    setPlaybackRate,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
