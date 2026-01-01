/**
 * Media Library Context
 *
 * Main context for managing media library state.
 *
 * @module @enterprise/media/library
 */

"use client";

import * as React from "react";
import type {
  MediaType,
  MediaViewMode,
  MediaSortBy,
  SortOrder,
} from "../../types";

// ============================================================================
// TYPES
// ============================================================================

export interface MediaLibraryFilters {
  /** Filter by media type */
  type?: MediaType | null;
  /** Filter by folder ID */
  folderId?: string | null;
  /** Search query */
  search?: string;
  /** Filter by tags */
  tags?: string[];
}

export interface MediaLibrarySort {
  /** Sort field */
  sortBy: MediaSortBy;
  /** Sort direction */
  sortOrder: SortOrder;
}

export interface MediaLibraryState {
  /** Current filters */
  filters: MediaLibraryFilters;
  /** Current sort */
  sort: MediaLibrarySort;
  /** View mode (grid or list) */
  viewMode: MediaViewMode;
  /** Current page (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Currently focused item ID */
  focusedItemId: string | null;
  /** Sidebar collapsed state */
  sidebarCollapsed: boolean;
  /** Details panel visible */
  detailsPanelOpen: boolean;
  /** Currently viewed item (for details panel) */
  viewingItemId: string | null;
}

export interface MediaLibraryContextValue extends MediaLibraryState {
  /** Set filter value */
  setFilter: <K extends keyof MediaLibraryFilters>(
    key: K,
    value: MediaLibraryFilters[K],
  ) => void;
  /** Set multiple filters */
  setFilters: (filters: Partial<MediaLibraryFilters>) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Set sort */
  setSort: (sortBy: MediaSortBy, sortOrder?: SortOrder) => void;
  /** Set view mode */
  setViewMode: (mode: MediaViewMode) => void;
  /** Set page */
  setPage: (page: number) => void;
  /** Set page size */
  setPageSize: (size: number) => void;
  /** Navigate to folder */
  navigateToFolder: (folderId: string | null) => void;
  /** Focus an item */
  focusItem: (id: string | null) => void;
  /** Toggle sidebar */
  toggleSidebar: () => void;
  /** Open details panel for an item */
  openDetailsPanel: (itemId: string) => void;
  /** Close details panel */
  closeDetailsPanel: () => void;
  /** Reset to initial state */
  reset: () => void;
}

// ============================================================================
// DEFAULTS
// ============================================================================

const defaultFilters: MediaLibraryFilters = {
  type: null,
  folderId: null,
  search: "",
  tags: [],
};

const defaultSort: MediaLibrarySort = {
  sortBy: "createdAt",
  sortOrder: "desc",
};

const defaultState: MediaLibraryState = {
  filters: defaultFilters,
  sort: defaultSort,
  viewMode: "grid",
  page: 1,
  pageSize: 24,
  focusedItemId: null,
  sidebarCollapsed: false,
  detailsPanelOpen: false,
  viewingItemId: null,
};

// ============================================================================
// CONTEXT
// ============================================================================

const MediaLibraryContext =
  React.createContext<MediaLibraryContextValue | null>(null);

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access media library context
 *
 * @example
 * ```tsx
 * const { filters, setFilter, viewMode, setViewMode } = useMediaLibrary();
 *
 * <button onClick={() => setFilter('type', 'IMAGE')}>
 *   Show Images
 * </button>
 * ```
 */
export function useMediaLibrary(): MediaLibraryContextValue {
  const context = React.useContext(MediaLibraryContext);

  if (!context) {
    throw new Error(
      "useMediaLibrary must be used within a MediaLibraryProvider",
    );
  }

  return context;
}

/**
 * Optional media library hook that returns null if not in provider
 */
export function useMediaLibraryOptional(): MediaLibraryContextValue | null {
  return React.useContext(MediaLibraryContext);
}

// ============================================================================
// PROVIDER
// ============================================================================

export interface MediaLibraryProviderProps {
  /** Children */
  children: React.ReactNode;
  /** Initial filters */
  initialFilters?: Partial<MediaLibraryFilters>;
  /** Initial sort */
  initialSort?: Partial<MediaLibrarySort>;
  /** Initial view mode */
  initialViewMode?: MediaViewMode;
  /** Initial page size */
  initialPageSize?: number;
  /** Callback when filters change */
  onFiltersChange?: (filters: MediaLibraryFilters) => void;
  /** Callback when sort changes */
  onSortChange?: (sort: MediaLibrarySort) => void;
  /** Callback when folder navigation occurs */
  onFolderNavigate?: (folderId: string | null) => void;
}

/**
 * Provider for media library state
 *
 * @example
 * ```tsx
 * <MediaLibraryProvider
 *   initialFilters={{ type: 'IMAGE' }}
 *   onFiltersChange={(filters) => console.log(filters)}
 * >
 *   <MediaLibrary />
 * </MediaLibraryProvider>
 * ```
 */
export function MediaLibraryProvider({
  children,
  initialFilters,
  initialSort,
  initialViewMode = "grid",
  initialPageSize = 24,
  onFiltersChange,
  onSortChange,
  onFolderNavigate,
}: MediaLibraryProviderProps) {
  const [state, setState] = React.useState<MediaLibraryState>(() => ({
    ...defaultState,
    filters: { ...defaultFilters, ...initialFilters },
    sort: { ...defaultSort, ...initialSort },
    viewMode: initialViewMode,
    pageSize: initialPageSize,
  }));

  // Notify parent of filter changes
  React.useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(state.filters);
    }
  }, [state.filters, onFiltersChange]);

  // Notify parent of sort changes
  React.useEffect(() => {
    if (onSortChange) {
      onSortChange(state.sort);
    }
  }, [state.sort, onSortChange]);

  const setFilter = React.useCallback(
    <K extends keyof MediaLibraryFilters>(
      key: K,
      value: MediaLibraryFilters[K],
    ) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, [key]: value },
        page: 1, // Reset page when filter changes
      }));
    },
    [],
  );

  const setFilters = React.useCallback(
    (filters: Partial<MediaLibraryFilters>) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...filters },
        page: 1,
      }));
    },
    [],
  );

  const clearFilters = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: defaultFilters,
      page: 1,
    }));
  }, []);

  const setSort = React.useCallback(
    (sortBy: MediaSortBy, sortOrder?: SortOrder) => {
      setState((prev) => ({
        ...prev,
        sort: {
          sortBy,
          sortOrder:
            sortOrder ??
            (prev.sort.sortBy === sortBy
              ? prev.sort.sortOrder === "asc"
                ? "desc"
                : "asc"
              : "desc"),
        },
        page: 1,
      }));
    },
    [],
  );

  const setViewMode = React.useCallback((mode: MediaViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const setPage = React.useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = React.useCallback((size: number) => {
    setState((prev) => ({ ...prev, pageSize: size, page: 1 }));
  }, []);

  const navigateToFolder = React.useCallback(
    (folderId: string | null) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, folderId },
        page: 1,
      }));
      if (onFolderNavigate) {
        onFolderNavigate(folderId);
      }
    },
    [onFolderNavigate],
  );

  const focusItem = React.useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, focusedItemId: id }));
  }, []);

  const toggleSidebar = React.useCallback(() => {
    setState((prev) => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  const openDetailsPanel = React.useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      detailsPanelOpen: true,
      viewingItemId: itemId,
    }));
  }, []);

  const closeDetailsPanel = React.useCallback(() => {
    setState((prev) => ({
      ...prev,
      detailsPanelOpen: false,
      viewingItemId: null,
    }));
  }, []);

  const reset = React.useCallback(() => {
    setState({
      ...defaultState,
      viewMode: initialViewMode,
      pageSize: initialPageSize,
    });
  }, [initialViewMode, initialPageSize]);

  const value = React.useMemo(
    () => ({
      ...state,
      setFilter,
      setFilters,
      clearFilters,
      setSort,
      setViewMode,
      setPage,
      setPageSize,
      navigateToFolder,
      focusItem,
      toggleSidebar,
      openDetailsPanel,
      closeDetailsPanel,
      reset,
    }),
    [
      state,
      setFilter,
      setFilters,
      clearFilters,
      setSort,
      setViewMode,
      setPage,
      setPageSize,
      navigateToFolder,
      focusItem,
      toggleSidebar,
      openDetailsPanel,
      closeDetailsPanel,
      reset,
    ],
  );

  return (
    <MediaLibraryContext.Provider value={value}>
      {children}
    </MediaLibraryContext.Provider>
  );
}

MediaLibraryProvider.displayName = "MediaLibraryProvider";
