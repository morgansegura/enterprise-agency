import * as React from "react";
import { cn } from "@/lib/utils";
import { ImageIcon, Film, FileText, User } from "lucide-react";
import "./skeleton.css";

// ============================================================================
// Types
// ============================================================================

export type SkeletonAnimation = "pulse" | "shimmer" | "wave" | "none";
export type LoaderVariant = "spinner" | "dots" | "bars" | "progress" | "logo";
export type LoaderSize = "sm" | "md" | "lg";

interface SkeletonProps extends React.ComponentProps<"div"> {
  animation?: SkeletonAnimation;
}

interface SkeletonTextProps extends SkeletonProps {
  lines?: number;
  lastLineWidth?: string;
}

interface SkeletonAvatarProps extends SkeletonProps {
  size?: number | string;
}

interface ImagePlaceholderProps extends React.ComponentProps<"div"> {
  animation?: SkeletonAnimation;
  icon?: "image" | "video" | "document" | "user" | "none";
  iconSize?: number;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
}

interface PageLoaderProps extends React.ComponentProps<"div"> {
  variant?: LoaderVariant;
  size?: LoaderSize;
  fullscreen?: boolean;
  label?: string;
  logo?: React.ReactNode;
}

interface LoaderProps extends React.ComponentProps<"div"> {
  variant?: LoaderVariant;
  size?: LoaderSize;
}

// ============================================================================
// Base Skeleton
// ============================================================================

function Skeleton({ className, animation = "pulse", ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-animation={animation}
      className={cn(className)}
      {...props}
    />
  );
}

// ============================================================================
// Skeleton Variants
// ============================================================================

function SkeletonText({
  className,
  animation = "shimmer",
  lines = 3,
  lastLineWidth = "60%",
  ...props
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          animation={animation}
          data-slot="skeleton-text"
          className="w-full"
          style={i === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  );
}

function SkeletonHeading({
  className,
  animation = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      animation={animation}
      data-slot="skeleton-heading"
      className={cn(className)}
      {...props}
    />
  );
}

function SkeletonAvatar({
  className,
  animation = "shimmer",
  size = 40,
  ...props
}: SkeletonAvatarProps) {
  return (
    <Skeleton
      animation={animation}
      data-slot="skeleton-avatar"
      className={cn(className)}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}

function SkeletonButton({
  className,
  animation = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      animation={animation}
      data-slot="skeleton-button"
      className={cn("w-24", className)}
      {...props}
    />
  );
}

function SkeletonImage({
  className,
  animation = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      animation={animation}
      data-slot="skeleton-image"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

function SkeletonCard({
  className,
  animation = "shimmer",
  children,
  ...props
}: SkeletonProps & { children?: React.ReactNode }) {
  return (
    <Skeleton
      animation={animation}
      data-slot="skeleton-card"
      className={cn("space-y-4", className)}
      {...props}
    >
      {children || (
        <>
          <SkeletonImage animation={animation} />
          <SkeletonHeading animation={animation} />
          <SkeletonText animation={animation} lines={2} />
        </>
      )}
    </Skeleton>
  );
}

// ============================================================================
// Image Placeholder
// ============================================================================

const placeholderIcons = {
  image: ImageIcon,
  video: Film,
  document: FileText,
  user: User,
  none: null,
};

function ImagePlaceholder({
  className,
  animation = "shimmer",
  icon = "image",
  iconSize = 48,
  aspectRatio = "video",
  ...props
}: ImagePlaceholderProps) {
  const IconComponent = placeholderIcons[icon];
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  return (
    <div
      data-slot="image-placeholder"
      data-animation={animation}
      className={cn(aspectClasses[aspectRatio], className)}
      {...props}
    >
      {IconComponent && (
        <IconComponent
          className="placeholder-icon"
          style={{ width: iconSize, height: iconSize }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Loaders
// ============================================================================

function Loader({
  variant = "spinner",
  size = "md",
  className,
  ...props
}: LoaderProps) {
  const sizeClasses = {
    sm: "loader-spinner-sm",
    md: "",
    lg: "loader-spinner-lg",
  };

  if (variant === "spinner") {
    return (
      <div
        className={cn("loader-spinner", sizeClasses[size], className)}
        {...props}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("loader-dots", className)} {...props}>
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={cn("loader-bars", className)} {...props}>
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (variant === "progress") {
    return (
      <div className={cn("loader-progress", className)} {...props}>
        <div className="loader-progress-bar" />
      </div>
    );
  }

  return null;
}

// ============================================================================
// Page Loader
// ============================================================================

function PageLoader({
  variant = "spinner",
  size = "md",
  fullscreen = false,
  label,
  logo,
  className,
  ...props
}: PageLoaderProps) {
  return (
    <div
      data-slot="page-loader"
      data-variant={fullscreen ? "fullscreen" : undefined}
      className={cn(className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-4">
        {logo ? (
          <div className="loader-logo">{logo}</div>
        ) : (
          <Loader variant={variant} size={size} />
        )}
        {label && (
          <p className="text-sm text-(--muted-foreground) animate-pulse">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Composite Skeletons (Common Patterns)
// ============================================================================

function SkeletonArticle({ className, animation = "shimmer" }: SkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <SkeletonImage animation={animation} className="h-64" />
      <div className="space-y-4">
        <SkeletonHeading animation={animation} className="h-8 w-2/3" />
        <div className="flex items-center gap-3">
          <SkeletonAvatar animation={animation} size={32} />
          <Skeleton animation={animation} className="h-4 w-32" />
          <Skeleton animation={animation} className="h-4 w-24" />
        </div>
        <SkeletonText animation={animation} lines={5} />
      </div>
    </div>
  );
}

function SkeletonProfile({ className, animation = "shimmer" }: SkeletonProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <SkeletonAvatar animation={animation} size={56} />
      <div className="space-y-2 flex-1">
        <Skeleton animation={animation} className="h-5 w-32" />
        <Skeleton animation={animation} className="h-4 w-48" />
      </div>
    </div>
  );
}

function SkeletonTable({
  className,
  animation = "shimmer",
  rows = 5,
  columns = 4,
}: SkeletonProps & { rows?: number; columns?: number }) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} animation={animation} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              animation={animation}
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function SkeletonGrid({
  className,
  animation = "shimmer",
  items = 6,
  columns = 3,
}: SkeletonProps & { items?: number; columns?: number }) {
  return (
    <div
      className={cn("grid gap-4", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} animation={animation} />
      ))}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  Skeleton,
  SkeletonText,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonCard,
  SkeletonArticle,
  SkeletonProfile,
  SkeletonTable,
  SkeletonGrid,
  ImagePlaceholder,
  Loader,
  PageLoader,
};
