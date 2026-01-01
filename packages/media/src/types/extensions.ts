/**
 * Extension Types
 *
 * Types for future platform extensions (ad management, social media, email marketing).
 * These types define the contracts for how extensions can interact with the media system.
 *
 * @module @enterprise/media/types
 */

import type { MediaType } from "./media";

// ============================================================================
// AD MANAGEMENT EXTENSION
// ============================================================================

/**
 * Ad platform identifiers
 */
export type AdPlatform =
  | "facebook"
  | "instagram"
  | "google"
  | "tiktok"
  | "linkedin"
  | "twitter"
  | "pinterest";

/**
 * Required ad creative size
 */
export interface AdCreativeSize {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Display name (e.g., "Feed", "Story", "Square") */
  name: string;
  /** Whether this size is required */
  required?: boolean;
}

/**
 * Ad management context for media selection
 */
export interface AdCreativeContext {
  /** Campaign ID this creative belongs to */
  campaignId: string;
  /** Ad set ID (optional) */
  adSetId?: string;
  /** Target platform */
  platform: AdPlatform;
  /** Required creative sizes */
  requiredSizes: AdCreativeSize[];
  /** Ad type (image, video, carousel) */
  adType?: "image" | "video" | "carousel";
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Maximum video duration in seconds */
  maxDuration?: number;
}

// ============================================================================
// SOCIAL MEDIA EXTENSION
// ============================================================================

/**
 * Social media platform identifiers
 */
export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "tiktok"
  | "pinterest"
  | "youtube";

/**
 * Social media post type
 */
export type SocialPostType =
  | "feed"
  | "story"
  | "reel"
  | "carousel"
  | "video"
  | "live";

/**
 * Social media context for media selection
 */
export interface SocialMediaContext {
  /** Target platform */
  platform: SocialPlatform;
  /** Post ID (for editing existing posts) */
  postId?: string;
  /** Post type */
  postType?: SocialPostType;
  /** Scheduled post time */
  scheduledFor?: string;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Allowed media types */
  allowedTypes?: MediaType[];
  /** Maximum video duration in seconds */
  maxDuration?: number;
  /** Recommended aspect ratios */
  recommendedAspectRatios?: string[];
}

// ============================================================================
// EMAIL MARKETING EXTENSION
// ============================================================================

/**
 * Email marketing context for media selection
 */
export interface EmailMarketingContext {
  /** Campaign ID */
  campaignId: string;
  /** Template ID (if using a template) */
  templateId?: string;
  /** Whether images need to be hosted (vs embedded) */
  hostingRequired: boolean;
  /** Maximum image width for email clients */
  maxWidth?: number;
  /** Maximum file size in bytes */
  maxFileSize?: number;
  /** Email client compatibility (affects format) */
  targetClients?: ("gmail" | "outlook" | "apple" | "yahoo")[];
}

// ============================================================================
// UNIFIED USAGE CONTEXT
// ============================================================================

/**
 * Usage context type identifiers
 */
export type UsageContextType =
  | "page"
  | "post"
  | "product"
  | "ad"
  | "social"
  | "email"
  | "general";

/**
 * Media dimension constraints
 */
export interface DimensionConstraints {
  /** Minimum width in pixels */
  minWidth?: number;
  /** Minimum height in pixels */
  minHeight?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
  /** Required aspect ratios */
  aspectRatios?: string[];
}

/**
 * Unified context interface for all extensions
 */
export interface MediaUsageContext {
  /** Type of usage context */
  type: UsageContextType;
  /** Entity ID (page, post, product, campaign, etc.) */
  entityId?: string;
  /** Constraints for this context */
  constraints?: {
    /** Maximum file size in bytes */
    maxFileSize?: number;
    /** Allowed media types */
    allowedTypes?: MediaType[];
    /** Dimension constraints */
    dimensions?: DimensionConstraints;
    /** Maximum video duration in seconds */
    maxDuration?: number;
  };
  /** Extension-specific metadata */
  metadata?:
    | AdCreativeContext
    | SocialMediaContext
    | EmailMarketingContext
    | Record<string, unknown>;
}

// ============================================================================
// EXTENSION HOOKS
// ============================================================================

/**
 * Extension hook for validating media selection
 */
export interface MediaValidationHook {
  /** Validate media against context constraints */
  validate: (
    mediaUrl: string,
    context: MediaUsageContext,
  ) => Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;
}

/**
 * Extension hook for transforming media
 */
export interface MediaTransformHook {
  /** Transform media for specific context (resize, crop, format) */
  transform: (
    mediaId: string,
    context: MediaUsageContext,
  ) => Promise<{
    transformedUrl: string;
    variants: Record<string, string>;
  }>;
}

// ============================================================================
// MEDIA LIBRARY EXTENSION POINTS
// ============================================================================

/**
 * Custom toolbar action for extensions
 */
export interface MediaLibraryAction {
  /** Unique action ID */
  id: string;
  /** Display label */
  label: string;
  /** Icon name (from lucide-react) */
  icon?: string;
  /** Action handler */
  handler: (selectedMedia: string[]) => void | Promise<void>;
  /** Whether action is available */
  isAvailable?: (selectedMedia: string[]) => boolean;
  /** Whether action is disabled */
  isDisabled?: (selectedMedia: string[]) => boolean;
}

/**
 * Custom filter for extensions
 */
export interface MediaLibraryFilter {
  /** Unique filter ID */
  id: string;
  /** Display label */
  label: string;
  /** Filter type */
  type: "select" | "multiselect" | "daterange" | "custom";
  /** Filter options (for select types) */
  options?: Array<{ value: string; label: string }>;
  /** Apply filter to query params */
  apply: (value: unknown) => Partial<Record<string, unknown>>;
}

/**
 * Extension registration for media library
 */
export interface MediaLibraryExtension {
  /** Extension ID */
  id: string;
  /** Extension name */
  name: string;
  /** Custom actions to add to toolbar */
  actions?: MediaLibraryAction[];
  /** Custom filters to add */
  filters?: MediaLibraryFilter[];
  /** Usage context (affects default constraints) */
  usageContext?: MediaUsageContext;
  /** Custom metadata panel component */
  metadataPanel?: React.ComponentType<{ media: unknown }>;
}
