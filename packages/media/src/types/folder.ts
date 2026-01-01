/**
 * Media Folder Types
 *
 * Types for folder organization in the media system.
 *
 * @module @enterprise/media/types
 */

// ============================================================================
// FOLDER ENTITY
// ============================================================================

/**
 * Folder for organizing media files
 */
export interface MediaFolder {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  parentId: string | null;
  /** Full path like "/images/properties/2024" */
  path: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  /** Nested children folders */
  children?: MediaFolder[];
  /** Count of media items in this folder */
  mediaCount?: number;
}

/**
 * Lightweight folder for tree views
 */
export interface MediaFolderListItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  path: string;
  mediaCount?: number;
  children?: MediaFolderListItem[];
}

// ============================================================================
// INPUT TYPES
// ============================================================================

/**
 * Input for creating a new folder
 */
export interface CreateFolderInput {
  name: string;
  parentId?: string | null;
}

/**
 * Input for updating a folder (rename)
 */
export interface UpdateFolderInput {
  name?: string;
}

/**
 * Input for moving a folder to a new parent
 */
export interface MoveFolderInput {
  parentId: string | null;
}

// ============================================================================
// FOLDER TREE
// ============================================================================

/**
 * Folder tree node for rendering
 */
export interface FolderTreeNode extends MediaFolderListItem {
  /** Is this folder currently selected */
  isSelected?: boolean;
  /** Is this folder expanded in the tree */
  isExpanded?: boolean;
  /** Depth level in tree (0 = root) */
  level: number;
}

/**
 * Folder tree state
 */
export interface FolderTreeState {
  /** Currently selected folder ID (null = root) */
  selectedFolderId: string | null;
  /** Set of expanded folder IDs */
  expandedFolderIds: Set<string>;
  /** Toggle folder expansion */
  toggleFolder: (folderId: string) => void;
  /** Select a folder */
  selectFolder: (folderId: string | null) => void;
  /** Expand all folders */
  expandAll: () => void;
  /** Collapse all folders */
  collapseAll: () => void;
}
