import * as React from "react";
import type { Asset } from "@/lib/hooks/use-assets";

export interface MediaSelection {
  selectedIds: Set<string>;
  select: (id: string) => void;
  toggle: (id: string, event: React.MouseEvent) => void;
  selectRange: (id: string, assets: Asset[]) => void;
  selectAll: (assets: Asset[]) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  count: number;
}

/**
 * Keyboard-aware selection: plain click sets single, cmd/ctrl toggles, shift selects range.
 */
export function useMediaSelection(): MediaSelection {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const lastSelectedRef = React.useRef<string | null>(null);

  const select = React.useCallback((id: string) => {
    setSelectedIds(new Set([id]));
    lastSelectedRef.current = id;
  }, []);

  const toggle = React.useCallback(
    (id: string, event: React.MouseEvent) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        const multi = event.metaKey || event.ctrlKey;

        if (!multi && !event.shiftKey) {
          return new Set([id]);
        }

        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
      lastSelectedRef.current = id;
    },
    [],
  );

  const selectRange = React.useCallback(
    (id: string, assets: Asset[]) => {
      if (!lastSelectedRef.current) {
        setSelectedIds(new Set([id]));
        lastSelectedRef.current = id;
        return;
      }
      const anchor = assets.findIndex((a) => a.id === lastSelectedRef.current);
      const current = assets.findIndex((a) => a.id === id);
      if (anchor === -1 || current === -1) {
        setSelectedIds(new Set([id]));
        return;
      }
      const [start, end] = anchor < current ? [anchor, current] : [current, anchor];
      const range = assets.slice(start, end + 1).map((a) => a.id);
      setSelectedIds((prev) => new Set([...prev, ...range]));
    },
    [],
  );

  const selectAll = React.useCallback((assets: Asset[]) => {
    setSelectedIds(new Set(assets.map((a) => a.id)));
  }, []);

  const clear = React.useCallback(() => {
    setSelectedIds(new Set());
    lastSelectedRef.current = null;
  }, []);

  const isSelected = React.useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds],
  );

  return {
    selectedIds,
    select,
    toggle,
    selectRange,
    selectAll,
    clear,
    isSelected,
    count: selectedIds.size,
  };
}
