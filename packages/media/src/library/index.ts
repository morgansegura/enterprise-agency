/**
 * Media Library
 *
 * Full-featured media library with folder organization, upload system,
 * bulk operations, and dialogs.
 *
 * @module @enterprise/media/library
 */

// ============================================================================
// CONTEXTS
// ============================================================================

export {
  useMediaLibrary,
  useMediaLibraryOptional,
  type MediaLibraryFilters,
  type MediaLibrarySort,
  type MediaLibraryState,
  type MediaLibraryContextValue,
} from "./context/media-context";

export {
  useSelection,
  useSelectionOptional,
  type SelectionContextValue,
} from "./context/selection-context";

export {
  useUpload,
  useUploadOptional,
  type UploadContextValue,
} from "./context/upload-context";

// ============================================================================
// PROVIDERS
// ============================================================================

export {
  CombinedMediaLibraryProvider,
  type CombinedMediaLibraryProviderProps,
  MediaLibraryProvider,
  type MediaLibraryProviderProps,
  SelectionProvider,
  type SelectionProviderProps,
  UploadProvider,
  type UploadProviderProps,
} from "./providers/media-library-provider";

// ============================================================================
// COMPONENTS (Coming in Phase 7-9)
// ============================================================================

// TODO: Phase 7 - Components
// export { MediaLibrary, type MediaLibraryProps } from "./components/media-library";
// export { MediaGrid } from "./components/media-grid";
// export { MediaGridItem } from "./components/media-grid-item";
// export { MediaDetails } from "./components/media-details";
// export { FolderTree } from "./components/folder-tree";
// export { FolderTreeItem } from "./components/folder-tree-item";
// export { MediaToolbar } from "./components/media-toolbar";

// TODO: Phase 8 - Upload
// export { UploadZone } from "./upload/upload-zone";
// export { UploadProgress } from "./upload/upload-progress";

// TODO: Phase 9 - Dialogs
// export { RenameDialog } from "./dialogs/rename-dialog";
// export { MoveDialog } from "./dialogs/move-dialog";
// export { DeleteDialog } from "./dialogs/delete-dialog";
// export { CropDialog } from "./dialogs/crop-dialog";
