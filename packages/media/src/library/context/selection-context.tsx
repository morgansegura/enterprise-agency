/**
 * Selection Context
 *
 * Context for managing multi-select state in the media library.
 *
 * @module @enterprise/media/library
 */

"use client";

import * as React from "react";

// ============================================================================
// TYPES
// ============================================================================

export interface SelectionContextValue {
  /** Currently selected item IDs */
  selectedIds: Set<string>;
  /** Whether multi-select mode is active */
  isSelecting: boolean;
  /** Last selected item ID (for shift-click range selection) */
  lastSelectedId: string | null;
  /** Select a single item */
  select: (id: string) => void;
  /** Deselect a single item */
  deselect: (id: string) => void;
  /** Toggle selection of a single item */
  toggle: (id: string) => void;
  /** Select multiple items */
  selectMultiple: (ids: string[]) => void;
  /** Select a range (for shift-click) */
  selectRange: (fromId: string, toId: string, allIds: string[]) => void;
  /** Select all items */
  selectAll: (allIds: string[]) => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Check if an item is selected */
  isSelected: (id: string) => boolean;
  /** Get count of selected items */
  selectedCount: number;
  /** Enter multi-select mode */
  enterSelectMode: () => void;
  /** Exit multi-select mode */
  exitSelectMode: () => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const SelectionContext = React.createContext<SelectionContextValue | null>(
  null,
);

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access selection context
 *
 * @example
 * ```tsx
 * const { selectedIds, toggle, clearSelection } = useSelection();
 *
 * <button onClick={() => toggle('item-1')}>
 *   {isSelected('item-1') ? 'Deselect' : 'Select'}
 * </button>
 * ```
 */
export function useSelection(): SelectionContextValue {
  const context = React.useContext(SelectionContext);

  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }

  return context;
}

/**
 * Optional selection hook that returns null if not in provider
 */
export function useSelectionOptional(): SelectionContextValue | null {
  return React.useContext(SelectionContext);
}

// ============================================================================
// PROVIDER
// ============================================================================

export interface SelectionProviderProps {
  /** Children */
  children: React.ReactNode;
  /** Initial selected IDs */
  initialSelectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Maximum number of items that can be selected */
  maxSelections?: number;
}

/**
 * Provider for selection state
 *
 * @example
 * ```tsx
 * <SelectionProvider onSelectionChange={(ids) => console.log(ids)}>
 *   <MediaGrid />
 * </SelectionProvider>
 * ```
 */
export function SelectionProvider({
  children,
  initialSelectedIds = [],
  onSelectionChange,
  maxSelections,
}: SelectionProviderProps) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set(initialSelectedIds),
  );
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [lastSelectedId, setLastSelectedId] = React.useState<string | null>(
    null,
  );

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(selectedIds));
    }
  }, [selectedIds, onSelectionChange]);

  const select = React.useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (maxSelections && prev.size >= maxSelections) {
          return prev;
        }
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setLastSelectedId(id);
    },
    [maxSelections],
  );

  const deselect = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggle = React.useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (maxSelections && next.size >= maxSelections) {
            return prev;
          }
          next.add(id);
        }
        return next;
      });
      setLastSelectedId(id);
    },
    [maxSelections],
  );

  const selectMultiple = React.useCallback(
    (ids: string[]) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const id of ids) {
          if (maxSelections && next.size >= maxSelections) {
            break;
          }
          next.add(id);
        }
        return next;
      });
      if (ids.length > 0) {
        setLastSelectedId(ids[ids.length - 1]);
      }
    },
    [maxSelections],
  );

  const selectRange = React.useCallback(
    (fromId: string, toId: string, allIds: string[]) => {
      const fromIndex = allIds.indexOf(fromId);
      const toIndex = allIds.indexOf(toId);

      if (fromIndex === -1 || toIndex === -1) return;

      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);
      const rangeIds = allIds.slice(start, end + 1);

      selectMultiple(rangeIds);
    },
    [selectMultiple],
  );

  const selectAll = React.useCallback(
    (allIds: string[]) => {
      const idsToSelect = maxSelections
        ? allIds.slice(0, maxSelections)
        : allIds;
      setSelectedIds(new Set(idsToSelect));
      if (idsToSelect.length > 0) {
        setLastSelectedId(idsToSelect[idsToSelect.length - 1]);
      }
    },
    [maxSelections],
  );

  const clearSelection = React.useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
  }, []);

  const isSelected = React.useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  const enterSelectMode = React.useCallback(() => {
    setIsSelecting(true);
  }, []);

  const exitSelectMode = React.useCallback(() => {
    setIsSelecting(false);
    clearSelection();
  }, [clearSelection]);

  const value = React.useMemo(
    () => ({
      selectedIds,
      isSelecting,
      lastSelectedId,
      select,
      deselect,
      toggle,
      selectMultiple,
      selectRange,
      selectAll,
      clearSelection,
      isSelected,
      selectedCount: selectedIds.size,
      enterSelectMode,
      exitSelectMode,
    }),
    [
      selectedIds,
      isSelecting,
      lastSelectedId,
      select,
      deselect,
      toggle,
      selectMultiple,
      selectRange,
      selectAll,
      clearSelection,
      isSelected,
      enterSelectMode,
      exitSelectMode,
    ],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

SelectionProvider.displayName = "SelectionProvider";
