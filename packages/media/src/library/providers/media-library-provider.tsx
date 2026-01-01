/**
 * Media Library Provider
 *
 * Combined provider that wraps all media library contexts.
 *
 * @module @enterprise/media/library
 */

"use client";

import * as React from "react";
import {
  MediaLibraryProvider,
  type MediaLibraryProviderProps,
} from "../context/media-context";
import {
  SelectionProvider,
  type SelectionProviderProps,
} from "../context/selection-context";
import {
  UploadProvider,
  type UploadProviderProps,
} from "../context/upload-context";

// ============================================================================
// TYPES
// ============================================================================

export interface CombinedMediaLibraryProviderProps {
  /** Children */
  children: React.ReactNode;
  /** Media library props */
  mediaLibrary?: Omit<MediaLibraryProviderProps, "children">;
  /** Selection props */
  selection?: Omit<SelectionProviderProps, "children">;
  /** Upload props (required for upload functionality) */
  upload?: Omit<UploadProviderProps, "children">;
}

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Combined provider for all media library contexts
 *
 * @example
 * ```tsx
 * <CombinedMediaLibraryProvider
 *   mediaLibrary={{ initialFilters: { type: 'IMAGE' } }}
 *   selection={{ onSelectionChange: (ids) => console.log(ids) }}
 *   upload={{
 *     onUpload: async (item, onProgress) => {
 *       // Upload implementation
 *       return uploadedMedia;
 *     },
 *   }}
 * >
 *   <MediaLibrary />
 * </CombinedMediaLibraryProvider>
 * ```
 */
export function CombinedMediaLibraryProvider({
  children,
  mediaLibrary,
  selection,
  upload,
}: CombinedMediaLibraryProviderProps) {
  // Build the provider tree from innermost to outermost
  let content = <>{children}</>;

  // Upload provider (innermost)
  if (upload) {
    content = <UploadProvider {...upload}>{content}</UploadProvider>;
  }

  // Selection provider
  content = <SelectionProvider {...selection}>{content}</SelectionProvider>;

  // Media library provider (outermost)
  content = (
    <MediaLibraryProvider {...mediaLibrary}>{content}</MediaLibraryProvider>
  );

  return content;
}

CombinedMediaLibraryProvider.displayName = "CombinedMediaLibraryProvider";

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

// Re-export individual providers for flexibility
export { MediaLibraryProvider, type MediaLibraryProviderProps };
export { SelectionProvider, type SelectionProviderProps };
export { UploadProvider, type UploadProviderProps };
