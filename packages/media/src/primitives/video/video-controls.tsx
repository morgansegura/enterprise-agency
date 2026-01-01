/**
 * VideoControls Component
 *
 * Custom video player controls with accessibility.
 *
 * @module @enterprise/media/primitives/video
 */

"use client";

import * as React from "react";
import { cn } from "@enterprise/tokens";
import { formatTimeString } from "../../utils/video-url-parser";

// ============================================================================
// ICONS (Inline SVG to avoid external dependencies)
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

function PauseIcon({ className }: { className?: string }) {
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
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeMuteIcon({ className }: { className?: string }) {
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
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  );
}

function MaximizeIcon({ className }: { className?: string }) {
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
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function MinimizeIcon({ className }: { className?: string }) {
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
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

// ============================================================================
// TYPES
// ============================================================================

export interface VideoControlsProps {
  /** Whether video is playing */
  isPlaying: boolean;
  /** Whether video is muted */
  isMuted: boolean;
  /** Whether video is fullscreen */
  isFullscreen?: boolean;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Buffered amount in seconds */
  buffered: number;
  /** Volume level (0-1) */
  volume: number;
  /** Toggle play/pause callback */
  onTogglePlay: () => void;
  /** Toggle mute callback */
  onToggleMute: () => void;
  /** Seek callback */
  onSeek: (time: number) => void;
  /** Volume change callback */
  onVolumeChange: (volume: number) => void;
  /** Fullscreen toggle callback */
  onFullscreen?: () => void;
  /** Additional class name */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Custom video controls with progress bar, play/pause, volume, and fullscreen
 *
 * @example
 * ```tsx
 * <VideoControls
 *   isPlaying={isPlaying}
 *   isMuted={isMuted}
 *   currentTime={currentTime}
 *   duration={duration}
 *   buffered={buffered}
 *   volume={volume}
 *   onTogglePlay={togglePlay}
 *   onToggleMute={toggleMute}
 *   onSeek={seek}
 *   onVolumeChange={setVolume}
 *   onFullscreen={enterFullscreen}
 * />
 * ```
 */
export function VideoControls({
  isPlaying,
  isMuted,
  isFullscreen = false,
  currentTime,
  duration,
  buffered,
  volume,
  onTogglePlay,
  onToggleMute,
  onSeek,
  onVolumeChange,
  onFullscreen,
  className,
}: VideoControlsProps) {
  const progressRef = React.useRef<HTMLDivElement>(null);
  const [showVolumeSlider, setShowVolumeSlider] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  // Handle progress bar click/drag
  const handleProgressClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = progressRef.current?.getBoundingClientRect();
      if (!rect || !duration) return;

      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      onSeek(percentage * duration);
    },
    [duration, onSeek],
  );

  // Handle progress bar drag
  const handleProgressDrag = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const rect = progressRef.current?.getBoundingClientRect();
      if (!rect || !duration) return;

      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      onSeek(percentage * duration);
    },
    [isDragging, duration, onSeek],
  );

  // Mouse drag handlers
  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleProgressDrag);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleProgressDrag);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleProgressDrag]);

  // Progress percentages
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  // Handle keyboard shortcuts on progress bar
  const handleProgressKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 5;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          onSeek(Math.min(currentTime + step, duration));
          break;
        case "ArrowLeft":
          e.preventDefault();
          onSeek(Math.max(currentTime - step, 0));
          break;
        case "Home":
          e.preventDefault();
          onSeek(0);
          break;
        case "End":
          e.preventDefault();
          onSeek(duration);
          break;
      }
    },
    [currentTime, duration, onSeek],
  );

  return (
    <div
      data-slot="video-controls"
      className={cn(
        "absolute bottom-0 left-0 right-0",
        "p-3 pt-8",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        "focus-within:opacity-100",
        className,
      )}
    >
      {/* Progress bar */}
      <div
        ref={progressRef}
        data-slot="video-progress"
        className="relative h-1 rounded-full mb-3 cursor-pointer group/progress"
        onClick={handleProgressClick}
        onMouseDown={() => setIsDragging(true)}
        role="slider"
        aria-label="Video progress"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={`${formatTimeString(currentTime)} of ${formatTimeString(duration)}`}
        tabIndex={0}
        onKeyDown={handleProgressKeyDown}
      >
        {/* Background track */}
        <div className="absolute inset-0 rounded-full opacity-30" />

        {/* Buffered */}
        <div
          className="absolute left-0 top-0 h-full rounded-full opacity-40"
          style={{ width: `${bufferedPercent}%` }}
        />

        {/* Current progress */}
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ width: `${currentPercent}%` }}
        />

        {/* Thumb */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full",
            "opacity-0 group-hover/progress:opacity-100 transition-opacity",
            "-translate-x-1/2",
          )}
          style={{ left: `${currentPercent}%` }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          type="button"
          onClick={onTogglePlay}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>

        {/* Volume */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            type="button"
            onClick={onToggleMute}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
            )}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeMuteIcon className="w-5 h-5" />
            ) : (
              <VolumeIcon className="w-5 h-5" />
            )}
          </button>

          {/* Volume slider */}
          {showVolumeSlider && (
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 ml-2"
              aria-label="Volume"
            />
          )}
        </div>

        {/* Time display */}
        <span className="text-sm font-mono tabular-nums">
          {formatTimeString(currentTime)} / {formatTimeString(duration)}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Fullscreen */}
        {onFullscreen && (
          <button
            type="button"
            onClick={onFullscreen}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
            )}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <MinimizeIcon className="w-5 h-5" />
            ) : (
              <MaximizeIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

VideoControls.displayName = "VideoControls";
